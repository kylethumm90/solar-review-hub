
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Review } from './types';
import { formatDistanceToNow } from 'date-fns';
import ModerationActions from '@/components/admin/ModerationActions';
import ReviewStatusBadge from './ReviewStatusBadge';

type ReviewsTableContentProps = {
  reviews: Review[];
  onViewDetails: (reviewId: string) => void;
  onActionComplete: () => void;
};

const ReviewsTableContent = ({ 
  reviews, 
  onViewDetails,
  onActionComplete 
}: ReviewsTableContentProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Review Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell className="font-medium">{review.review_title || 'Untitled'}</TableCell>
              <TableCell>{review.company?.name || 'Unknown'}</TableCell>
              <TableCell>{review.user?.full_name || review.user?.email || 'Unknown'}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</TableCell>
              <TableCell>{review.average_score?.toFixed(1) || 'N/A'}</TableCell>
              <TableCell><ReviewStatusBadge status={review.verification_status} /></TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {(review.verification_status === 'pending' || review.verification_status === null) && (
                    <ModerationActions 
                      id={review.id} 
                      type="review" 
                      onActionComplete={onActionComplete}
                    />
                  )}
                  <button
                    onClick={() => onViewDetails(review.id)}
                    className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    🔍
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReviewsTableContent;
