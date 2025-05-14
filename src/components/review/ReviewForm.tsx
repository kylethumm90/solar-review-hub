
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ReviewCategoryGroup from '@/components/ReviewCategoryGroup';
import { ReviewQuestion } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface ReviewFormProps {
  vendor: {
    name: string;
    type?: string;
  };
  reviewQuestions: ReviewQuestion[];
  onSubmit: (title: string, details: string, ratings: Record<string, { rating: number; notes?: string; question: ReviewQuestion }>) => void;
  submitting: boolean;
}

const ReviewForm = ({ vendor, reviewQuestions, onSubmit, submitting }: ReviewFormProps) => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDetails, setReviewDetails] = useState('');
  const [questionRatings, setQuestionRatings] = useState<
    Record<string, { rating: number; notes?: string; question: ReviewQuestion }>
  >({});

  const handleQuestionChange = (questionId: string, rating: number, notes?: string) => {
    const question = reviewQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    setQuestionRatings(prev => ({
      ...prev,
      [questionId]: { rating, notes, question }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your review",
        variant: "destructive"
      });
      return;
    }

    // Check if all questions have been answered
    const unansweredQuestions = reviewQuestions.filter(
      q => !questionRatings[q.id] || questionRatings[q.id].rating === 0
    );
    
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Incomplete review",
        description: "Please rate all questions before submitting",
        variant: "destructive"
      });
      return;
    }

    onSubmit(reviewTitle, reviewDetails, questionRatings);
  };

  const formattedCompanyType = vendor.type
    ? vendor.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Company';

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="review-title">Review Title</Label>
          <Input
            id="review-title"
            className="mt-1"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="Summarize your experience in a few words"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="review-details">Overall Experience</Label>
          <Textarea
            id="review-details"
            className="min-h-[120px] mt-1"
            value={reviewDetails}
            onChange={(e) => setReviewDetails(e.target.value)}
            placeholder="Share details about your overall experience working with this vendor..."
          />
        </div>
        
        {reviewQuestions.length > 0 ? (
          <ReviewCategoryGroup
            title={`Rate Your Experience with this ${formattedCompanyType}`}
            questions={reviewQuestions}
            onQuestionChange={handleQuestionChange}
          />
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No review questions available for this vendor type.
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={
              submitting || 
              reviewQuestions.length === 0 ||
              Object.keys(questionRatings).length < reviewQuestions.length
            }
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;
