
import { useState } from 'react';
import { ReviewQuestion } from '@/types';
import StarRating from './StarRating';

interface ReviewQuestionItemProps {
  question: ReviewQuestion;
  onChange: (questionId: string, rating: number) => void;
}

const ReviewQuestionItem = ({ question, onChange }: ReviewQuestionItemProps) => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onChange(question.id, newRating);
  };

  return (
    <div className="p-4 border rounded-lg mb-4 bg-card">
      <div className="mb-2">
        <p className="text-muted-foreground">{question.question}</p>
      </div>
      
      <div className="mt-3">
        <StarRating 
          value={rating} 
          onChange={handleRatingChange} 
          size="lg"
        />
      </div>
    </div>
  );
};

export default ReviewQuestionItem;
