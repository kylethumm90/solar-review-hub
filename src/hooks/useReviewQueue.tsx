
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Review } from '@/components/admin/reviews/types';

export const useReviewQueue = (initialPage: number = 1, initialFilter: string | null = null) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(initialFilter);
  const pageSize = 10;

  const fetchReviews = async (page: number, status: string | null = null) => {
    setLoading(true);
    try {
      // Get total count for pagination
      let countQuery = supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });
      
      if (status) {
        if (status === 'pending') {
          // Include both 'pending' and NULL values for pending filter
          countQuery = countQuery.or(`verification_status.eq.${status},verification_status.is.null`);
        } else {
          countQuery = countQuery.eq('verification_status', status);
        }
      }
      
      const { count } = await countQuery;
      
      setTotalPages(Math.ceil((count || 0) / pageSize));

      // Step 1: Fetch reviews without joining with users
      let query = supabase
        .from('reviews')
        .select(`
          id,
          review_title,
          average_score,
          verification_status,
          created_at,
          user_id,
          company_id
        `);
        
      if (status) {
        if (status === 'pending') {
          // Include both 'pending' and NULL values for pending filter
          query = query.or(`verification_status.eq.${status},verification_status.is.null`);
        } else {
          query = query.eq('verification_status', status);
        }
      }
      
      query = query.order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data: reviewsData, error: reviewsError } = await query;

      if (reviewsError) throw reviewsError;
      
      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        setLoading(false);
        return;
      }
      
      // Step 2: Fetch company data for all reviews
      const companyIds = reviewsData.map(review => review.company_id);
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('id, name')
        .in('id', companyIds);
      
      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
      }
      
      // Step 3: Fetch user data for all reviews
      const userIds = reviewsData.map(review => review.user_id);
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name')
        .in('id', userIds);
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
      }
      
      // Step 4: Combine the data
      const combinedReviews = reviewsData.map(review => {
        const company = companiesData?.find(c => c.id === review.company_id);
        const user = usersData?.find(u => u.id === review.user_id);
        
        return {
          ...review,
          company: company ? { name: company.name } : undefined,
          user: user ? { 
            id: user.id,
            email: user.email, 
            full_name: user.full_name
          } : undefined
        };
      });

      setReviews(combinedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage, activeFilter);
  }, [currentPage, activeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleFilterChange = (status: string | null) => {
    setActiveFilter(status);
    setCurrentPage(1);
  };

  const handleActionComplete = () => {
    fetchReviews(currentPage, activeFilter);
  };

  return {
    reviews,
    loading,
    currentPage,
    totalPages,
    activeFilter,
    handlePageChange,
    handleFilterChange,
    handleActionComplete
  };
};
