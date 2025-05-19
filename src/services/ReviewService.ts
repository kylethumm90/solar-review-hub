
import { supabase } from '@/integrations/supabase/client';
import { ReviewQuestion } from '@/types';

export interface VendorInfo {
  id: string;
  name: string;
  logo_url?: string;
  type: string;
}

export const ReviewService = {
  fetchVendorInfo: async (vendorId: string): Promise<VendorInfo> => {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, logo_url, type')
      .eq('id', vendorId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  fetchReviewQuestions: async (companyType: string): Promise<ReviewQuestion[]> => {
    const normalizedType = companyType.toLowerCase().replace(/ /g, '_');
    const { data, error } = await supabase
      .from('review_questions')
      .select('*')
      .eq('company_type', normalizedType)
      .not('category', 'ilike', '%pto%time%') // More thorough exclusion of PTO time
      .order('category');
      
    if (error) throw error;
    return data || [];
  },
  
  submitReview: async (
    vendorId: string, 
    userId: string, 
    title: string, 
    details: string, 
    averageScore: number, 
    questionRatings: Record<string, { rating: number; notes?: string }>
  ) => {
    // Insert review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        company_id: vendorId,
        user_id: userId,
        review_title: title,
        review_details: details,
        text_feedback: details, // Use the same details for both fields
        average_score: averageScore,
        // Add legacy fields for backward compatibility
        rating_communication: 5,
        rating_install_quality: 5,
        rating_payment_reliability: 5,
        rating_timeliness: 5,
        rating_post_install_support: 5
      })
      .select('id')
      .single();
      
    if (reviewError) throw reviewError;
    
    // Insert individual answers
    const reviewAnswers = Object.entries(questionRatings).map(([questionId, { rating, notes }]) => ({
      review_id: review.id,
      question_id: questionId,
      rating,
      notes: notes || null
    }));
    
    const { error: answersError } = await supabase
      .from('review_answers')
      .insert(reviewAnswers);
      
    if (answersError) throw answersError;
    
    return review;
  }
};
