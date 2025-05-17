
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";

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
      {(status === "pending" || status === null) && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 text-green-600 hover:text-green-800 hover:bg-green-50"
            onClick={() => onApprove(reviewId)}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
            onClick={() => onReject(reviewId)}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </>
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
