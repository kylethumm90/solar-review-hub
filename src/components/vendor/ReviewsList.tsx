
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ReviewItem from './ReviewItem';

interface ReviewsListProps {
  companyId: string;
  reviews: any[];
  getReviewAvgScore: (review: any) => number;
  reviewAnswersByReviewId: Record<string, any[]>;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ 
  companyId, 
  reviews, 
  getReviewAvgScore, 
  reviewAnswersByReviewId 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" id="reviews">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Reviews ({reviews.length})</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Grades are calculated from verified reviews.
        </p>
      </div>
      
      {reviews.length > 0 ? (
        <div className="space-y-8">
          {reviews.map((review) => (
            <ReviewItem 
              key={review.id} 
              review={review}
              getReviewAvgScore={getReviewAvgScore}
              reviewAnswers={reviewAnswersByReviewId[review.id] || []}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This company has no reviews yet. Be the first to leave one!
          </p>
          <Button asChild>
            <Link to={`/reviews/${companyId}`}>Write a Review</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
