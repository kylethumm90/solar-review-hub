
import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { scoreToGrade } from '@/utils/reviewUtils';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ExtendedReview } from './types';
import { getBadgeColorForGrade, truncateText } from './reviewUtils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface ReviewTableProps {
  reviews: ExtendedReview[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

const ReviewTable = ({
  reviews,
  loading,
  totalPages,
  currentPage,
  onPageChange,
  onClearFilters,
  onSort,
  sortColumn,
  sortDirection
}: ReviewTableProps) => {
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

  // Sort indicator component
  const SortIndicator = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-1 h-4 w-4 inline" /> : 
      <ChevronDown className="ml-1 h-4 w-4 inline" />;
  };

  // Sort header that can be clicked
  const SortableHeader = ({ column, label }: { column: string, label: string }) => (
    <div 
      className="flex items-center cursor-pointer" 
      onClick={() => onSort(column)}
    >
      {label}
      <SortIndicator column={column} />
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <SortableHeader column="reviewer" label="Reviewer" />
              </TableHead>
              <TableHead className="w-[200px]">
                <SortableHeader column="company" label="Vendor" />
              </TableHead>
              <TableHead className="w-[80px] text-center">
                <SortableHeader column="grade" label="Grade" />
              </TableHead>
              <TableHead className="w-[80px] text-center">
                <SortableHeader column="installs" label="Installs" />
              </TableHead>
              <TableHead className="w-[120px]">
                <SortableHeader column="date" label="Date" />
              </TableHead>
              <TableHead className="w-[250px]">Summary</TableHead>
              <TableHead className="w-[100px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map(review => {
              const grade = scoreToGrade(review.average_score || 0);
              const displayName = review.is_anonymous
                ? "Verified Solar Pro"
                : "Verified Reviewer";
              
              return (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {displayName}
                      {review.is_anonymous && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-gray-500 italic">
                                (verified)
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">This reviewer chose to remain private, but their identity and experience have been verified by SolarGrade.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {review.company ? (
                      <Link to={`/vendors/${review.company_id}`} className="text-primary hover:underline">
                        {review.company.name}
                      </Link>
                    ) : "Unknown"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={`${getBadgeColorForGrade(grade)}`}
                    >
                      {grade === 'NR' ? 'Not Rated' : grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {review.install_count || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {truncateText(review.review_title || review.review_details || review.text_feedback || "", 80)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/vendors/${review.company_id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
    </div>
  );
};

export default ReviewTable;
