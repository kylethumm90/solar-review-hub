
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Claim } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRoleSync } from './useRoleSync';

export function useClaimsFetcher(activeTab: string, searchQuery: string, debugMode: boolean) {
  const { user } = useAuth();
  const { syncUserRoleToDatabase } = useRoleSync();
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  const { data: claimsData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'claims', activeTab, searchQuery],
    queryFn: async () => {
      console.log(`[ClaimsFetcher] Fetching claims with filter: ${activeTab}`);
      
      try {
        // Use regular client for non-admin users
        if (!isAdmin) {
          console.log('[ClaimsFetcher] Using regular client (user is not admin)');
        } else {
          console.log('[ClaimsFetcher] Using admin client to bypass RLS');
          
          // Verify admin status in database as well to ensure RLS policies work correctly
          const { data: dbUser, error: dbUserError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (dbUserError) {
            console.error('[ClaimsFetcher] Error fetching user role from database:', dbUserError);
            toast.error('Error verifying admin permissions');
            
            // If we can't verify, try to create/update the user record
            await syncUserRoleToDatabase(user);
          } else if (dbUser.role !== 'admin') {
            console.warn('[ClaimsFetcher] User metadata shows admin role but database does not match');
            
            // Attempt to sync roles if there's a mismatch
            await syncUserRoleToDatabase(user);
          }
        }
        
        let query = supabase
          .from('claims')
          .select(`
            id,
            user_id,
            company_id,
            status,
            full_name,
            job_title,
            company_email,
            created_at,
            company:companies(id, name, type, is_verified, logo_url)
          `);
        
        // Filter by status based on active tab
        if (activeTab !== 'all') {
          console.log(`[ClaimsFetcher] Applying status filter: ${activeTab}`);
          query = query.eq('status', activeTab);
        }
        
        // Order by newest first
        query = query.order('created_at', { ascending: false });
        
        // Execute the query and log results
        const { data, error, count } = await query;
        
        if (error) {
          console.error('[ClaimsFetcher] Error fetching claims:', error);
          toast.error('Failed to load claims: ' + error.message);
          throw error;
        }
        
        // Extra verification that we actually got data back
        console.log(`[ClaimsFetcher] Fetched ${data?.length || 0} claims:`, data);
        
        return data as Claim[];
      } catch (err) {
        console.error('[ClaimsFetcher] Unexpected error in fetch function:', err);
        toast.error('An unexpected error occurred while loading claims');
        return [];
      }
    },
    refetchInterval: debugMode ? 5000 : false, // Auto-refresh every 5 seconds in debug mode
  });
  
  // Log any query errors
  useEffect(() => {
    if (error) {
      console.error('[ClaimsFetcher] Query error:', error);
    }
  }, [error]);

  // Filter claims based on search query
  const filteredClaims = claimsData?.filter(claim => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    const result = (
      claim.full_name?.toLowerCase().includes(searchTerm) ||
      claim.company_email?.toLowerCase().includes(searchTerm) ||
      claim.job_title?.toLowerCase().includes(searchTerm) ||
      claim.company?.name?.toLowerCase().includes(searchTerm)
    );
    
    return result;
  }) || [];

  return {
    claimsData,
    filteredClaims,
    isLoading,
    error,
    refetch
  };
}
