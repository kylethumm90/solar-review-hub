
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReviewInfoHeader from "../review/ReviewInfoHeader";
import ReviewFeedbackSection from "../review/ReviewFeedbackSection";
import AnswersByCategory from "../review/AnswersByCategory";
import { User } from "@/types";

interface ReviewModalProps {
  reviewId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal = ({ reviewId, isOpen, onClose }: ReviewModalProps) => {
  // Fetch review details
  const { data: review, isLoading: isReviewLoading } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id, 
          review_title, 
          text_feedback, 
          review_details, 
          average_score, 
          verification_status,
          created_at,
          user_id,
          company:companies(id, name)
        `)
        .eq("id", reviewId)
        .single();

      if (error) {
        toast.error("Failed to load review details");
        throw error;
      }

      return data;
    },
    enabled: isOpen && !!reviewId,
  });

  // Fetch user separately
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["review-user", review?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email")
        .eq("id", review?.user_id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return null;
      }

      return data as User;
    },
    enabled: isOpen && !!review?.user_id,
  });

  // Fetch review answers
  const { data: answers, isLoading: isAnswersLoading } = useQuery({
    queryKey: ["review-answers", reviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("review_answers")
        .select(`
          id, 
          rating, 
          notes,
          question:review_questions(id, category, question)
        `)
        .eq("review_id", reviewId);

      if (error) {
        toast.error("Failed to load review answers");
        throw error;
      }

      return data;
    },
    enabled: isOpen && !!reviewId,
  });

  const isLoading = isReviewLoading || isAnswersLoading || isUserLoading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <ReviewInfoHeader
              companyName={review?.company?.name}
              reviewerName={user?.full_name || user?.email || "Unknown User"}
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
