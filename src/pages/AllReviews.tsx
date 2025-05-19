
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Review, Company } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { scoreToGrade } from '@/utils/reviewUtils';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerHeader, DrawerFooter } from '@/components/ui/drawer';
import { formatDate } from '@/lib/utils';
import { CalendarRange, ChevronDown, FilterIcon, SlidersHorizontal, Check } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

// Define the extended review type that includes joined data
interface ExtendedReview extends Review {
  users?: {
    full_name: string;
  };
  company?: Company;
  install_count?: number;
  install_states?: string[];
  still_active?: string;
}

// Filter state type
interface FilterState {
  vendorTypes: string[];
  companyName: string | null;
  reviewDate: string | null;
  states: string[];
  grades: string[];
  stillActive: string | null;
}

const AllReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [vendorTypes, setVendorTypes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortOption, setSortOption] = useState('recent');
  
  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState<FilterState>({
    vendorTypes: searchParams.getAll('type') || [],
    companyName: searchParams.get('company'),
    reviewDate: searchParams.get('date'),
    states: searchParams.getAll('state') || [],
    grades: searchParams.getAll('grade') || [],
    stillActive: searchParams.get('active')
  });
  
  // Available grade options
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
  
  useEffect(() => {
    // Fetch unique vendor types from companies
    const fetchVendorTypes = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('type')
        .order('type');
        
      if (!error && data) {
        const uniqueTypes = Array.from(new Set(data.map(item => item.type)));
        setVendorTypes(uniqueTypes);
      }
    };
    
    // Fetch all companies for the company filter
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, type, is_verified')
        .order('name');
        
      if (!error && data) {
        setCompanies(data);
      }
    };
    
    // Fetch states from reviews install_states
    const fetchStates = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('install_states')
        .not('install_states', 'is', null);
        
      if (!error && data) {
        const allStates = data.flatMap(review => review.install_states || []);
        const uniqueStates = Array.from(new Set(allStates)).sort();
        setStates(uniqueStates);
      }
    };
    
    fetchVendorTypes();
    fetchCompanies();
    fetchStates();
    fetchReviews();
  }, [currentPage, filters, sortOption]);
  
  const fetchReviews = async () => {
    setLoading(true);
    
    // Build the query
    let query = supabase
      .from('reviews')
      .select(`
        id, company_id, user_id, review_title, review_details, 
        text_feedback, average_score, is_anonymous, created_at,
        install_count, install_states, still_active,
        users (full_name),
        company:companies (id, name, type, logo_url)
      `)
      .eq('verified', true) // Only show verified reviews
      .order('created_at', { ascending: false }); // Default to most recent
      
    // Apply sorting
    if (sortOption === 'grade-high') {
      query = query.order('average_score', { ascending: false });
    } else if (sortOption === 'installs') {
      query = query.order('install_count', { ascending: false, nullsLast: true });
    } else if (sortOption === 'company') {
      // We'll sort by company name after fetching
    }
    
    // Apply filters
    if (filters.vendorTypes.length > 0) {
      query = query.in('company.type', filters.vendorTypes);
    }
    
    if (filters.companyName) {
      query = query.eq('company_id', filters.companyName);
    }
    
    if (filters.reviewDate) {
      const now = new Date();
      let daysAgo;
      
      switch (filters.reviewDate) {
        case '30days':
          daysAgo = 30;
          break;
        case '90days':
          daysAgo = 90;
          break;
        case '365days':
          daysAgo = 365;
          break;
        default:
          daysAgo = null;
      }
      
      if (daysAgo) {
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - daysAgo);
        query = query.gte('created_at', startDate.toISOString());
      }
    }
    
    if (filters.states.length > 0) {
      // This is a bit tricky as install_states is an array
      // We'll filter in JS after fetching
    }
    
    if (filters.grades.length > 0) {
      // We'll filter by grade after calculating it from average_score
    }
    
    if (filters.stillActive === 'yes') {
      query = query.eq('still_active', 'yes');
    } else if (filters.stillActive === 'no') {
      query = query.eq('still_active', 'no');
    }
    
    // Add pagination
    const PAGE_SIZE = 10;
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;
    query = query.range(start, end);
    
    try {
      const { data, error, count } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Apply post-fetch filters
      let filteredData = data || [];
      
      // Filter by states if applicable
      if (filters.states.length > 0) {
        filteredData = filteredData.filter(review => {
          const reviewStates = review.install_states || [];
          return filters.states.some(state => reviewStates.includes(state));
        });
      }
      
      // Filter by grades if applicable
      if (filters.grades.length > 0) {
        filteredData = filteredData.filter(review => {
          const grade = scoreToGrade(review.average_score || 0);
          return filters.grades.includes(grade);
        });
      }
      
      // Sort by company name if selected
      if (sortOption === 'company') {
        filteredData = filteredData.sort((a, b) => {
          const nameA = a.company?.name || '';
          const nameB = b.company?.name || '';
          return nameA.localeCompare(nameB);
        });
      }
      
      setReviews(filteredData);
      
      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / PAGE_SIZE));
      }
      
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
  
  const toggleVendorType = (type: string) => {
    const updated = filters.vendorTypes.includes(type)
      ? filters.vendorTypes.filter(t => t !== type)
      : [...filters.vendorTypes, type];
    
    handleFilterChange({ vendorTypes: updated });
  };
  
  const toggleGrade = (grade: string) => {
    const updated = filters.grades.includes(grade)
      ? filters.grades.filter(g => g !== grade)
      : [...filters.grades, grade];
    
    handleFilterChange({ grades: updated });
  };
  
  const toggleState = (state: string) => {
    const updated = filters.states.includes(state)
      ? filters.states.filter(s => s !== state)
      : [...filters.states, state];
    
    handleFilterChange({ states: updated });
  };
  
  // Format vendor type for display
  const formatVendorType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  // Get the badge color based on grade
  const getBadgeColorForGrade = (grade: string) => {
    if (grade.startsWith('A')) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (grade.startsWith('B')) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    if (grade.startsWith('C')) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
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
            {renderFilters(true)}
            <DrawerFooter>
              <Button onClick={clearFilters} variant="outline" className="w-full mb-2">
                Clear All
              </Button>
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
            {renderFilters()}
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
  
  // Helper function to render filters
  function renderFilters(isMobile = false) {
    return (
      <div className="space-y-6">
        {/* Vendor Type */}
        <div className="space-y-2">
          <h3 className="font-medium">Vendor Type</h3>
          <div className={`space-y-2 ${isMobile ? 'max-h-36 overflow-y-auto' : ''}`}>
            {vendorTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${type}`} 
                  checked={filters.vendorTypes.includes(type)}
                  onCheckedChange={() => toggleVendorType(type)} 
                />
                <label 
                  htmlFor={`type-${type}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {formatVendorType(type)}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Company Name */}
        <div className="space-y-2">
          <h3 className="font-medium">Company Name</h3>
          <Select 
            value={filters.companyName || ""} 
            onValueChange={(value) => handleFilterChange({ companyName: value || null })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Review Date */}
        <div className="space-y-2">
          <h3 className="font-medium">Review Date</h3>
          <RadioGroup 
            value={filters.reviewDate || ""}
            onValueChange={(value) => handleFilterChange({ reviewDate: value === "" ? null : value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all-dates" />
              <Label htmlFor="all-dates">All Time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30days" id="30days" />
              <Label htmlFor="30days">Last 30 Days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="90days" id="90days" />
              <Label htmlFor="90days">Last 90 Days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="365days" id="365days" />
              <Label htmlFor="365days">Last 365 Days</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* States */}
        <div className="space-y-2">
          <h3 className="font-medium">State</h3>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="flex justify-between w-full">
                {filters.states.length === 0 ? 'Select States' : `${filters.states.length} Selected`}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className={`mt-2 grid grid-cols-2 gap-1 ${isMobile ? 'max-h-36 overflow-y-auto' : ''}`}>
                {states.map((state) => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`state-${state}`} 
                      checked={filters.states.includes(state)}
                      onCheckedChange={() => toggleState(state)} 
                    />
                    <label 
                      htmlFor={`state-${state}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {state}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        {/* Grade Threshold */}
        <div className="space-y-2">
          <h3 className="font-medium">Grade Threshold</h3>
          <div className={`space-y-2 ${isMobile ? 'max-h-36 overflow-y-auto' : ''}`}>
            {gradeOptions.map((grade) => (
              <div key={grade} className="flex items-center space-x-2">
                <Checkbox 
                  id={`grade-${grade}`} 
                  checked={filters.grades.includes(grade)}
                  onCheckedChange={() => toggleGrade(grade)} 
                />
                <label 
                  htmlFor={`grade-${grade}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {grade}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Still Active */}
        <div className="space-y-2">
          <h3 className="font-medium">Still Working With Vendor</h3>
          <RadioGroup 
            value={filters.stillActive || ""} 
            onValueChange={(value) => handleFilterChange({ stillActive: value === "" ? null : value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all-active" />
              <Label htmlFor="all-active">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="active-yes" />
              <Label htmlFor="active-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="active-no" />
              <Label htmlFor="active-no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  }
};

// Review Card Component
const ReviewCard = ({ review }: { review: ExtendedReview }) => {
  const grade = scoreToGrade(review.average_score || 0);
  const displayName = review.is_anonymous
    ? "Verified Solar Pro"
    : review.users?.full_name || "Anonymous";
  
  const getBadgeColor = (grade: string) => {
    if (grade.startsWith('A')) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (grade.startsWith('B')) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    if (grade.startsWith('C')) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };
  
  // Truncate review text
  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">
                {displayName}
              </h3>
              {review.is_anonymous && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-gray-500 italic">
                        (identity verified)
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">This reviewer chose to remain private, but their identity and experience have been verified by SolarGrade.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {review.install_count && review.install_count > 0 && (
              <p className="text-xs text-gray-500">
                Based on {review.install_count} installs
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <Badge 
              variant="outline" 
              className={`${getBadgeColor(grade)}`}
            >
              Grade: {grade}
            </Badge>
            <span className="text-xs text-gray-500 mt-1">
              {formatDate(review.created_at, { format: 'MMM yyyy' })}
            </span>
          </div>
        </div>
        
        {review.company && (
          <div className="mb-3">
            <Link to={`/vendors/${review.company_id}`} className="text-primary hover:underline font-medium">
              {review.company.name}
            </Link>
            <span className="text-xs text-gray-500 ml-2">
              {review.company.type && formatVendorType(review.company.type)}
            </span>
          </div>
        )}
        
        {review.review_title && (
          <h4 className="font-medium mb-1">{review.review_title}</h4>
        )}
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {truncateText(review.review_details || review.text_feedback || "", 150)}
        </p>
        
        {/* Show some review categories if available */}
        {/* This would be implemented with review_answers, if available */}
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={`/vendors/${review.company_id}`}>
            View Company Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AllReviews;
