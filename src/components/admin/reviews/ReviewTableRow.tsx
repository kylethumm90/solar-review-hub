
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import ReviewStatusBadge from "./ReviewStatusBadge";
import { Review } from "@/types";
import { format } from "date-fns";
import ReviewTableActionsCell from "./ReviewTableActionsCell";

interface ReviewTableRowProps {
  review: Review;
  onApprove: (reviewId: string) => void;
  onReject: (reviewId: string) => void;
  onView: (reviewId: string) => void;
}

const ReviewTableRow = ({
  review,
  onApprove,
  onReject,
  onView,
}: ReviewTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {review.company?.name || "Unknown"}
      </TableCell>
      <TableCell>
        {review.user?.full_name || review.user?.email || "Unknown"}
      </TableCell>
      <TableCell>{review.review_title || "Untitled Review"}</TableCell>
      <TableCell>
        <span
          className={
            review.average_score && review.average_score < 2.5
              ? "text-red-500 font-semibold"
              : ""
          }
        >
          {review.average_score?.toFixed(1) || "N/A"}
        </span>
      </TableCell>
      <TableCell>
        {review.created_at
          ? format(new Date(review.created_at), "MMM d, yyyy")
          : "Unknown"}
      </TableCell>
      <TableCell>
        <ReviewStatusBadge status={review.verification_status} />
      </TableCell>
      <TableCell>
        <ReviewTableActionsCell
          reviewId={review.id}
          status={review.verification_status}
          onApprove={onApprove}
          onReject={onReject}
          onView={onView}
        />
      </TableCell>
    </TableRow>
  );
};

export default ReviewTableRow;
