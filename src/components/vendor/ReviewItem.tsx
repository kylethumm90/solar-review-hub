
import React from 'react';
import { Star } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { scoreToGrade } from '@/utils/reviewUtils';

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
        <span className="text-gray-500 text-sm">
          {formatDate(review.created_at)}
        </span>
      </div>
      
      <div className="flex items-center mb-3">
        <div className="flex items-center text-yellow-500 mr-2">
          {Array(5).fill(0).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(avgScore)
                  ? 'fill-yellow-500'
                  : 'fill-gray-200 dark:fill-gray-700'
              }`}
            />
          ))}
        </div>
        <span className="text-gray-600 dark:text-gray-300 mr-2">
          {avgScore.toFixed(1)}
        </span>
        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
          Grade: {letterGrade}
        </span>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {review.review_details || review.text_feedback}
      </p>
      
      {reviewAnswers && reviewAnswers.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reviewAnswers.map((answer) => {
            const categoryName = answer.review_questions?.category || '';
            return (
              <div key={answer.id} className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
                <div className="text-sm font-medium mb-1">
                  {categoryName}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-yellow-500 mr-2">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < answer.rating
                            ? 'fill-yellow-500'
                            : 'fill-gray-200 dark:fill-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                    {scoreToGrade(answer.rating)}
                  </span>
                </div>
                {answer.notes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                    "{answer.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
