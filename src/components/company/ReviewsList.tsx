
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReviewItem from '@/components/vendor/ReviewItem';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';

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
  const [sortBy, setSortBy] = useState('latest');
  
  // Filter out any empty reviews
  const validReviews = reviews.filter(review => !!review);
  
  const sortedReviews = [...validReviews].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === 'highest') {
      return getReviewAvgScore(b) - getReviewAvgScore(a);
    }
    if (sortBy === 'lowest') {
      return getReviewAvgScore(a) - getReviewAvgScore(b);
    }
    return 0;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Reviews ({reviews.length})</h2>
        <div className="flex gap-3">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest Reviews</SelectItem>
              <SelectItem value="oldest">Oldest Reviews</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {sortedReviews.length > 0 ? (
        <>
          <div className="space-y-8">
            {sortedReviews.slice(0, 5).map((review) => (
              <ReviewItem 
                key={review.id} 
                review={review} 
                getReviewAvgScore={getReviewAvgScore}
                reviewAnswers={reviewAnswersByReviewId[review.id] || []}
              />
            ))}
          </div>
          
          {sortedReviews.length > 5 && (
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link to={`/reviews/${companyId}`} className="flex items-center gap-2">
                  See All Reviews
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This company doesn't have any reviews yet.
          </p>
          <Button asChild>
            <Link to={`/reviews/${companyId}`}>
              Be the first to review
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
