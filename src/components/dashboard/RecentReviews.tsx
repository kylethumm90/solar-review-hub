
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Review } from '@/types';
import { formatDate } from '@/lib/utils';
import { File, Star } from 'lucide-react';

interface RecentReviewsProps {
  reviews: Review[];
  isLoading: boolean;
}

const RecentReviews = ({ reviews, isLoading }: RecentReviewsProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Reviews</h2>
          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <div className="animate-pulse space-y-2">
                <div className="flex justify-between">
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Reviews</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard/reviews">View All</Link>
        </Button>
      </div>
      
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {review.company?.name || 'Unknown Company'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(review.created_at)}
                  </p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>
                    {(
                      (review.rating_communication +
                      review.rating_install_quality +
                      review.rating_payment_reliability +
                      review.rating_timeliness +
                      review.rating_post_install_support) / 5
                    ).toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                {review.text_feedback}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <File className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">You haven't submitted any reviews yet.</p>
          <Button asChild className="mt-4">
            <Link to="/vendors">Browse Vendors</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentReviews;
