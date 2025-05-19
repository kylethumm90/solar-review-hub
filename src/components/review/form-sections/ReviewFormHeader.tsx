
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ReviewFormHeaderProps {
  reviewTitle: string;
  setReviewTitle: React.Dispatch<React.SetStateAction<string>>;
  isAnonymous: boolean;
  setIsAnonymous: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReviewFormHeader: React.FC<ReviewFormHeaderProps> = ({
  reviewTitle,
  setReviewTitle,
  isAnonymous,
  setIsAnonymous,
}) => {
  return (
    <>
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
        <RadioGroup defaultValue={isAnonymous ? "anonymous" : "public"} onValueChange={(val) => setIsAnonymous(val === "anonymous")}>
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
    </>
  );
};

export default ReviewFormHeader;
