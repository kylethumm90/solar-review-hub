
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Edit } from "lucide-react";

interface ReviewTableActionsCellProps {
  reviewId: string;
  status: string | null;
  onApprove: (reviewId: string) => void;
  onReject: (reviewId: string) => void;
  onView: (reviewId: string) => void;
}

const ReviewTableActionsCell = ({
  reviewId,
  status,
  onApprove,
  onReject,
  onView
}: ReviewTableActionsCellProps) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Show approve button if status is pending or rejected */}
      {(status === "pending" || status === null || status === "rejected") && (
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2 text-green-600 hover:text-green-800 hover:bg-green-50"
          onClick={() => onApprove(reviewId)}
          title={status === "rejected" ? "Change to approved" : "Approve"}
        >
          <Check className="h-4 w-4 mr-1" />
          {status === "rejected" ? "Change" : "Approve"}
        </Button>
      )}
      
      {/* Show reject button if status is pending or approved */}
      {(status === "pending" || status === null || status === "approved") && (
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
          onClick={() => onReject(reviewId)}
          title={status === "approved" ? "Change to rejected" : "Reject"}
        >
          <X className="h-4 w-4 mr-1" />
          {status === "approved" ? "Change" : "Reject"}
        </Button>
      )}
      
      <Button
        size="sm"
        variant="ghost"
        className="h-8 px-2"
        onClick={() => onView(reviewId)}
      >
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
    </div>
  );
};

export default ReviewTableActionsCell;
