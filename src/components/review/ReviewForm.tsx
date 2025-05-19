
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ReviewCategoryGroup from '@/components/ReviewCategoryGroup';
import { ReviewQuestion } from '@/types';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

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

interface ReviewMetadata {
  installCount: number | null;
  stillActive: string | null;
  lastInstallDate: string | null;
  installStates: string[];
  recommendEpc: string | null;
}

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

const ReviewForm = ({ vendor, reviewQuestions, onSubmit, submitting }: ReviewFormProps) => {
  // Form step state
  const [step, setStep] = useState<number>(1);
  
  // Form fields
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
  const [installState, setInstallState] = useState<string>('');
  const [recommendEpc, setRecommendEpc] = useState<string | null>(null);

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

  const validateStep1 = () => {
    if (!reviewTitle.trim()) {
      toast.custom({ 
        title: "Missing title", 
        description: "Please provide a title for your review" 
      });
      return false;
    }

    // Check if all questions have been answered
    const unansweredQuestions = reviewQuestions.filter(
      q => !questionRatings[q.id] || questionRatings[q.id].rating === 0
    );
    
    if (unansweredQuestions.length > 0) {
      toast.custom({
        title: "Incomplete review",
        description: "Please rate all questions before proceeding"
      });
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      installStates: installState ? [installState] : [],
      recommendEpc
    };

    onSubmit(reviewTitle, reviewDetails, questionRatings, isAnonymous, attachment, metadata);
  };

  // Format company type for display
  const formattedCompanyType = vendor.type
    ? vendor.type.replace(/_/g, ' ').replace(/\b\w/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Company';

  const isEpcVendor = vendor.type?.toLowerCase().includes('epc') || false;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {step === 1 && (
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
            
            {isEpcVendor && (
              <>
                {/* MOVED: Approximately how many installs */}
                <div>
                  <Label htmlFor="install-count" className="block font-semibold mb-2">
                    Approximately how many installs have you completed with this EPC?
                  </Label>
                  <Input
                    id="install-count"
                    type="number"
                    min={1}
                    max={1000}
                    step={1}
                    placeholder="Enter a number (estimates are fine)"
                    onChange={(e) => setInstallCount(Number(e.target.value) || null)}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Estimates are fine. Just give your best approximation.
                  </p>
                </div>
                
                {/* MOVED: Convert to dropdown - Install Locations */}
                <div>
                  <Label className="block font-semibold mb-2">
                    Where were most of your installs with this EPC located?
                  </Label>
                  <Select onValueChange={setInstallState}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {/* Reviewer Identity */}
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
            
            {/* MOVED: Additional Comments below Reviewer Identity */}
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
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={handleNextStep}
                disabled={
                  reviewQuestions.length === 0 ||
                  Object.keys(questionRatings).length < reviewQuestions.length
                }
              >
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="border-b pb-4 mb-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevStep}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ratings
              </Button>
              
              <h2 className="text-lg font-semibold mb-2">Help Us Improve EPC Scoring</h2>
              <p className="text-sm text-gray-600 mb-6">
                Your answers below help SolarGrade assess vendor performance across the industry.  
                This data will <strong>never be shared with the EPC</strong> or made public.
              </p>
            </div>
            
            {isEpcVendor && (
              <div className="space-y-6 mt-6">                
                {/* Field: Still Working With This EPC? */}
                <div className="mb-6">
                  <Label className="block font-medium mb-2">
                    Are you still working with this EPC?
                  </Label>
                  <div className="space-y-2">
                    <RadioGroup onValueChange={setStillActive}>
                      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="still-active-yes" />
                          <Label htmlFor="still-active-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="still-active-no" />
                          <Label htmlFor="still-active-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="considering" id="still-active-considering" />
                          <Label htmlFor="still-active-considering">Considering ending the relationship</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Field: Most Recent Install Date */}
                <div className="mb-6">
                  <Label htmlFor="last-install-date" className="block font-medium mb-2">
                    When was your most recent install with this EPC?
                  </Label>
                  <Input
                    id="last-install-date"
                    type="month"
                    max={new Date().toISOString().split('T')[0].slice(0, 7)}
                    onChange={(e) => setLastInstallDate(e.target.value || null)}
                  />
                </div>

                {/* Field: Recommend This EPC */}
                <div className="mb-6">
                  <Label className="block font-medium mb-2">
                    Would you recommend this EPC to another organization?
                  </Label>
                  <div className="space-y-2">
                    <RadioGroup onValueChange={setRecommendEpc}>
                      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="recommend-yes" />
                          <Label htmlFor="recommend-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="recommend-no" />
                          <Label htmlFor="recommend-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="unsure" id="recommend-unsure" />
                          <Label htmlFor="recommend-unsure">Not sure</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevStep}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
