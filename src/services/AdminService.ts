
import { supabase } from '@/integrations/supabase/client';
import { calculateSolarGradeScore } from '@/utils/reviewUtils';

export class AdminService {
  /**
   * Updates SolarGrade scores for all companies with verified reviews
   * This should be run periodically to keep scores up to date
   */
  static async updateAllSolarGradeScores(): Promise<{
    success: boolean;
    updatedCount: number;
    message: string;
  }> {
    try {
      // Get all companies with verified reviews
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select(`
          id,
          reviews!inner (
            id,
            average_score,
            verified
          )
        `)
        .in('status', ['verified', 'certified', 'unclaimed']);

      if (companiesError) {
        throw companiesError;
      }

      let updatedCount = 0;
      const updates = [];

      // Process each company
      for (const company of companies || []) {
        // Filter for verified reviews only
        const verifiedReviews = (company.reviews || []).filter(
          (review: any) => review.verified
        );
        
        // Skip companies with fewer than 3 verified reviews
        if (verifiedReviews.length < 3) {
          continue;
        }

        // Calculate average score across verified reviews
        const avgScore = verifiedReviews.reduce(
          (sum: number, review: any) => sum + (review.average_score || 0),
          0
        ) / verifiedReviews.length;

        // Calculate SolarGrade score and update company
        const solarGradeScore = calculateSolarGradeScore(avgScore);
        
        const { error: updateError } = await supabase
          .from('companies')
          .update({ solargrade_score: solarGradeScore })
          .eq('id', company.id);

        if (!updateError) {
          updatedCount++;
          updates.push({ id: company.id, score: solarGradeScore });
        }
      }

      return {
        success: true,
        updatedCount,
        message: `Successfully updated ${updatedCount} companies with SolarGrade scores.`
      };
    } catch (error) {
      console.error('Error updating SolarGrade scores:', error);
      return {
        success: false,
        updatedCount: 0,
        message: `Error updating SolarGrade scores: ${(error as Error).message}`
      };
    }
  }
}
