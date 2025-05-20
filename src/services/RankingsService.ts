
import { supabase } from '@/integrations/supabase/client';
import { scoreToGrade } from '@/utils/reviewUtils';

export class RankingsService {
  static async getUniqueVendorTypes(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('type')
        .order('type');
        
      if (error) {
        console.error("Error fetching vendor types:", error);
        return [];
      }

      // Filter out null types and get unique values
      return Array.from(new Set(data.filter(item => item.type).map(item => item.type)));
    } catch (e) {
      console.error("Exception fetching vendor types:", e);
      return [];
    }
  }

  static async getOperatingRegions(): Promise<string[]> {
    try {
      // First check if the operating_states column exists by checking if a query returns a certain error
      const testQuery = await supabase
        .from('companies')
        .select('operating_states')
        .limit(1);
      
      // If we get an error about the column not existing, return an empty array
      if (testQuery.error && testQuery.error.message && 
          testQuery.error.message.includes('operating_states')) {
        console.log("operating_states column does not exist in companies table");
        return [];
      }
      
      // If we get here, the column exists, so proceed with the query
      const { data, error } = await supabase
        .from('companies')
        .select('operating_states');
      
      if (error) {
        console.error("Error fetching operating regions:", error);
        return [];
      }

      if (!data || !Array.isArray(data)) {
        return [];
      }
      
      // Flatten all operating_states arrays and get unique values
      const allRegions: string[] = [];
      data.forEach(company => {
        if (company) {
          // Safely access operating_states with type checking
          const states = company.operating_states;
          if (states && Array.isArray(states)) {
            states.forEach(state => {
              if (state && !allRegions.includes(state)) {
                allRegions.push(state);
              }
            });
          }
        }
      });
      
      return allRegions.sort();
    } catch (e) {
      console.error("Exception fetching operating regions:", e);
      return [];
    }
  }

  static async getRankings(
    sortOption: string = 'grade',
    vendorType: string | null = null,
    grade: string | null = null,
    region: string | null = null
  ): Promise<any[]> {
    try {
      // First, get all companies with their reviews
      let query = supabase
        .from('companies')
        .select(`
          id, name, type, logo_url, is_verified, last_verified,
          reviews(average_score, install_count, verified)
        `);

      // Apply type filter if specified
      if (vendorType) {
        query = query.eq('type', vendorType);
      }

      // Check if operating_states column exists before trying to use it
      const hasOperatingStates = await this.checkOperatingStatesColumn();

      // Apply region filter if specified, only if operating_states column exists
      if (region && region.trim() && hasOperatingStates) {
        try {
          query = query.contains('operating_states', [region]);
        } catch (e) {
          console.error("Error applying operating_states filter:", e);
          // Continue without this filter
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching rankings:", error);
        return [];
      }

      if (!data || !Array.isArray(data)) {
        return [];
      }

      // Process and calculate metrics for each company
      const rankings = data.map(company => {
        // Handle potentially missing reviews array
        const reviews = company.reviews || [];
        
        // Filter to only include verified reviews
        const verifiedReviews = Array.isArray(reviews) 
          ? reviews.filter((review: any) => review && review.verified)
          : [];
          
        const reviewCount = verifiedReviews.length;
        
        // Calculate average score across all verified reviews
        const totalScore = verifiedReviews.reduce((sum: number, review: any) => {
          return sum + (review && review.average_score ? review.average_score : 0);
        }, 0);
        
        const averageScore = reviewCount > 0 ? totalScore / reviewCount : 0;
        const grade = scoreToGrade(averageScore);
        
        // Sum up install counts
        const installCount = verifiedReviews.reduce((sum: number, review: any) => {
          return sum + (review && review.install_count ? review.install_count : 0);
        }, 0);

        // For sorting by recent activity
        const mostRecentReview = verifiedReviews.length > 0 
          ? new Date(Math.max(...verifiedReviews.map((r: any) => 
              r && r.created_at ? new Date(r.created_at).getTime() : 0
            ))) 
          : new Date(0);

        return {
          ...company,
          review_count: reviewCount,
          average_score: averageScore,
          grade: grade,
          install_count: installCount,
          most_recent_review: mostRecentReview,
        };
      });

      // Apply grade filter if specified
      let filteredRankings = rankings;
      if (grade) {
        filteredRankings = rankings.filter(company => company.grade === grade);
      }

      // Apply sorting
      switch (sortOption) {
        case 'grade':
          return filteredRankings.sort((a, b) => b.average_score - a.average_score);
        case 'reviews':
          return filteredRankings.sort((a, b) => b.review_count - a.review_count);
        case 'installs':
          return filteredRankings.sort((a, b) => b.install_count - a.install_count);
        case 'recent':
          return filteredRankings.sort((a, b) => 
            b.most_recent_review.getTime() - a.most_recent_review.getTime());
        case 'alpha':
          return filteredRankings.sort((a, b) => a.name.localeCompare(b.name));
        default:
          return filteredRankings.sort((a, b) => b.average_score - a.average_score);
      }
    } catch (e) {
      console.error("Exception fetching rankings:", e);
      return [];
    }
  }

  // Helper method to check if operating_states column exists
  private static async checkOperatingStatesColumn(): Promise<boolean> {
    try {
      const result = await supabase
        .from('companies')
        .select('operating_states')
        .limit(1);
      
      // If there's an error mentioning the column, it doesn't exist
      if (result.error && result.error.message && 
          result.error.message.includes('operating_states')) {
        return false;
      }
      
      return true;
    } catch (e) {
      console.error("Error checking operating_states column:", e);
      return false;
    }
  }
}
