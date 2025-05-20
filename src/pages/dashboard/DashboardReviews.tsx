
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, ArrowUpDown } from 'lucide-react';
import { useUserReviews, UserReviewWithCompany } from '@/hooks/useUserReviews';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { scoreToGrade } from '@/utils/reviewUtils';
import { getBadgeColorForGrade } from '@/components/reviews/reviewUtils';

const DashboardReviews = () => {
  const { reviews, loading, sortBy, handleSortChange } = useUserReviews();

  const getTruncatedText = (text: string, limit: number = 100) => {
    if (!text) return '';
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">My Reviews</h1>
        
        <div className="mt-4 md:mt-0">
          <Select
            value={sortBy}
            onValueChange={(value) => handleSortChange(value as 'newest' | 'highest')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <span>Newest First</span>
                </div>
              </SelectItem>
              <SelectItem value="highest">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <span>Highest Rated</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your reviews...</p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">You haven't submitted any reviews yet</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Once you submit reviews, they will appear here
          </p>
          <Button asChild className="mt-4">
            <Link to="/vendors">Browse Vendors</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} getTruncatedText={getTruncatedText} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ReviewCardProps {
  review: UserReviewWithCompany;
  getTruncatedText: (text: string, limit?: number) => string;
}

const ReviewCard = ({ review, getTruncatedText }: ReviewCardProps) => {
  const grade = scoreToGrade(review.average_score || 0);
  
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {review.company.logo_url ? (
              <img
                src={review.company.logo_url}
                alt={`${review.company.name} logo`}
                className="h-10 w-10 object-contain rounded-md mr-3"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center mr-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {review.company.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {review.company.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(review.created_at), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <Badge 
            variant="outline" 
            className={`${getBadgeColorForGrade(grade)}`}
          >
            {grade}
          </Badge>
        </div>

        {review.review_title && (
          <h4 className="font-medium mb-2">{review.review_title}</h4>
        )}

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 flex-grow">
          {getTruncatedText(review.review_details || review.text_feedback || '')}
        </p>

        {review.verification_status && (
          <div className="mb-4">
            <span className={`text-xs px-2 py-1 rounded-full ${
              review.verification_status === 'approved' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
              : review.verification_status === 'rejected'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
            }`}>
              {review.verification_status.charAt(0).toUpperCase() + review.verification_status.slice(1)}
            </span>
          </div>
        )}

        <div className="mt-auto">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to={`/vendors/${review.company_id}`} className="flex items-center justify-center">
              View Details
              <ExternalLink size={14} className="ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardReviews;
