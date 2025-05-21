
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MailCheck, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type AnonymousReviewVerificationProps = {
  open: boolean;
  onClose: () => void;
  onVerified: (reviewId: string) => void;
  reviewId: string;
};

const AnonymousReviewVerification: React.FC<AnonymousReviewVerificationProps> = ({
  open,
  onClose,
  onVerified,
  reviewId,
}) => {
  const [reviewCode, setReviewCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState('');

  const handleVerification = async () => {
    if (!reviewCode.trim()) {
      toast({
        title: "Verification code required",
        description: "Please enter the verification code that was sent to you.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Replace this with your actual verification logic
      // For now, this is a mock implementation
      const { data, error } = await supabase
        .from('reviews')
        .select('id, verification_status')
        .eq('id', reviewId)
        .single();
        
      if (error) throw error;
      
      // Mock verification check - in real scenario, verify code against stored value
      if (reviewCode === '123456' || reviewCode === 'admin') {
        // Update verification status
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ verification_status: 'verified' })
          .eq('id', reviewId);
          
        if (updateError) throw updateError;
        
        toast({
          title: "Review verified",
          description: "Your review has been successfully verified.",
        });
        
        onVerified(reviewId);
        onClose();
      } else {
        // Invalid code
        setCodeError('Invalid verification code. Please try again.');
        toast({
          title: "Verification failed",
          description: "The verification code you entered is invalid.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification error",
        description: error.message || "There was an issue processing your verification.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    toast({
      title: "Verification code sent",
      description: "A new verification code has been sent to your email."
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Verify Your Review
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                placeholder="Enter 6-digit code"
                value={reviewCode}
                onChange={(e) => {
                  setReviewCode(e.target.value);
                  setCodeError('');
                }}
                className={codeError ? "border-red-500" : ""}
              />
              {codeError && <p className="text-sm text-red-500 mt-1">{codeError}</p>}
              <p className="text-sm text-muted-foreground mt-1">Enter the code sent to your email</p>
            </div>
            
            <div>
              <Label htmlFor="feedback">Additional Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Any details you'd like to add to your review"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="bg-muted p-3 rounded-md flex items-start gap-3">
              <MailCheck className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Why verify your review?</p>
                <p className="text-muted-foreground">Verified reviews help build trust in the community and are displayed more prominently.</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleResendCode} 
            disabled={isLoading}
          >
            Resend Code
          </Button>
          <Button 
            onClick={handleVerification} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Verifying..." : "Verify Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnonymousReviewVerification;
