
import ReviewCard from './ReviewCard';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ExtendedReview } from './types';

interface ReviewGridProps {
  reviews: ExtendedReview[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

const ReviewGrid: React.FC<ReviewGridProps> = ({
  reviews,
  loading,
  totalPages,
  currentPage,
  onPageChange,
  onClearFilters
}) => {
  if (loading) {
    return <LoadingSpinner message="Loading reviews..." />;
  }
  
  if (reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          No reviews found matching your filters.
        </p>
        <Button onClick={onClearFilters} variant="outline">
          Clear All Filters
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => (
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              ))
              .map((page, i, arr) => {
                // Add ellipsis
                if (i > 0 && arr[i - 1] !== page - 1) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <span className="px-2">...</span>
                    </PaginationItem>
                  );
                }
                
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default ReviewGrid;
