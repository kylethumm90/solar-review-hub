
import React from 'react';
import { formatDate } from '@/lib/utils';
import { scoreToGrade } from '@/utils/reviewUtils';
import { Badge } from '@/components/ui/badge';

interface ReviewAnswer {
  id: string;
  rating: number;
  notes?: string;
  review_questions: {
    id: string;
    category: string;
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
          <span className="font-semibold">
            {review.users?.full_name || 'Anonymous User'}
          </span>
          {review.review_title && (
            <h3 className="text-lg font-medium mt-1">{review.review_title}</h3>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
          {Object.entries(answersByCategory).map(([category, answer]) => (
            <div key={answer.id} className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
              <div className="text-sm font-medium mb-1">
                {category}
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {scoreToGrade(answer.rating)}
                </Badge>
                <span className="text-xs text-gray-500">({answer.rating}/5)</span>
              </div>
              {answer.notes && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                  "{answer.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
