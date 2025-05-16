
import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import ReviewModal from "./ReviewModal";

interface ReviewsTableProps {
  reviews: Review[];
  isLoading: boolean;
  onApprove: (reviewId: string) => void;
  onReject: (reviewId: string) => void;
}

const ReviewsTable = ({
  reviews,
  isLoading,
  onApprove,
  onReject,
}: ReviewsTableProps) => {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewReview = (reviewId: string) => {
    setSelectedReview(reviewId);
    setIsModalOpen(true);
  };

  const renderStatusBadge = (status: string | null) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
            Unknown
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-md">
        <p className="text-gray-600 dark:text-gray-400">No reviews found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">
                  {review.company?.name || "Unknown"}
                </TableCell>
                <TableCell>
                  {review.user?.full_name || review.user?.email || "Unknown"}
                </TableCell>
                <TableCell>
                  {review.review_title || "Untitled Review"}
                </TableCell>
                <TableCell>
                  <span className={review.average_score && review.average_score < 2.5 ? "text-red-500 font-semibold" : ""}>
                    {review.average_score?.toFixed(1) || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  {review.created_at
                    ? format(new Date(review.created_at), "MMM d, yyyy")
                    : "Unknown"}
                </TableCell>
                <TableCell>{renderStatusBadge(review.verification_status)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {review.verification_status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-green-600 hover:text-green-800 hover:bg-green-50"
                          onClick={() => onApprove(review.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => onReject(review.id)}
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
                      onClick={() => handleViewReview(review.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedReview && (
        <ReviewModal
          reviewId={selectedReview}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedReview(null);
          }}
        />
      )}
    </>
  );
};

export default ReviewsTable;
