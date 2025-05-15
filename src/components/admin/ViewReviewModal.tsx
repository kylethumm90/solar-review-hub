
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

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

      // Fix the type mismatch by extracting company and user information properly
      // Supabase returns company and user as arrays when using nested selects
      const formattedReview: ReviewDetails = {
        id: reviewData.id,
        review_title: reviewData.review_title,
        text_feedback: reviewData.text_feedback,
        review_details: reviewData.review_details,
        average_score: reviewData.average_score,
        company: {
          name: reviewData.company?.name || 'Unknown Company'
        },
        user: {
          full_name: reviewData.user?.full_name || 'Unknown User',
          email: reviewData.user?.email || 'unknown@email.com'
        },
        answers: answersData as unknown as Answer[]
      };

      setReview(formattedReview);
    } catch (error) {
      console.error('Error fetching review details:', error);
      toast.error('Failed to load review details');
    } finally {
      setLoading(false);
    }
  };

  // Group answers by category
  const groupedAnswers = review?.answers?.reduce((groups, answer) => {
    const category = answer.question?.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(answer);
    return groups;
  }, {} as Record<string, Answer[]>) || {};

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Company</h3>
                <p className="mt-1">{review.company?.name || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reviewer</h3>
                <p className="mt-1">{review.user?.full_name || review.user?.email || 'Unknown'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                <p className="mt-1">{review.average_score?.toFixed(1) || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Title</h3>
                <p className="mt-1">{review.review_title || 'Untitled'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Feedback</h3>
              <p className="mt-1 whitespace-pre-line">{review.text_feedback}</p>
            </div>

            {review.review_details && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Additional Details</h3>
                <p className="mt-1 whitespace-pre-line">{review.review_details}</p>
              </div>
            )}

            <div>
              <h3 className="text-md font-medium mb-3">Question Responses</h3>

              {Object.entries(groupedAnswers).map(([category, answers]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-medium text-primary mb-2">{category}</h4>
                  
                  <div className="space-y-3">
                    {answers.map((answer) => (
                      <div key={answer.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <p className="text-sm font-medium">{answer.question?.question}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm font-bold mr-2">Rating: {answer.rating}/5</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${i < answer.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        {answer.notes && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Notes: {answer.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
