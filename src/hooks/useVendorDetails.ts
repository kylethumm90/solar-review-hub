
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { scoreToGrade, calculateWeightedAverage } from '@/utils/reviewUtils';

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
          .select('*')
          .eq('company_id', vendorId)
          .order('created_at', { ascending: false });
        
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          toast.error('Failed to load reviews');
          throw reviewsError;
        }

        // Fetch user names for reviews separately 
        const reviewsWithUsers = await Promise.all(
          (reviewsData || []).map(async (review) => {
            if (review.user_id) {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('full_name')
                .eq('id', review.user_id)
                .single();
              
              if (!userError && userData) {
                return {
                  ...review,
                  users: userData
                };
              }
            }
            return {
              ...review,
              users: { full_name: 'Anonymous User' }
            };
          })
        );
        
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
        if (reviewsWithUsers && reviewsWithUsers.length > 0) {
          const reviewIds = reviewsWithUsers.map(review => review.id);
          
          // Get review questions first for joining manually
          const { data: allQuestions } = await supabase
            .from('review_questions')
            .select('*');
            
          // Get answers
          const { data: fetchedAnswers, error: answersError } = await supabase
            .from('review_answers')
            .select('*')
            .in('review_id', reviewIds);
            
          if (answersError) {
            console.error('Error fetching review answers:', answersError);
            throw answersError;
          }
          
          // Manually join answers with questions
          answersData = (fetchedAnswers || []).map(answer => {
            const question = allQuestions?.find(q => q.id === answer.question_id);
            return {
              ...answer,
              review_questions: question || null
            };
          });
        }
        
        setCompany(companyData);
        setReviews(reviewsWithUsers || []);
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

  // Calculate average score for a review based on review_answers
  // This is the new scoring system using weighted average from review_answers
  const getReviewAvgScore = (review: any): number => {
    // Get answers for this review
    const reviewAnswersForReview = reviewAnswers.filter(
      answer => answer.review_id === review.id
    );
    
    // If no answers found, fall back to the stored average_score or 0
    if (!reviewAnswersForReview.length) {
      return review.average_score || 0;
    }
    
    // Calculate weighted average from answers
    let totalWeight = 0;
    let weightedSum = 0;
    
    reviewAnswersForReview.forEach(answer => {
      if (answer.review_questions) {
        const weight = answer.review_questions.weight || 1;
        weightedSum += answer.rating * weight;
        totalWeight += weight;
      } else {
        // If no question metadata is available, use rating with default weight of 1
        weightedSum += answer.rating;
        totalWeight += 1;
      }
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : (review.average_score || 0);
  };
  
  // Get letter grade from score
  const getReviewLetterGrade = (review: any) => {
    const avgScore = getReviewAvgScore(review);
    return scoreToGrade(avgScore);
  };
  
  // Calculate overall average rating for all reviews
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

  // Log for debugging
  console.log('Using new scoring system based on review_answers');
  console.log('Company:', company?.name);
  console.log('Overall average rating:', avgRating);
  console.log('Total reviews:', reviews.length);

  return {
    company,
    reviews,
    reviewQuestions,
    reviewAnswers,
    loading,
    avgRating,
    getReviewAvgScore,
    getReviewLetterGrade,
    reviewAnswersByReviewId
  };
};
