
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup } from '@/components/ui/radio-group';
import ReviewCategoryGroup from '@/components/ReviewCategoryGroup';
import { ReviewQuestion } from '@/types';
import { toast } from '@/hooks/use-toast';
import AnonymousReviewSection from './form-sections/AnonymousReviewSection';
import EpcMetadataFields from './form-sections/EpcMetadataFields';
import ReviewFormHeader from './form-sections/ReviewFormHeader';

interface ReviewFormProps {
  vendor: {
    name: string;
    type?: string;
  };
  reviewQuestions: ReviewQuestion[];
  onSubmit: (
    title: string, 
    details: string, 
    ratings: Record<string, { rating: number; question: ReviewQuestion }>,
    isAnonymous: boolean,
    attachment: File | null,
    metadata: ReviewMetadata
  ) => void;
  submitting: boolean;
}

export interface ReviewMetadata {
  installCount: number | null;
  stillActive: string | null;
  lastInstallDate: string | null;
  installStates: string[];
  recommendEpc: string | null;
}

const ReviewForm = ({ vendor, reviewQuestions, onSubmit, submitting }: ReviewFormProps) => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDetails, setReviewDetails] = useState('');
  const [questionRatings, setQuestionRatings] = useState<
    Record<string, { rating: number; question: ReviewQuestion }>
  >({});
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Metadata state
  const [installCount, setInstallCount] = useState<number | null>(null);
  const [stillActive, setStillActive] = useState<string | null>(null);
  const [lastInstallDate, setLastInstallDate] = useState<string | null>(null);
  const [installStates, setInstallStates] = useState<string[]>([]);
  const [recommendEpc, setRecommendEpc] = useState<string | null>(null);

  const handleQuestionChange = (questionId: string, rating: number) => {
    const question = reviewQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    setQuestionRatings(prev => ({
      ...prev,
      [questionId]: { rating, question }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewTitle.trim()) {
      toast.custom({ 
        title: "Missing title", 
        description: "Please provide a title for your review" 
      });
      return;
    }

    // Check if all questions have been answered
    const unansweredQuestions = reviewQuestions.filter(
      q => !questionRatings[q.id] || questionRatings[q.id].rating === 0
    );
    
    if (unansweredQuestions.length > 0) {
      toast.custom({
        title: "Incomplete review",
        description: "Please rate all questions before submitting"
      });
      return;
    }

    // Validate file attachment for anonymous reviews
    if (isAnonymous && !attachment) {
      setFileError('Please upload documentation to verify your anonymous review.');
      toast.custom({
        title: "Missing verification",
        description: "Anonymous reviews require documentation for verification"
      });
      return;
    }

    const metadata: ReviewMetadata = {
      installCount,
      stillActive,
      lastInstallDate,
      installStates,
      recommendEpc
    };

    onSubmit(reviewTitle, reviewDetails, questionRatings, isAnonymous, attachment, metadata);
  };

  // Format company type for display
  const formattedCompanyType = vendor.type
    ? vendor.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Company';

  const isEpcVendor = vendor.type?.toLowerCase().includes('epc') || false;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <ReviewFormHeader 
          reviewTitle={reviewTitle}
          setReviewTitle={setReviewTitle}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
        />
        
        <AnonymousReviewSection 
          isAnonymous={isAnonymous}
          attachment={attachment}
          setAttachment={setAttachment}
          fileError={fileError}
          setFileError={setFileError}
        />
        
        {isEpcVendor && (
          <EpcMetadataFields
            installCount={installCount}
            setInstallCount={setInstallCount}
            stillActive={stillActive}
            setStillActive={setStillActive}
            lastInstallDate={lastInstallDate}
            setLastInstallDate={setLastInstallDate}
            installStates={installStates}
            setInstallStates={setInstallStates}
            recommendEpc={recommendEpc}
            setRecommendEpc={setRecommendEpc}
          />
        )}
        
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
        
        <div>
          <Label htmlFor="review-details">Additional Comments (Optional)</Label>
          <Textarea
            id="review-details"
            className="min-h-[120px] mt-1"
            value={reviewDetails}
            onChange={(e) => setReviewDetails(e.target.value)}
            placeholder="Share anything else about your experience..."
          />
        </div>
        
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
