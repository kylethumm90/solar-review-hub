
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Review, Claim, Company } from '@/types';
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
        company:companies(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
    
    // Transform data to match Review type
    const typedReviews: Review[] = (data || []).map(item => {
      const { company, ...review } = item;
      return {
        ...review,
        company: company as Company
      };
    });
    
    return typedReviews;
  };

  // Fetch claims for the dashboard
  const fetchClaims = async () => {
    if (!user) return [];
    
    const { data: claimsData, error } = await supabase
      .from('claims')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching claims:", error);
      throw error;
    }
    
    // Transform data to match Claim type
    const typedClaims: Claim[] = (claimsData || []).map(item => {
      const { company, status, ...claim } = item;
      return {
        ...claim,
        status: status as "pending" | "approved" | "rejected",
        company: company as Company
      };
    });
    
    return typedClaims;
  };

  // Use React Query hooks for data fetching with improved configuration
  const { 
    data: reviews = [], 
    isLoading: isReviewsLoading,
    error: reviewsError
  } = useQuery({
    queryKey: ['dashboard-reviews', user?.id],
    queryFn: fetchReviews,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
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
    refetchOnWindowFocus: false,
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
    reviews,
    claims,
    isLoading,
    hasErrors
  };
};
