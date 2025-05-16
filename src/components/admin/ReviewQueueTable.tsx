
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import ReviewsTableContent from './reviews/ReviewsTableContent';
import ReviewTableState from './reviews/ReviewTableState';
import ReviewFilterBar from './reviews/ReviewFilterBar';
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
        loading={loading} 
        isEmpty={reviews.length === 0 && !loading} 
      />

      {!loading && reviews.length > 0 && (
        <>
          <ReviewsTableContent 
            reviews={reviews} 
            onViewDetails={handleViewDetails}
            onActionComplete={handleActionComplete}
          />

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }} 
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={pageNum === currentPage}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
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
