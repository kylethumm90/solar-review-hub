
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Review, Claim } from '@/types';
import { useAuth } from '@/context/AuthContext';

export const useDashboardData = () => {
  const { user } = useAuth();

  // Fetch reviews for the dashboard
  const fetchReviews = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        company:companies(id, name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  // Fetch claims for the dashboard
  const fetchClaims = async () => {
    if (!user) return [];
    
    const { data: claimsData, error } = await supabase
      .from('claims')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // If claims fetch succeeded, get company names in a separate query
    const claimsWithCompanies = [];
    
    for (const claim of claimsData || []) {
      if (claim.company_id) {
        // Fetch company for this claim
        const { data: companyData } = await supabase
          .from('companies')
          .select('id, name')
          .eq('id', claim.company_id)
          .single();
          
        claimsWithCompanies.push({
          ...claim,
          company: companyData
        });
      } else {
        claimsWithCompanies.push(claim);
      }
    }
    
    return claimsWithCompanies;
  };

  // Use React Query hooks for data fetching
  const { 
    data: reviews = [], 
    isLoading: isReviewsLoading,
    error: reviewsError
  } = useQuery({
    queryKey: ['dashboard-reviews', user?.id],
    queryFn: fetchReviews,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (err: Error) => {
        console.error('Error fetching reviews:', err);
        toast.error("Error loading reviews. Please try again later.");
      }
    }
  });

  const { 
    data: claims = [], 
    isLoading: isClaimsLoading,
    error: claimsError
  } = useQuery({
    queryKey: ['dashboard-claims', user?.id],
    queryFn: fetchClaims,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (err: Error) => {
        console.error('Error fetching claims:', err);
        toast.error("Error loading claims. Please try again later.");
      }
    }
  });

  const isLoading = isReviewsLoading || isClaimsLoading;
  const hasErrors = !!reviewsError || !!claimsError;

  return {
    reviews: reviews as unknown as Review[],
    claims: claims as unknown as Claim[],
    isLoading,
    hasErrors
  };
};
