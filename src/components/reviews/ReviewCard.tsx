
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/utils';
import { scoreToGrade } from '@/utils/reviewUtils';
import { ExtendedReview } from './types';
import { formatVendorType, getBadgeColorForGrade, truncateText } from './reviewUtils';

interface ReviewCardProps {
  review: ExtendedReview;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const grade = scoreToGrade(review.average_score || 0);
  const displayName = review.is_anonymous
    ? "Verified Solar Pro"
    : "Verified Reviewer";
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">
                {displayName}
              </h3>
              {review.is_anonymous && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-gray-500 italic">
                        (identity verified)
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">This reviewer chose to remain private, but their identity and experience have been verified by SolarGrade.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {review.install_count && review.install_count > 0 && (
              <p className="text-xs text-gray-500">
                Based on {review.install_count} installs
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <Badge 
              variant="outline" 
              className={`${getBadgeColorForGrade(grade)}`}
            >
              Grade: {grade}
            </Badge>
            <span className="text-xs text-gray-500 mt-1">
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>
        
        {review.company && (
          <div className="mb-3">
            <Link to={`/vendors/${review.company_id}`} className="text-primary hover:underline font-medium">
              {review.company.name}
            </Link>
            <span className="text-xs text-gray-500 ml-2">
              {review.company.type && formatVendorType(review.company.type)}
            </span>
          </div>
        )}
        
        {review.review_title && (
          <h4 className="font-medium mb-1">{review.review_title}</h4>
        )}
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {truncateText(review.review_details || review.text_feedback || "", 150)}
        </p>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={`/vendors/${review.company_id}`}>
            View Company Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
