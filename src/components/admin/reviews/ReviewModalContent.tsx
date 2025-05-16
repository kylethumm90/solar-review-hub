
import React from "react";
import { Separator } from "@/components/ui/separator";
import ReviewInfoHeader from "../review/ReviewInfoHeader";
import ReviewFeedbackSection from "../review/ReviewFeedbackSection";
import AnswersByCategory from "../review/AnswersByCategory";
import { User } from "@/types";

interface ReviewModalContentProps {
  review: any;
  user: User | null;
  answers: any[];
  isLoading: boolean;
}

const ReviewModalContent = ({ review, user, answers, isLoading }: ReviewModalContentProps) => {
  // Determine the reviewer name safely
  const getReviewerName = () => {
    if (!user) return "Unknown User";
    return user.full_name || user.email || "Unknown User";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewInfoHeader
        companyName={review?.company?.name}
        reviewerName={getReviewerName()}
        score={review?.average_score}
        title={review?.review_title}
      />

      <Separator />

      <ReviewFeedbackSection 
        feedback={review?.text_feedback || ""} 
        details={review?.review_details} 
      />

      <Separator />

      {answers && answers.length > 0 && (
        <AnswersByCategory answers={answers} />
      )}
    </div>
  );
};

export default ReviewModalContent;
