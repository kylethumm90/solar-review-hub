
import { useState, useEffect } from 'react';
import StarRating from './StarRating';

interface ReviewQuestion {
  id: string;
  category: string;
  company_type: string;
  question: string;
  weight: number;
}

interface ReviewQuestionItemProps {
  question: ReviewQuestion;
  rating: number;
  onChange: (rating: number) => void;
}

const ReviewQuestionItem = ({ question, rating, onChange }: ReviewQuestionItemProps) => {
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

  // Skip rendering if this is a PTO time question
  if (question.category.toLowerCase().replace(/ /g, '_') === 'pto_time') {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg mb-4 bg-card">
      <div className="mb-2">
        <p className="text-muted-foreground">{getCategoryDescription(question.category)}</p>
      </div>
      
      <div className="mt-3">
        <StarRating 
          value={rating} 
          onChange={onChange} 
          size="lg"
        />
      </div>
    </div>
  );
};

export default ReviewQuestionItem;
