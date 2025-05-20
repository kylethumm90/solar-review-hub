
import { supabase } from '@/integrations/supabase/client';
import { RankedCompany } from '@/types/rankings';
import { scoreToGrade, calculateSolarGradeScore } from '@/utils/reviewUtils';

export class RankingsService {
  static async getTopCompanies(
    limit: number = 100,
    vendorType?: string,
    gradeThreshold?: string
  ): Promise<RankedCompany[]> {
    try {
      // Start building our query
      let query = supabase
        .from('companies')
        .select(`
          id,
          name,
          type,
          status,
          logo_url,
          last_verified,
          solargrade_score,
          reviews!inner (
            id,
            average_score,
            install_count,
            created_at
          )
        `)
        .in('status', ['verified', 'certified', 'unclaimed'])
        .eq('reviews.verified', true);

      // Apply vendor type filter if provided
      if (vendorType && vendorType !== 'all') {
        query = query.eq('type', vendorType);
      }

      // Get the data with pagination
      const { data, error } = await query.limit(limit);

      if (error) {
        console.error('Error fetching rankings:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Process the data to calculate average scores and review counts
      const rankedCompanies = data.map(company => {
        // Calculate total reviews
        const reviewCount = company.reviews ? company.reviews.length : 0;

        // Skip companies with fewer than 3 reviews
        if (reviewCount < 3) {
          return null;
        }

        // Calculate average score across all reviews
        const avgScore = company.reviews.reduce((sum: number, review: any) => {
          return sum + (review.average_score || 0);
        }, 0) / reviewCount;

        // Calculate total installs
        const installCount = company.reviews.reduce((sum: number, review: any) => {
          return sum + (review.install_count || 0);
        }, 0);

        // Determine if company is new (joined in last 30 days)
        const oldestReview = company.reviews.reduce((oldest: any, review: any) => {
          return oldest && new Date(oldest.created_at) < new Date(review.created_at) 
            ? oldest 
            : review;
        }, null);
        
        const oldestReviewDate = oldestReview ? new Date(oldestReview.created_at) : null;
        const isNew = oldestReviewDate && 
          (new Date().getTime() - oldestReviewDate.getTime()) < (30 * 24 * 60 * 60 * 1000);

        // Convert score to letter grade
        const grade = scoreToGrade(avgScore);

        // Calculate SolarGrade score (0-100)
        const solarGradeScore = calculateSolarGradeScore(avgScore);

        // If grade threshold is set, filter out companies below it
        if (gradeThreshold) {
          const gradeOrder = 'A+,A,A-,B+,B,B-,C+,C,C-,D+,D,D-,F'.split(',');
          const thresholdIndex = gradeOrder.indexOf(gradeThreshold);
          const gradeIndex = gradeOrder.indexOf(grade);
          
          if (thresholdIndex >= 0 && gradeIndex > thresholdIndex) {
            return null;
          }
        }

        // Update the company's solargrade_score in the database if it's different
        if (company.solargrade_score !== solarGradeScore) {
          supabase
            .from('companies')
            .update({ solargrade_score: solarGradeScore })
            .eq('id', company.id)
            .then(({ error }) => {
              if (error) {
                console.error('Error updating solargrade_score:', error);
              }
            });
        }

        return {
          id: company.id,
          name: company.name,
          type: company.type,
          status: company.status,
          average_grade: avgScore.toFixed(1),
          grade,
          solargrade_score: solarGradeScore,
          review_count: reviewCount,
          install_count: installCount,
          last_verified: company.last_verified || (oldestReview ? oldestReview.created_at : null),
          rank_change: Math.floor(Math.random() * 7) - 3, // Mock data for initial implementation
          is_new: isNew,
          logo_url: company.logo_url
        };
      }).filter(Boolean) as RankedCompany[];

      // Sort by SolarGrade score first (best first), then by other criteria
      return rankedCompanies.sort((a, b) => {
        // First, sort by SolarGrade score
        if (a.solargrade_score !== b.solargrade_score) {
          return (b.solargrade_score || 0) - (a.solargrade_score || 0);
        }
        
        // Then by grade
        if (a.average_grade !== b.average_grade) {
          return parseFloat(b.average_grade) - parseFloat(a.average_grade);
        }
        
        // Then by number of reviews
        if (a.review_count !== b.review_count) {
          return b.review_count - a.review_count;
        }
        
        // Then by name
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error in getTopCompanies:', error);
      return [];
    }
  }
}
