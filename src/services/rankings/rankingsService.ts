
import { supabase } from '@/integrations/supabase/client';
import { scoreToGrade } from '@/utils/reviewUtils';
import { checkOperatingStatesColumn } from './operatingRegionsService';

/**
 * Fetches and sorts company rankings based on specified filters
 */
export async function getRankings(
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
    const hasOperatingStates = await checkOperatingStatesColumn();

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
    const rankings = processRankingsData(data);

    // Apply grade filter if specified
    let filteredRankings = rankings;
    if (grade) {
      filteredRankings = rankings.filter(company => company.grade === grade);
    }

    // Apply sorting
    return sortRankings(filteredRankings, sortOption);
  } catch (e) {
    console.error("Exception fetching rankings:", e);
    return [];
  }
}

/**
 * Processes raw company data into rankings with calculated metrics
 */
function processRankingsData(data: any[]): any[] {
  return data.map(company => {
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
}

/**
 * Sorts rankings based on the specified sort option
 */
function sortRankings(rankings: any[], sortOption: string): any[] {
  switch (sortOption) {
    case 'grade':
      return rankings.sort((a, b) => b.average_score - a.average_score);
    case 'reviews':
      return rankings.sort((a, b) => b.review_count - a.review_count);
    case 'installs':
      return rankings.sort((a, b) => b.install_count - a.install_count);
    case 'recent':
      return rankings.sort((a, b) => 
        b.most_recent_review.getTime() - a.most_recent_review.getTime());
    case 'alpha':
      return rankings.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return rankings.sort((a, b) => b.average_score - a.average_score);
  }
}
