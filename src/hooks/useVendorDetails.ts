
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useVendorDetails = (vendorId: string | undefined) => {
  const [company, setCompany] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewAnswers, setReviewAnswers] = useState<any[]>([]);
  const [reviewQuestions, setReviewQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendorDetails() {
      if (!vendorId) return;
      
      setLoading(true);
      try {
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', vendorId)
          .single();
        
        if (companyError) {
          console.error('Error fetching company details:', companyError);
          toast.error('Failed to load vendor details');
          throw companyError;
        }
        
        // Fetch reviews for this company
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            users (full_name)
          `)
          .eq('company_id', vendorId)
          .order('created_at', { ascending: false });
        
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          toast.error('Failed to load reviews');
          throw reviewsError;
        }
        
        // Fetch review questions for this company type
        const companyType = companyData.type.toLowerCase().replace(/ /g, '_');
        const { data: questionsData, error: questionsError } = await supabase
          .from('review_questions')
          .select('*')
          .eq('company_type', companyType);
          
        if (questionsError) {
          console.error('Error fetching review questions:', questionsError);
          throw questionsError;
        }
        
        // Fetch review answers if there are reviews
        let answersData: any[] = [];
        if (reviewsData && reviewsData.length > 0) {
          const reviewIds = reviewsData.map(review => review.id);
          const { data: fetchedAnswers, error: answersError } = await supabase
            .from('review_answers')
            .select(`
              *,
              review_questions (*)
            `)
            .in('review_id', reviewIds);
            
          if (answersError) {
            console.error('Error fetching review answers:', answersError);
            throw answersError;
          }
          answersData = fetchedAnswers || [];
        }
        
        setCompany(companyData);
        setReviews(reviewsData || []);
        setReviewQuestions(questionsData || []);
        setReviewAnswers(answersData);
        
        toast.success(`Loaded details for ${companyData.name}`);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchVendorDetails();
  }, [vendorId]);

  // Get average score either from the reviews.average_score or calculate it from legacy fields
  const getReviewAvgScore = (review: any) => {
    if (review.average_score) return review.average_score;
    return (
      review.rating_communication +
      review.rating_install_quality +
      review.rating_payment_reliability +
      review.rating_timeliness +
      review.rating_post_install_support
    ) / 5;
  };
  
  const avgRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + getReviewAvgScore(review), 0) / reviews.length 
    : 0;
  
  // Group review answers by review ID
  const reviewAnswersByReviewId = reviewAnswers.reduce((acc, answer) => {
    if (!acc[answer.review_id]) {
      acc[answer.review_id] = [];
    }
    acc[answer.review_id].push(answer);
    return acc;
  }, {} as Record<string, any[]>);

  return {
    company,
    reviews,
    reviewQuestions,
    reviewAnswers,
    loading,
    avgRating,
    getReviewAvgScore,
    reviewAnswersByReviewId
  };
};
