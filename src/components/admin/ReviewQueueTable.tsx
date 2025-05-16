
import { useState } from 'react';
import ReviewsTableContent from './reviews/ReviewsTableContent';
import ReviewTableState from './reviews/ReviewTableState';
import ReviewFilterBar from './reviews/ReviewFilterBar';
import ReviewPagination from './reviews/ReviewPagination';
import ViewReviewModal from './ViewReviewModal';
import { useReviewQueue } from '@/hooks/useReviewQueue';

const ReviewQueueTable = () => {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    reviews,
    loading,
    currentPage,
    totalPages,
    activeFilter,
    handlePageChange,
    handleFilterChange,
    handleActionComplete
  } = useReviewQueue(1, 'pending');

  const handleViewDetails = (reviewId: string) => {
    setSelectedReview(reviewId);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Review Queue</h3>
      
      <ReviewFilterBar 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
      />
      
      <ReviewTableState 
        isLoading={loading} 
        isEmpty={reviews.length === 0 && !loading} 
      />

      {!loading && reviews.length > 0 && (
        <>
          <ReviewsTableContent 
            reviews={reviews} 
            onViewDetails={handleViewDetails}
            onActionComplete={handleActionComplete}
          />

          <ReviewPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {selectedReview && (
        <ViewReviewModal
          reviewId={selectedReview}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedReview(null);
          }}
        />
      )}
    </div>
  );
};

export default ReviewQueueTable;
