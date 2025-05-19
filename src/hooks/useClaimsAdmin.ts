
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Claim } from '@/types';
import { logAdminAction } from '@/utils/adminLogUtils';
import { useAuth } from '@/context/AuthContext';

export function useClaimsAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [debugMode, setDebugMode] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  // Log tab changes to help debug filtering issues
  useEffect(() => {
    console.log(`[ClaimsAdmin] Active tab changed to: ${activeTab}`);
  }, [activeTab]);
  
  // Log search queries to track filtering behavior
  useEffect(() => {
    if (searchQuery) {
      console.log(`[ClaimsAdmin] Search query updated: "${searchQuery}"`);
    }
  }, [searchQuery]);

  const { data: claimsData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'claims', activeTab, searchQuery],
    queryFn: async () => {
      console.log(`[ClaimsAdmin] Fetching claims with filter: ${activeTab}`);
      
      try {
        // Use regular client for non-admin users
        if (!isAdmin) {
          console.log('[ClaimsAdmin] Using regular client (user is not admin)');
        } else {
          console.log('[ClaimsAdmin] Using admin client to bypass RLS');
          
          // Verify admin status in database as well to ensure RLS policies work correctly
          const { data: dbUser, error: dbUserError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (dbUserError) {
            console.error('[ClaimsAdmin] Error fetching user role from database:', dbUserError);
            toast.error('Error verifying admin permissions');
            
            // If we can't verify, try to create/update the user record
            await syncUserRoleToDatabase(user);
          } else if (dbUser.role !== 'admin') {
            console.warn('[ClaimsAdmin] User metadata shows admin role but database does not match');
            
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
          console.log(`[ClaimsAdmin] Applying status filter: ${activeTab}`);
          query = query.eq('status', activeTab);
        }
        
        // Order by newest first
        query = query.order('created_at', { ascending: false });
        
        // Execute the query and log results
        const { data, error, count } = await query;
        
        if (error) {
          console.error('[ClaimsAdmin] Error fetching claims:', error);
          toast.error('Failed to load claims: ' + error.message);
          throw error;
        }
        
        // Extra verification that we actually got data back
        console.log(`[ClaimsAdmin] Fetched ${data?.length || 0} claims:`, data);
        
        // Additional verification for pending claims specifically
        const pendingClaims = data?.filter(claim => claim.status === 'pending') || [];
        console.log(`[ClaimsAdmin] Found ${pendingClaims.length} pending claims`);
        
        // Check for null or undefined values in critical fields
        const problematicClaims = data?.filter(claim => 
          !claim.id || !claim.status || !claim.company_id || !claim.user_id
        ) || [];
        
        if (problematicClaims.length > 0) {
          console.warn('[ClaimsAdmin] Found claims with missing critical fields:', problematicClaims);
        }
        
        // Verify company data is being correctly joined
        const claimsWithMissingCompany = data?.filter(claim => !claim.company) || [];
        if (claimsWithMissingCompany.length > 0) {
          console.warn('[ClaimsAdmin] Claims with missing company data:', claimsWithMissingCompany);
        }
        
        return data as Claim[];
      } catch (err) {
        console.error('[ClaimsAdmin] Unexpected error in fetch function:', err);
        toast.error('An unexpected error occurred while loading claims');
        return [];
      }
    },
    refetchInterval: debugMode ? 5000 : false, // Auto-refresh every 5 seconds in debug mode
  });
  
  // Function to ensure user role synchronization between auth metadata and database
  const syncUserRoleToDatabase = async (currentUser) => {
    if (!currentUser) return;
    
    try {
      const role = currentUser.user_metadata?.role || 'user';
      console.log(`[ClaimsAdmin] Syncing user role to database: ${role}`);
      
      // Upsert to ensure the user exists in the users table with correct role
      const { error } = await supabase
        .from('users')
        .upsert({
          id: currentUser.id,
          email: currentUser.email,
          role: role,
          full_name: currentUser.user_metadata?.full_name || 'User'
        }, {
          onConflict: 'id'
        });
      
      if (error) {
        console.error('[ClaimsAdmin] Error syncing user role to database:', error);
        toast.error('Failed to sync user permissions');
        return false;
      }
      
      toast.success('User permissions synchronized');
      return true;
    } catch (err) {
      console.error('[ClaimsAdmin] Error in syncUserRoleToDatabase:', err);
      return false;
    }
  };
  
  // Log any query errors
  useEffect(() => {
    if (error) {
      console.error('[ClaimsAdmin] Query error:', error);
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
  
  // Log the filtered results
  useEffect(() => {
    if (searchQuery) {
      console.log(`[ClaimsAdmin] After filtering by "${searchQuery}": ${filteredClaims.length} claims remain`);
    }
  }, [filteredClaims, searchQuery]);
  
  // Handle claim action (approve/reject) with proper logging
  const handleClaimAction = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      console.log(`[ClaimsAdmin] Processing ${action} action for claim ${claimId}`);
      
      // Get previous status and claim details for logging
      const { data: claimData, error: fetchError } = await supabase
        .from('claims')
        .select('status, company_id, user_id')
        .eq('id', claimId)
        .single();
      
      if (fetchError) {
        console.error('[ClaimsAdmin] Error fetching claim:', fetchError);
        toast.error('Failed to fetch claim details');
        return;
      }
      
      const previousStatus = claimData?.status || 'pending';
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      // Only proceed if the status is actually changing
      if (previousStatus === newStatus) {
        toast.info(`Claim is already ${newStatus}`);
        return;
      }
      
      // Update claim status
      const { error } = await supabase
        .from('claims')
        .update({ status: newStatus })
        .eq('id', claimId);
      
      if (error) {
        console.error(`[ClaimsAdmin] Error ${action}ing claim:`, error);
        toast.error(`Failed to ${action} claim`);
        throw error;
      }
      
      // For approvals, also update company verification status
      if (action === 'approve' && claimData?.company_id) {
        console.log(`[ClaimsAdmin] Updating company ${claimData.company_id} verification status`);
        
        const { data: companyData } = await supabase
          .from('companies')
          .select('is_verified, last_verified')
          .eq('id', claimData.company_id)
          .single();
        
        await supabase
          .from('companies')
          .update({ 
            is_verified: true, 
            last_verified: new Date().toISOString() 
          })
          .eq('id', claimData.company_id);
        
        // Log company verification action
        await logAdminAction({
          action_type: 'verify_company',
          target_entity: 'company',
          target_id: claimData.company_id,
          details: { 
            previous_status: {
              is_verified: companyData?.is_verified || false,
              last_verified: companyData?.last_verified || null
            }, 
            new_status: {
              is_verified: true,
              last_verified: new Date().toISOString()
            },
            related_claim_id: claimId
          }
        });
      }
      
      // Log the claim action
      const actionType = action === 'approve' ? 'approve_claim' : 'reject_claim';
      const logResult = await logAdminAction({
        action_type: actionType,
        target_entity: 'claim',
        target_id: claimId,
        details: { previous_status: previousStatus, new_status: newStatus }
      });
      
      if (logResult.error) {
        console.error(`[ClaimsAdmin] Error logging claim ${action}:`, logResult.error);
        const isStatusChange = previousStatus === 'approved' || previousStatus === 'rejected';
        const message = isStatusChange 
          ? `Claim status changed from ${previousStatus} to ${newStatus}, but failed to log action` 
          : `Claim ${action === 'approve' ? 'approved' : 'rejected'} successfully, but failed to log action`;
          
        toast.error(message);
      } else {
        const isStatusChange = previousStatus === 'approved' || previousStatus === 'rejected';
        const message = isStatusChange 
          ? `Claim status changed from ${previousStatus} to ${newStatus}` 
          : `Claim ${action === 'approve' ? 'approved' : 'rejected'} successfully`;
          
        toast.success(message);
      }
      
      console.log(`[ClaimsAdmin] Successfully ${action}ed claim ${claimId}`);
      refetch();
    } catch (error) {
      console.error(`[ClaimsAdmin] Error ${action}ing claim:`, error);
      toast.error(`An error occurred while ${action}ing the claim`);
    }
  };

  // Verify all claims without filtering for debugging
  const fetchAllClaims = async () => {
    try {
      console.log("[ClaimsAdmin] Performing DIRECT DB CHECK to bypass any filters");
      
      // Make sure to synchronize user role if in debug mode
      if (debugMode && user) {
        await syncUserRoleToDatabase(user);
      }
      
      const { data, error } = await supabase
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
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('[ClaimsAdmin] Error in direct DB check:', error);
        return;
      }
      
      console.log('[ClaimsAdmin] Direct DB check - All claims:', data);
      console.log('[ClaimsAdmin] Direct DB check - Pending claims:', data?.filter(c => c.status === 'pending'));
      
      return data;
    } catch (err) {
      console.error('[ClaimsAdmin] Error in direct DB check:', err);
    }
  };
  
  // Run a direct DB check on mount and sync user role
  useEffect(() => {
    if (user) {
      // Sync user role on component mount
      syncUserRoleToDatabase(user).then(() => {
        // After sync, fetch all claims
        fetchAllClaims();
      });
    }
  }, [user]);
  
  return {
    claims: filteredClaims,
    rawClaimsData: claimsData, // Expose raw data for debugging
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleClaimAction,
    debugMode,
    setDebugMode,
    refetchAllClaims: fetchAllClaims
  };
}
