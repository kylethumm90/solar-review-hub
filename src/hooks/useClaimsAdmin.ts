
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Claim } from '@/types';
import { logAdminAction } from '@/utils/adminLogUtils';

export function useClaimsAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // Changed default from 'pending' to 'all'
  
  const { data: claimsData, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'claims', activeTab],
    queryFn: async () => {
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
        query = query.eq('status', activeTab);
      }
      
      // Order by newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        toast.error('Failed to load claims');
        throw error;
      }
      
      console.log('Fetched claims:', data); // Add logging to debug
      return data as Claim[];
    }
  });
  
  // Filter claims based on search query
  const filteredClaims = claimsData?.filter(claim => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    return (
      claim.full_name.toLowerCase().includes(searchTerm) ||
      claim.company_email.toLowerCase().includes(searchTerm) ||
      claim.job_title.toLowerCase().includes(searchTerm) ||
      claim.company?.name?.toLowerCase().includes(searchTerm)
    );
  }) || [];
  
  // Handle claim action (approve/reject) with proper logging
  const handleClaimAction = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      // Get previous status and claim details for logging
      const { data: claimData, error: fetchError } = await supabase
        .from('claims')
        .select('status, company_id, user_id')
        .eq('id', claimId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching claim:', fetchError);
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
        toast.error(`Failed to ${action} claim`);
        throw error;
      }
      
      // For approvals, also update company verification status
      if (action === 'approve' && claimData?.company_id) {
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
        console.error(`Error logging claim ${action}:`, logResult.error);
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
      
      refetch();
    } catch (error) {
      console.error(`Error ${action}ing claim:`, error);
      toast.error(`An error occurred while ${action}ing the claim`);
    }
  };
  
  return {
    claims: filteredClaims,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleClaimAction
  };
}
