
import React from 'react';
import { formatDate } from '@/lib/utils';
import { scoreToGrade } from '@/utils/reviewUtils';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Wrench, Clock, DollarSign, LifeBuoy, HeadphonesIcon } from 'lucide-react';

interface ReviewAnswer {
  id: string;
  rating: number;
  notes?: string;
  review_questions: {
    id: string;
    category: string;
    question: string;
    weight: number;
  };
}

interface ReviewItemProps {
  review: any;
  getReviewAvgScore: (review: any) => number;
  reviewAnswers: ReviewAnswer[];
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, getReviewAvgScore, reviewAnswers }) => {
  const avgScore = getReviewAvgScore(review);
  const letterGrade = scoreToGrade(avgScore);
  
  console.log(`Review ${review.id} - calculated score: ${avgScore}, grade: ${letterGrade}`);
  
  // Function to get icon for a category
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('communication')) return <MessageCircle className="h-4 w-4 mr-2" />;
    if (lowerCategory.includes('customer service')) return <HeadphonesIcon className="h-4 w-4 mr-2" />;
    if (lowerCategory.includes('installation quality')) return <Wrench className="h-4 w-4 mr-2" />; 
    if (lowerCategory.includes('payment reliability')) return <DollarSign className="h-4 w-4 mr-2" />;
    if (lowerCategory.includes('post-install support')) return <LifeBuoy className="h-4 w-4 mr-2" />;
    if (lowerCategory.includes('timeliness')) return <Clock className="h-4 w-4 mr-2" />;
    return null;
  };
  
  // Function to determine badge color based on grade
  const getBadgeColor = (grade: string) => {
    if (grade.startsWith('A')) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (grade.startsWith('B')) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };
  
  // Group answers by category for easier display
  const answersByCategory = reviewAnswers.reduce((acc: Record<string, ReviewAnswer>, answer) => {
    if (answer.review_questions?.category) {
      const category = answer.review_questions.category;
      acc[category] = answer;
    }
    return acc;
  }, {});
  
  return (
    <div className="border-b dark:border-gray-700 pb-8 last:border-0">
      <div className="flex justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {review.users?.full_name || 'Anonymous User'}
            </span>
            {review.is_verified_reviewer && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                Verified Reviewer
              </Badge>
            )}
          </div>
          {review.review_title && (
            <h3 className="text-lg font-medium mt-1">{review.review_title}</h3>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`${getBadgeColor(letterGrade)}`}
          >
            Grade: {letterGrade}
          </Badge>
          <span className="text-gray-500 text-sm">
            {formatDate(review.created_at)}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {review.review_details || review.text_feedback}
      </p>
      
      {reviewAnswers && reviewAnswers.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(answersByCategory).map(([category, answer]) => {
            const grade = scoreToGrade(answer.rating);
            return (
              <div key={answer.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded">
                <div className="flex items-center">
                  {getCategoryIcon(category)}
                  <span className="text-sm font-medium">{category}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getBadgeColor(grade)}`}
                >
                  {grade}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Debug information - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 text-xs">
          <details>
            <summary className="cursor-pointer font-medium">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>Review ID: {review.id}</div>
              <div>Score calculation: {avgScore.toFixed(2)}</div>
              <div>Answer count: {reviewAnswers?.length || 0}</div>
              <div>Legacy avg score: {review.average_score || 'N/A'}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
