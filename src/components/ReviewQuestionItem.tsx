
import { useState } from 'react';
import { ReviewQuestion } from '@/types';
import StarRating from './StarRating';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ReviewQuestionItemProps {
  question: ReviewQuestion;
  onChange: (questionId: string, rating: number, notes?: string) => void;
}

const ReviewQuestionItem = ({ question, onChange }: ReviewQuestionItemProps) => {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onChange(question.id, newRating, notes);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    onChange(question.id, rating, e.target.value);
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
      
      <div className="mt-4">
        <Label htmlFor={`notes-${question.id}`} className="text-sm">Additional Comments (Optional)</Label>
        <Textarea 
          id={`notes-${question.id}`}
          value={notes}
          onChange={handleNotesChange}
          placeholder="Share specific details about your experience..."
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default ReviewQuestionItem;
