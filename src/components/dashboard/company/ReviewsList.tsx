
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { scoreToGrade } from "@/utils/reviewUtils";
import { getBadgeColorForGrade } from "@/components/reviews/reviewUtils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface Review {
  id: string;
  review_title?: string;
  average_score?: number;
  text_feedback?: string;
  created_at: string;
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList = ({ reviews }: ReviewsListProps) => {
  return (
    <>
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const grade = scoreToGrade(review.average_score);
            
            return (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{review.review_title || 'Review'}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge 
                          variant="outline" 
                          className={`${getBadgeColorForGrade(grade)}`}
                        >
                          {grade === 'NR' ? 'Not Rated' : `Grade: ${grade}`}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {grade === 'NR' 
                          ? 'Rating calculation pending' 
                          : `Grade: ${grade} based on review ratings`}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm mb-2">{review.text_feedback}</p>
                <p className="text-xs text-muted-foreground">
                  Posted on {formatDate(review.created_at)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ReviewsList;
