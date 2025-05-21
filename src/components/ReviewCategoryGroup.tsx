
import { useState } from 'react';
import ReviewQuestionItem from './ReviewQuestionItem';

// Define the interface that matches what's being used locally
interface ReviewQuestion {
  id: string;
  category: string;
  company_type: string;
  question: string;
  weight: number;
}

interface ReviewCategoryGroupProps {
  questions: ReviewQuestion[];
  ratings: Record<string, number>;
  onRatingChange: (questionId: string, rating: number) => void;
}

const ReviewCategoryGroup = ({ questions, ratings, onRatingChange }: ReviewCategoryGroupProps) => {
  return (
    <div className="space-y-4">
      {questions.map(question => (
        <ReviewQuestionItem 
          key={question.id} 
          question={question}
          rating={ratings[question.id] || 0}
          onChange={(rating) => onRatingChange(question.id, rating)} 
        />
      ))}
    </div>
  );
};

export default ReviewCategoryGroup;
