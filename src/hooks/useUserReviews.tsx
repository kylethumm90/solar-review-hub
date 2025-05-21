
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Review, Company } from '@/types';

export type UserReviewWithCompany = Review & {
  company: Company;
  verification_status?: string;
};

type SortOption = 'newest' | 'highest';

export const useUserReviews = () => {
  const [reviews, setReviews] = useState<UserReviewWithCompany[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const { user } = useAuth();

  const fetchUserReviews = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First, get all reviews by this user
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          company_id,
          average_score,
          review_title,
          review_details,
          text_feedback,
          verification_status,
          rating_communication,
          rating_install_quality,
          rating_payment_reliability,
          rating_timeliness,
          rating_post_install_support,
          created_at,
          reviewer_id
        `)
        .eq('user_id', user.id);

      if (reviewsError) throw reviewsError;
      
      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        setLoading(false);
        return;
      }

      // Get all company data for the reviews
      const companyIds = reviewsData.map(review => review.company_id);
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('id, name, description, logo_url, type, is_verified, created_at')
        .in('id', companyIds);

      if (companiesError) throw companiesError;

      // Combine the data
      const userReviewsWithCompanies = reviewsData.map(review => {
        const company = companiesData?.find(c => c.id === review.company_id);
        // Fill in the required reviewer_id if it's missing from the database
        const reviewWithReviewer = {
          ...review,
          reviewer_id: review.reviewer_id || review.user_id || user.id,
          company: company || {
            id: review.company_id,
            name: 'Unknown Company',
            description: '',
            type: '',
            is_verified: false,
            created_at: new Date().toISOString()
          }
        } as unknown as UserReviewWithCompany;
        
        return reviewWithReviewer;
      });

      // Sort the reviews
      const sortedReviews = sortReviews(userReviewsWithCompanies, sortBy);
      setReviews(sortedReviews);
    } catch (error: any) {
      console.error('Error fetching user reviews:', error);
      toast.error('Failed to load your reviews');
    } finally {
      setLoading(false);
    }
  };

  const sortReviews = (reviewsToSort: UserReviewWithCompany[], sortOption: SortOption) => {
    if (sortOption === 'newest') {
      return [...reviewsToSort].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === 'highest') {
      return [...reviewsToSort].sort((a, b) => 
        (b.average_score || 0) - (a.average_score || 0)
      );
    }
    return reviewsToSort;
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setReviews(prev => sortReviews([...prev], option));
  };

  useEffect(() => {
    fetchUserReviews();
  }, [user]);

  return {
    reviews,
    loading,
    sortBy,
    handleSortChange,
    refreshReviews: fetchUserReviews
  };
};
