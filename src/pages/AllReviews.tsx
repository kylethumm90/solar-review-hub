import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerHeader, DrawerFooter } from '@/components/ui/drawer';
import { FilterIcon } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewFilters from '@/components/reviews/ReviewFilters';
import { FilterState, SimpleCompany, ExtendedReview } from '@/components/reviews/types';
import { ReviewsService } from '@/services/ReviewsService';

const AllReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<SimpleCompany[]>([]);
  const [vendorTypes, setVendorTypes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortOption, setSortOption] = useState('recent');
  
  // Available grade options
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
  
  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState<FilterState>({
    vendorTypes: searchParams.getAll('type') || [],
    companyName: searchParams.get('company'),
    reviewDate: searchParams.get('date'),
    states: searchParams.getAll('state') || [],
    grades: searchParams.getAll('grade') || [],
    stillActive: searchParams.get('active')
  });
  
  useEffect(() => {
    const loadInitialData = async () => {
      const [vendorTypesData, companiesData, statesData] = await Promise.all([
        ReviewsService.getUniqueVendorTypes(),
        ReviewsService.getCompanies(),
        ReviewsService.getStates()
      ]);
      
      setVendorTypes(vendorTypesData);
      setCompanies(companiesData);
      setStates(statesData);
      fetchReviews();
    };
    
    loadInitialData();
  }, []);
  
  useEffect(() => {
    fetchReviews();
  }, [currentPage, filters, sortOption]);
  
  const fetchReviews = async () => {
    setLoading(true);
    
    try {
      const result = await ReviewsService.fetchReviews(
        currentPage,
        filters,
        sortOption
      );
      
      setReviews(result.reviews);
      setTotalPages(result.totalPages);
      
    } catch (error) {
      console.error("Error in fetchReviews:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1); // Reset to first page when filters change
    
    // Update URL query parameters
    const params = new URLSearchParams();
    
    if (updatedFilters.vendorTypes.length > 0) {
      updatedFilters.vendorTypes.forEach(type => params.append('type', type));
    }
    
    if (updatedFilters.companyName) {
      params.set('company', updatedFilters.companyName);
    }
    
    if (updatedFilters.reviewDate) {
      params.set('date', updatedFilters.reviewDate);
    }
    
    if (updatedFilters.states.length > 0) {
      updatedFilters.states.forEach(state => params.append('state', state));
    }
    
    if (updatedFilters.grades.length > 0) {
      updatedFilters.grades.forEach(grade => params.append('grade', grade));
    }
    
    if (updatedFilters.stillActive) {
      params.set('active', updatedFilters.stillActive);
    }
    
    setSearchParams(params);
  };
  
  const handleSort = (value: string) => {
    setSortOption(value);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const clearFilters = () => {
    setFilters({
      vendorTypes: [],
      companyName: null,
      reviewDate: null,
      states: [],
      grades: [],
      stillActive: null
    });
    setSearchParams({});
  };
  
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
      
      {/* Controls for mobile */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FilterIcon size={16} /> Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-4 pb-6">
            <DrawerHeader className="text-center">
              <h2 className="text-xl font-semibold">Filter Reviews</h2>
            </DrawerHeader>
            {/* Mobile Filters */}
            <ReviewFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              vendorTypes={vendorTypes}
              companies={companies}
              states={states}
              gradeOptions={gradeOptions}
              isMobile={true}
            />
            <DrawerFooter>
              <DrawerClose asChild>
                <Button className="w-full">Apply Filters</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        
        <Select value={sortOption} onValueChange={handleSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="grade-high">Highest Grade</SelectItem>
            <SelectItem value="installs">Most Installs</SelectItem>
            <SelectItem value="company">Vendor A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            <ReviewFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              vendorTypes={vendorTypes}
              companies={companies}
              states={states}
              gradeOptions={gradeOptions}
            />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          {/* Desktop Sort Controls */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              {loading ? 'Loading...' : `Showing ${reviews.length} reviews`}
            </div>
            <Select value={sortOption} onValueChange={handleSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="grade-high">Highest Grade</SelectItem>
                <SelectItem value="installs">Most Installs</SelectItem>
                <SelectItem value="company">Vendor A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {loading ? (
            <LoadingSpinner message="Loading reviews..." />
          ) : reviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No reviews found matching your filters.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
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
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllReviews;
