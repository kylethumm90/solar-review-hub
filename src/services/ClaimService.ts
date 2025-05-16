
import { supabase } from '@/integrations/supabase/client';
import { ClaimRequest } from '@/components/admin/claims/types';
import { toast } from 'sonner';

export const fetchClaimRequests = async (page: number, pageSize: number, status: string | null = null) => {
  try {
    // Get total count for pagination
    let countQuery = supabase.from('claims').select('*', { count: 'exact', head: true });
    
    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    
    const { count } = await countQuery;
    
    const totalPages = Math.ceil((count || 0) / pageSize);

    // Fetch the claims with company data
    let query = supabase.from('claims')
      .select(`
        id,
        full_name,
        job_title,
        company_email,
        created_at,
        status,
        user_id,
        company:companies(id, name)
      `);
      
    if (status) {
      query = query.eq('status', status);
    }
      
    query = query.order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    const { data: claimsData, error } = await query;

    if (error) {
      throw error;
    }
    
    // Fetch user data separately for each claim
    const claimsWithUsers = await attachUserDataToClaims(claimsData || []);
    
    return {
      claims: claimsWithUsers,
      totalPages
    };
  } catch (error) {
    console.error('Error fetching claims:', error);
    toast.error('Failed to load claim requests');
    throw error;
  }
};

// Helper function to attach user data to claims
const attachUserDataToClaims = async (claims: any[]) => {
  const claimsWithUsers = [];
  
  for (const claim of claims) {
    if (claim.user_id) {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, full_name')
          .eq('id', claim.user_id)
          .single();
        
        if (userError) {
          console.error('Error fetching user for claim:', userError);
          claimsWithUsers.push({
            ...claim,
            user: { id: claim.user_id, email: 'Unknown', full_name: 'Unknown User' }
          });
        } else {
          claimsWithUsers.push({
            ...claim,
            user: userData
          });
        }
      } catch (error) {
        console.error('Error processing user data for claim:', error);
        claimsWithUsers.push({
          ...claim,
          user: { id: claim.user_id, email: 'Unknown', full_name: 'Unknown User' }
        });
      }
    } else {
      claimsWithUsers.push({
        ...claim,
        user: { id: 'unknown', email: 'Unknown', full_name: 'Unknown User' }
      });
    }
  }
  
  return claimsWithUsers as ClaimRequest[];
};

export const updateClaimStatus = async (claimId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('claims')
      .update({ status })
      .eq('id', claimId);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating claim status:', error);
    toast.error('Failed to update claim status');
    throw error;
  }
};
