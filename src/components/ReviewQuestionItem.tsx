
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

  // Map category to description for EPC reviews
  const getCategoryDescription = (categoryName: string) => {
    const descriptions: Record<string, string> = {
      'payment_reliability': 'How would you rate the reliability of payments or financial transactions?',
      'installation_quality': 'How would you rate the quality of the installation work?',
      'timeliness': 'How would you rate the company\'s adherence to timelines?',
      'communication': 'How would you rate the company\'s communication throughout the project?',
      'post_install_support': 'How would you rate the support provided after installation?',
      'customer_service': 'How responsive was the company to your inquiries?'
    };
    
    const key = categoryName.toLowerCase().replace(/ /g, '_');
    return descriptions[key] || question.question;
  };

  return (
    <div className="p-4 border rounded-lg mb-4 bg-card">
      <div className="mb-2">
        <p className="text-muted-foreground">{getCategoryDescription(question.category)}</p>
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
