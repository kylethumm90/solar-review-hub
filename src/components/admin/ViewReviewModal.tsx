
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import ReviewInfoHeader from './review/ReviewInfoHeader';
import ReviewFeedbackSection from './review/ReviewFeedbackSection';
import AnswersByCategory from './review/AnswersByCategory';

type Answer = {
  id: string;
  rating: number;
  notes: string | null;
  question: {
    category: string;
    question: string;
  };
};

type ReviewDetails = {
  id: string;
  review_title: string | null;
  text_feedback: string;
  review_details: string | null;
  average_score: number | null;
  company: {
    name: string;
  };
  user: {
    full_name: string;
    email: string;
  };
  answers: Answer[];
};

type ViewReviewModalProps = {
  reviewId: string;
  isOpen: boolean;
  onClose: () => void;
};

const ViewReviewModal = ({ reviewId, isOpen, onClose }: ViewReviewModalProps) => {
  const [review, setReview] = useState<ReviewDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && reviewId) {
      fetchReviewDetails();
    }
  }, [isOpen, reviewId]);

  const fetchReviewDetails = async () => {
    setLoading(true);
    try {
      // Fetch the review details
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .select(`
          id,
          review_title,
          text_feedback,
          review_details,
          average_score,
          company:companies(name),
          user:users(full_name, email)
        `)
        .eq('id', reviewId)
        .single();

      if (reviewError) throw reviewError;

      // Fetch the review answers with questions
      const { data: answersData, error: answersError } = await supabase
        .from('review_answers')
        .select(`
          id,
          rating,
          notes,
          question:review_questions(category, question)
        `)
        .eq('review_id', reviewId);

      if (answersError) throw answersError;

      // Fix for the nested array issue from Supabase
      // Supabase returns nested selects as arrays
      const companyData = Array.isArray(reviewData.company) 
        ? reviewData.company[0] 
        : reviewData.company;
        
      const userData = Array.isArray(reviewData.user) 
        ? reviewData.user[0] 
        : reviewData.user;

      // Transform the nested data properly
      const formattedReview: ReviewDetails = {
        id: reviewData.id,
        review_title: reviewData.review_title,
        text_feedback: reviewData.text_feedback,
        review_details: reviewData.review_details,
        average_score: reviewData.average_score,
        company: {
          name: companyData?.name || 'Unknown Company'
        },
        user: {
          full_name: userData?.full_name || 'Unknown User',
          email: userData?.email || 'unknown@email.com'
        },
        // Transform the answers data to ensure it matches the expected type
        answers: (answersData || []).map(answer => {
          // Fix for nested question data as array
          const questionData = Array.isArray(answer.question) 
            ? answer.question[0] 
            : answer.question;
            
          return {
            id: answer.id,
            rating: answer.rating,
            notes: answer.notes,
            question: {
              category: questionData?.category || 'Uncategorized',
              question: questionData?.question || 'Unknown Question'
            }
          };
        })
      };

      setReview(formattedReview);
    } catch (error) {
      console.error('Error fetching review details:', error);
      toast.error('Failed to load review details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Review Details</DialogTitle>
          <DialogDescription>
            Examining review for {review?.company?.name || 'Unknown Company'}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : review ? (
          <div className="space-y-6">
            <ReviewInfoHeader 
              companyName={review.company?.name} 
              reviewerName={review.user?.full_name || review.user?.email} 
              score={review.average_score} 
              title={review.review_title} 
            />

            <ReviewFeedbackSection 
              feedback={review.text_feedback} 
              details={review.review_details} 
            />

            <AnswersByCategory answers={review.answers} />
          </div>
        ) : (
          <p className="text-center">Failed to load review details.</p>
        )}

        <DialogFooter>
          <DialogClose className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReviewModal;
