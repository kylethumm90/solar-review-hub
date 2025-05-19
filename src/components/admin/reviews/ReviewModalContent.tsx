
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
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

      {review?.is_anonymous && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-center">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Anonymous Review
            </Badge>
            <span className="ml-2 text-sm text-yellow-800">
              This reviewer requested to remain anonymous
            </span>
          </div>
          
          {review?.attachment_url && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Verification Documents:</p>
              <div className="border rounded overflow-hidden">
                {review.attachment_url.endsWith('.pdf') ? (
                  <div className="p-3 bg-gray-50 flex items-center justify-between">
                    <span className="text-sm">Document attachment (PDF)</span>
                    <a 
                      href={review.attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      View Document <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <img 
                      src={review.attachment_url} 
                      alt="Verification document" 
                      className="max-h-64 object-contain"
                    />
                    <div className="p-2 bg-gray-50 flex justify-end">
                      <a 
                        href={review.attachment_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      >
                        Open Full Image <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

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
