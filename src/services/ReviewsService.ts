
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ExtendedReview } from '@/components/reviews/types';

// Fetch filtered reviews for a specific company
export const fetchReviewsForCompany = async (
  companyId: string,
  page = 1,
  pageSize = 5,
  sortField = 'created_at',
  sortDirection = 'desc'
) => {
  try {
    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);
    
    if (countError) {
      throw countError;
    }
    
    const totalPages = Math.ceil((count || 0) / pageSize);
    
    // Fetch reviews with user data
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(id, full_name)
      `)
      .eq('company_id', companyId)
      .order(sortField, { ascending: sortDirection === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      throw error;
    }
    
    // Type assertion to ensure the correct structure
    const typedReviews = reviews as unknown as ExtendedReview[];
    
    return {
      reviews: typedReviews,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    toast.error('Failed to load reviews');
    return {
      reviews: [],
      totalPages: 0,
      currentPage: 1
    };
  }
};

// Fetch all reviews with filters
export const fetchAllReviews = async (
  filters: any = {},
  page = 1,
  pageSize = 10,
  sortField = 'created_at',
  sortDirection = 'desc'
) => {
  try {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        company:companies(
          id,
          name,
          description,
          website,
          logo_url,
          type,
          is_verified,
          grade
        ),
        user:users(
          id,
          full_name,
          email
        )
      `);
    
    // Apply filters
    if (filters.vendorTypes && filters.vendorTypes.length > 0) {
      query = query.in('company.type', filters.vendorTypes);
    }
    
    if (filters.companyName) {
      query = query.ilike('company.name', `%${filters.companyName}%`);
    }
    
    if (filters.reviewDate) {
      // Implement date filtering
      const dateRanges = {
        'last-30-days': 30,
        'last-90-days': 90,
        'last-year': 365,
      };
      
      const days = dateRanges[filters.reviewDate as keyof typeof dateRanges];
      if (days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        query = query.gte('created_at', date.toISOString());
      }
    }
    
    // Add states filter
    if (filters.states && filters.states.length > 0) {
      query = query.overlaps('install_states', filters.states);
    }
    
    // Add grade filter
    if (filters.grades && filters.grades.length > 0) {
      query = query.in('company.grade', filters.grades);
    }
    
    // Add still active filter
    if (filters.stillActive) {
      query = query.eq('still_active', filters.stillActive);
    }
    
    // Get count for pagination
    const { count, error: countError } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true });
    
    if (countError) {
      throw countError;
    }
    
    const totalPages = Math.ceil((count || 0) / pageSize);
    
    // Fetch actual data with pagination
    const { data, error } = await query
      .order(sortField, { ascending: sortDirection === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      throw error;
    }
    
    // Cast or transform the data to match the ExtendedReview type
    // Use optional chaining and nullish coalescing for safe access to user properties
    const reviews = data.map(review => ({
      ...review,
      user_id: review.user_id || (review.user && typeof review.user === 'object' && 'id' in review.user ? review.user?.id : ''), 
    })) as unknown as ExtendedReview[];
    
    return {
      reviews,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    toast.error('Failed to load reviews');
    return {
      reviews: [],
      totalPages: 0,
      currentPage: 1
    };
  }
};

// Calculate average score from ratings
export const calculateAverageScore = (review: any): number => {
  const ratings = [
    review.rating_communication,
    review.rating_install_quality,
    review.rating_payment_reliability,
    review.rating_timeliness,
    review.rating_post_install_support
  ].filter(r => typeof r === 'number');
  
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, curr) => acc + curr, 0);
  return parseFloat((sum / ratings.length).toFixed(1));
};

// Export ReviewsService as a namespace to match the import in useReviews.ts
export const ReviewsService = {
  fetchReviewsForCompany,
  fetchAllReviews,
  calculateAverageScore,
  
  // Add these methods that are used in useReviews.ts
  getUniqueVendorTypes: async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('type')
        .not('type', 'is', null);
      
      if (error) throw error;
      
      // Extract unique types
      const types = [...new Set(data.map(item => item.type))];
      return types;
    } catch (error) {
      console.error('Error fetching vendor types:', error);
      return [];
    }
  },
  
  getCompanies: async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, type, is_verified, logo_url');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  },
  
  getStates: async () => {
    try {
      // Get all unique states from reviews
      const { data, error } = await supabase
        .from('reviews')
        .select('install_states')
        .not('install_states', 'is', null);
      
      if (error) throw error;
      
      // Flatten and get unique states
      const allStates = data.flatMap(review => review.install_states || []);
      const uniqueStates = [...new Set(allStates)].filter(Boolean);
      
      return uniqueStates;
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  },
  
  fetchReviews: async (page: number, filters: any, sortOption: string) => {
    // This is a wrapper around fetchAllReviews that handles sorting
    let sortField = 'created_at';
    let sortDirection: 'asc' | 'desc' = 'desc';
    
    switch (sortOption) {
      case 'recent':
        sortField = 'created_at';
        sortDirection = 'desc';
        break;
      case 'oldest':
        sortField = 'created_at';
        sortDirection = 'asc';
        break;
      case 'grade-high':
        sortField = 'average_score';
        sortDirection = 'desc';
        break;
      case 'grade-low':
        sortField = 'average_score';
        sortDirection = 'asc';
        break;
      case 'company':
        sortField = 'company.name';
        sortDirection = 'asc';
        break;
      case 'installs':
        sortField = 'install_count';
        sortDirection = 'desc';
        break;
    }
    
    return fetchAllReviews(filters, page, 10, sortField, sortDirection);
  }
};
