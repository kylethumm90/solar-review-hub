
import { supabase } from '@/integrations/supabase/client';
import { FilterState, ExtendedReview, SimpleCompany } from '@/components/reviews/types';
import { scoreToGrade } from '@/utils/reviewUtils';

export class ReviewsService {
  static async getUniqueVendorTypes(): Promise<string[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('type')
      .order('type');
      
    if (error || !data) {
      console.error("Error fetching vendor types:", error);
      return [];
    }

    return Array.from(new Set(data.map(item => item.type)));
  }

  static async getCompanies(): Promise<SimpleCompany[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, type, is_verified, logo_url')
      .order('name');

    if (error || !data) {
      console.error("Error fetching companies:", error);
      return [];
    }

    return data;
  }

  static async getStates(): Promise<string[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('install_states')
      .not('install_states', 'is', null);
      
    if (error || !data) {
      console.error("Error fetching states:", error);
      return [];
    }

    const allStates = data.flatMap(review => review.install_states || []);
    return Array.from(new Set(allStates)).sort();
  }

  static async fetchReviews(
    currentPage: number, 
    filters: FilterState, 
    sortOption: string
  ): Promise<{ 
    reviews: ExtendedReview[], 
    totalPages: number 
  }> {
    // Build the query
    let query = supabase
      .from('reviews')
      .select(`
        id, company_id, user_id, review_title, review_details, 
        text_feedback, average_score, is_anonymous, created_at,
        install_count, install_states, still_active,
        rating_communication, rating_install_quality, rating_payment_reliability,
        rating_timeliness, rating_post_install_support,
        company:companies (id, name, type, logo_url)
      `, { count: 'exact' })
      .eq('verified', true); // Only show verified reviews
      
    // Apply sorting
    if (sortOption === 'grade-high') {
      query = query.order('average_score', { ascending: false });
    } else if (sortOption === 'installs') {
      query = query.order('install_count', { ascending: false });
    } else {
      // Default to most recent
      query = query.order('created_at', { ascending: false });
    }
    
    // Apply filters
    if (filters.vendorTypes.length > 0) {
      query = query.in('company.type', filters.vendorTypes);
    }
    
    if (filters.companyName) {
      query = query.eq('company_id', filters.companyName);
    }
    
    if (filters.reviewDate) {
      const now = new Date();
      let daysAgo;
      
      switch (filters.reviewDate) {
        case '30days':
          daysAgo = 30;
          break;
        case '90days':
          daysAgo = 90;
          break;
        case '365days':
          daysAgo = 365;
          break;
        default:
          daysAgo = null;
      }
      
      if (daysAgo) {
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - daysAgo);
        query = query.gte('created_at', startDate.toISOString());
      }
    }
    
    if (filters.stillActive === 'yes') {
      query = query.eq('still_active', 'yes');
    } else if (filters.stillActive === 'no') {
      query = query.eq('still_active', 'no');
    }
    
    // Add pagination
    const PAGE_SIZE = 10;
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;
    query = query.range(start, end);
    
    try {
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Apply post-fetch filters
      let filteredData = data || [];
      
      // Filter by states if applicable
      if (filters.states.length > 0) {
        filteredData = filteredData.filter(review => {
          const reviewStates = review.install_states || [];
          return filters.states.some(state => reviewStates.includes(state));
        });
      }
      
      // Filter by grades if applicable
      if (filters.grades.length > 0) {
        filteredData = filteredData.filter(review => {
          const grade = scoreToGrade(review.average_score || 0);
          return filters.grades.includes(grade);
        });
      }
      
      // Sort by company name if selected
      if (sortOption === 'company') {
        filteredData = filteredData.sort((a, b) => {
          const nameA = a.company?.name || '';
          const nameB = b.company?.name || '';
          return nameA.localeCompare(nameB);
        });
      }
      
      // Transform data into ExtendedReview[]
      const typedData: ExtendedReview[] = filteredData.map(item => ({
        ...item,
        // Ensure core review properties are present
        rating_communication: item.rating_communication,
        rating_install_quality: item.rating_install_quality,
        rating_payment_reliability: item.rating_payment_reliability,
        rating_timeliness: item.rating_timeliness,
        rating_post_install_support: item.rating_post_install_support,
        text_feedback: item.text_feedback,
        id: item.id,
        company_id: item.company_id,
        user_id: item.user_id,
        created_at: item.created_at,
        // Ensure company is properly typed
        company: item.company
      }));

      // Calculate total pages
      const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;
      
      return { reviews: typedData, totalPages };
      
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return { reviews: [], totalPages: 1 };
    }
  }
}
