
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReviewModalContent from "./ReviewModalContent";
import { useReviewData } from "./ReviewModalHooks";

interface ReviewModalProps {
  reviewId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal = ({ reviewId, isOpen, onClose }: ReviewModalProps) => {
  const { review, user, answers, isLoading } = useReviewData(reviewId, isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>

        <ReviewModalContent
          review={review}
          user={user}
          answers={answers || []}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
