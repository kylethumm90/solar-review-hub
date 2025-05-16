
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Review } from "@/types";
import ReviewModal from "./ReviewModal";
import ReviewTableRow from "./ReviewTableRow";
import ReviewTableState from "./ReviewTableState";

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

  return (
    <>
      <ReviewTableState isLoading={isLoading} isEmpty={reviews.length === 0} />

      {!isLoading && reviews.length > 0 && (
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
                <ReviewTableRow
                  key={review.id}
                  review={review}
                  onApprove={onApprove}
                  onReject={onReject}
                  onView={handleViewReview}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
