
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ReviewsListProps {
  companyId: string;
  reviews: any[];
  getReviewAvgScore: (review: any) => number;
  reviewAnswersByReviewId: Record<string, any[]>;
}

const ReviewsList = ({
  companyId,
  reviews,
  getReviewAvgScore,
  reviewAnswersByReviewId
}: ReviewsListProps) => {
  const navigate = useNavigate();
  const [sortCriteria, setSortCriteria] = useState<'newest' | 'highest'>('newest');
  
  const handleWriteReview = () => {
    navigate(`/reviews/${companyId}`);
  };
  
  // Sort reviews based on criteria
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortCriteria === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return getReviewAvgScore(b) - getReviewAvgScore(a);
    }
  });
  
  // Check if we should display reviews
  if (reviews.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No reviews have been submitted for this vendor yet.
          </p>
          <Button onClick={handleWriteReview}>Be the First to Review</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Reviews ({reviews.length})</h2>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setSortCriteria(sortCriteria === 'newest' ? 'highest' : 'newest')}
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort by: {sortCriteria === 'newest' ? 'Newest' : 'Highest Rated'}
          </Button>
          <Button onClick={handleWriteReview}>Write a Review</Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            getReviewAvgScore={getReviewAvgScore}
            reviewAnswers={reviewAnswersByReviewId[review.id] || []}
          />
        ))}
      </div>
    </div>
  );
};

const ReviewItem = ({
  review,
  getReviewAvgScore,
  reviewAnswers
}: {
  review: any;
  getReviewAvgScore: (review: any) => number;
  reviewAnswers: any[];
}) => {
  const score = getReviewAvgScore(review);
  
  // Status badge for verification
  const getVerificationBadge = () => {
    if (review.is_anonymous) {
      if (review.verified) {
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Verified Anonymous
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Pending Verification
          </Badge>
        );
      }
    } else {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Reviewer
        </Badge>
      );
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between mb-2">
        <div>
          <h3 className="text-xl font-semibold">{review.review_title || 'Review'}</h3>
          <div className="flex items-center gap-2 mt-1">
            {getVerificationBadge()}
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mr-2">
            {score.toFixed(1)}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <span>
            By {review.is_anonymous ? 'Anonymous' : (review.users?.full_name || 'Unknown')} • {formatDate(review.created_at)}
          </span>
        </p>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300">{review.review_details || review.text_feedback}</p>
      </div>
      
      {reviewAnswers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium mb-2">Rating Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reviewAnswers.map((answer) => (
              <div key={answer.id} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {answer.review_questions?.question}
                </span>
                <div className="flex items-center">
                  <span className="mr-1 font-medium">{answer.rating}</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
