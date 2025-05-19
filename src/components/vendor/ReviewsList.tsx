
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReviewItem from './ReviewItem';
import { scoreToGrade } from '@/utils/reviewUtils';

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
  // Get the overall average grade
  const overallGrade = reviews.length 
    ? scoreToGrade(reviews.reduce((sum, review) => sum + getReviewAvgScore(review), 0) / reviews.length)
    : 'N/A';
  
  // Find the most consistent category if there are reviews
  let mostConsistentCategory = { category: '', grade: '', score: 0 };
  
  if (reviews.length > 0) {
    // Create a map to track categories and their scores
    const categoryScores: Record<string, { total: number, count: number }> = {};
    
    // Gather all categories and their scores
    Object.values(reviewAnswersByReviewId).forEach(answers => {
      answers.forEach(answer => {
        if (answer.review_questions?.category) {
          const category = answer.review_questions.category;
          if (!categoryScores[category]) {
            categoryScores[category] = { total: 0, count: 0 };
          }
          categoryScores[category].total += answer.rating;
          categoryScores[category].count += 1;
        }
      });
    });
    
    // Find the highest average scoring category
    let highestAvg = 0;
    Object.entries(categoryScores).forEach(([category, data]) => {
      const avgScore = data.total / data.count;
      if (avgScore > highestAvg) {
        highestAvg = avgScore;
        mostConsistentCategory = { 
          category, 
          grade: scoreToGrade(avgScore),
          score: avgScore 
        };
      }
    });
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" id="reviews">
      {reviews.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Overall Grade</div>
              <div className="font-bold text-xl">{overallGrade}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Reviews</div>
              <div className="font-bold text-xl">{reviews.length}</div>
            </div>
            {mostConsistentCategory.category && (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Most Consistent</div>
                <div className="font-bold text-xl">
                  {mostConsistentCategory.category} — {mostConsistentCategory.grade}
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Grades are calculated from verified reviews
          </p>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Reviews ({reviews.length})</h2>
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
