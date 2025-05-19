
import { useReviews } from '@/hooks/useReviews';
import MobileReviewControls from '@/components/reviews/MobileReviewControls';
import ReviewSidebar from '@/components/reviews/ReviewSidebar';
import DesktopSortControls from '@/components/reviews/DesktopSortControls';
import ReviewGrid from '@/components/reviews/ReviewGrid';

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
    handleFilterChange,
    handleSort,
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
          You can filter by vendor type, grade, location, and more.
        </p>
      </div>
      
      {/* Mobile Controls */}
      <MobileReviewControls 
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
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Filters Sidebar */}
        <ReviewSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          vendorTypes={vendorTypes}
          companies={companies}
          states={states}
          gradeOptions={gradeOptions}
        />
        
        {/* Main Content Area */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          {/* Desktop Sort Controls */}
          <DesktopSortControls
            reviewCount={reviews.length}
            loading={loading}
            sortOption={sortOption}
            onSortChange={handleSort}
          />
          
          {/* Reviews Grid with Pagination */}
          <ReviewGrid
            reviews={reviews}
            loading={loading}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default AllReviews;
