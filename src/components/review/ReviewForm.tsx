
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ReviewCategoryGroup from '@/components/ReviewCategoryGroup';
import { ReviewQuestion } from '@/types';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    attachment: File | null
  ) => void;
  submitting: boolean;
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

  const handleQuestionChange = (questionId: string, rating: number) => {
    const question = reviewQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    setQuestionRatings(prev => ({
      ...prev,
      [questionId]: { rating, question }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);
    
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setFileError('Invalid file type. Please upload a PDF, JPG, or PNG file.');
        setAttachment(null);
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File is too large. Maximum size is 5MB.');
        setAttachment(null);
        return;
      }
      
      setAttachment(file);
    } else {
      setAttachment(null);
    }
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

    onSubmit(reviewTitle, reviewDetails, questionRatings, isAnonymous, attachment);
  };

  // Format company type for display
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
          <Label className="font-semibold mb-2 block">Reviewer Identity</Label>
          <RadioGroup defaultValue="public" onValueChange={(val) => setIsAnonymous(val === "anonymous")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public">Display my full name</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="anonymous" id="anonymous" />
              <Label htmlFor="anonymous">Submit anonymously</Label>
            </div>
          </RadioGroup>
        </div>
        
        {isAnonymous && (
          <div>
            <Label htmlFor="attachment" className="font-semibold mb-2 block">
              Upload documentation to verify your review
            </Label>
            <Input
              id="attachment"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-1"
            />
            {fileError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Accepted examples:</strong><br />
              • Signed contract or proposal<br />
              • Invoice or receipt from the company<br />
              • Screenshot of an email or text exchange<br />
              • Photo of installed equipment with branding
            </p>
          </div>
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
