
import { supabase } from '@/integrations/supabase/client';
import { scoreToGrade } from '@/utils/reviewUtils';

export class RankingsService {
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

  static async getOperatingRegions(): Promise<string[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('operating_states')
      .not('operating_states', 'is', null);
      
    if (error || !data) {
      console.error("Error fetching operating regions:", error);
      return [];
    }

    // Flatten the array of arrays and get unique values
    const allRegions = data.flatMap(company => company.operating_states || []);
    return Array.from(new Set(allRegions)).sort();
  }

  static async getRankings(
    sortOption: string = 'grade',
    vendorType: string | null = null,
    grade: string | null = null,
    region: string | null = null
  ): Promise<any[]> {
    // First, get all companies with their reviews
    let query = supabase
      .from('companies')
      .select(`
        id, name, type, logo_url, is_verified, operating_states, last_verified,
        reviews:reviews(average_score, install_count, verified)
      `);

    // Apply type filter if specified
    if (vendorType) {
      query = query.eq('type', vendorType);
    }

    // Apply region filter if specified
    if (region) {
      query = query.contains('operating_states', [region]);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error("Error fetching rankings:", error);
      return [];
    }

    // Process and calculate metrics for each company
    const rankings = data.map(company => {
      // Filter to only include verified reviews
      const verifiedReviews = (company.reviews || []).filter((review: any) => review.verified);
      const reviewCount = verifiedReviews.length;
      
      // Calculate average score across all verified reviews
      const totalScore = verifiedReviews.reduce((sum: number, review: any) => {
        return sum + (review.average_score || 0);
      }, 0);
      
      const averageScore = reviewCount > 0 ? totalScore / reviewCount : 0;
      const grade = scoreToGrade(averageScore);
      
      // Sum up install counts
      const installCount = verifiedReviews.reduce((sum: number, review: any) => {
        return sum + (review.install_count || 0);
      }, 0);

      // For sorting by recent activity
      const mostRecentReview = verifiedReviews.length > 0 
        ? new Date(Math.max(...verifiedReviews.map((r: any) => new Date(r.created_at || 0).getTime())))
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
  }
}
