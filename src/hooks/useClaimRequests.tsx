
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClaimRequest } from '@/components/admin/claims/types';
import { toast } from 'sonner';

export const useClaimRequests = () => {
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>("pending");
  const pageSize = 10;

  const fetchClaims = async (page: number, status: string | null = null) => {
    setLoading(true);
    try {
      // Get total count for pagination
      let countQuery = supabase.from('claims').select('*', { count: 'exact', head: true });
      
      if (status) {
        countQuery = countQuery.eq('status', status);
      }
      
      const { count } = await countQuery;
      
      setTotalPages(Math.ceil((count || 0) / pageSize));

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
      const claimsWithUsers = [];
      
      for (const claim of claimsData || []) {
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

      setClaims(claimsWithUsers as ClaimRequest[]);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast.error('Failed to load claim requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims(currentPage, activeFilter);
  }, [currentPage, activeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (status: string | null) => {
    setActiveFilter(status);
    setCurrentPage(1);
  };

  const handleActionComplete = () => {
    fetchClaims(currentPage, activeFilter);
  };

  return {
    claims,
    loading,
    currentPage,
    totalPages,
    activeFilter,
    handlePageChange,
    handleFilterChange,
    handleActionComplete
  };
};
