
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import ModerationActions from './ModerationActions';
import ViewReviewModal from './ViewReviewModal';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

type Review = {
  id: string;
  review_title: string | null;
  average_score: number | null;
  verification_status: string | null;
  created_at: string;
  user: {
    email: string;
    full_name: string;
  };
  company: {
    name: string;
  };
};

const ReviewQueueTable = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const pageSize = 10;

  const fetchReviews = async (page: number, status: string | null = null) => {
    setLoading(true);
    try {
      // Get total count for pagination
      let countQuery = supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });
      
      if (status) {
        countQuery = countQuery.eq('verification_status', status);
      }
      
      const { count } = await countQuery;
      
      setTotalPages(Math.ceil((count || 0) / pageSize));

      // Fetch the reviews with company and user data
      let query = supabase
        .from('reviews')
        .select(`
          id,
          review_title,
          average_score,
          verification_status,
          created_at,
          user_id,
          company:companies(name),
          user:users(email, full_name)
        `);
        
      if (status) {
        query = query.eq('verification_status', status);
      }
      
      query = query.order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setReviews(data as unknown as Review[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage, activeFilter);
  }, [currentPage, activeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (reviewId: string) => {
    setSelectedReview(reviewId);
    setIsModalOpen(true);
  };

  const handleActionComplete = () => {
    fetchReviews(currentPage, activeFilter);
  };
  
  const handleFilterChange = (status: string | null) => {
    setActiveFilter(status);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Review Queue</h3>
      
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => handleFilterChange(null)}
          className={`px-3 py-1 rounded text-sm ${activeFilter === null ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          All
        </button>
        <button 
          onClick={() => handleFilterChange('pending')}
          className={`px-3 py-1 rounded text-sm ${activeFilter === 'pending' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Pending
        </button>
        <button 
          onClick={() => handleFilterChange('approved')}
          className={`px-3 py-1 rounded text-sm ${activeFilter === 'approved' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Approved
        </button>
        <button 
          onClick={() => handleFilterChange('rejected')}
          className={`px-3 py-1 rounded text-sm ${activeFilter === 'rejected' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Rejected
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-md">
          <p className="text-gray-600 dark:text-gray-400">No reviews found.</p>
        </div>
      ) : (
        <>
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
                    <TableCell>{getStatusBadge(review.verification_status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {review.verification_status === 'pending' && (
                          <ModerationActions 
                            id={review.id} 
                            type="review" 
                            onActionComplete={handleActionComplete}
                          />
                        )}
                        <button
                          onClick={() => handleViewDetails(review.id)}
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
