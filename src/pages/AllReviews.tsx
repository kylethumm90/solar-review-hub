
import { useReviews } from '@/hooks/useReviews';
import ReviewTable from '@/components/reviews/ReviewTable';
import TableFilters from '@/components/reviews/TableFilters';

const AllReviews = () => {
  // Available grade options
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
  
  const {
    reviews,
    loading,
    companies,
    vendorTypes,
    states,
    filters,
    currentPage,
    totalPages,
    sortOption,
    sortColumn,
    sortDirection,
    handleFilterChange,
    handleSort,
    handleSortByColumn,
    handlePageChange,
    clearFilters
  } = useReviews();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">All Reviews</h1>
        <p className="text-sm text-gray-600">
          Browse verified reviews submitted by solar professionals across the industry. 
          Filter and sort to find the information you need.
        </p>
      </div>
      
      {/* Top Filters */}
      <TableFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        vendorTypes={vendorTypes}
        companies={companies}
        states={states}
        gradeOptions={gradeOptions}
        sortOption={sortOption}
        onSortChange={handleSort}
      />
      
      {/* Reviews Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <ReviewTable
          reviews={reviews}
          loading={loading}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onClearFilters={clearFilters}
          onSort={handleSortByColumn}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      </div>
    </div>
  );
};

export default AllReviews;
