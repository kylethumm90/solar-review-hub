
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { scoreToGrade } from '@/utils/reviewUtils';
import ReviewItem from './ReviewItem';

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

export default ReviewsList;
