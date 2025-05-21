
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState, ExtendedReview, SimpleCompany } from '@/components/reviews/types';
import { ReviewsService } from '@/services/ReviewsService';

export const useReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<SimpleCompany[]>([]);
  const [vendorTypes, setVendorTypes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('recent');
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
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
  
  // Handle column sorting
  const handleSortByColumn = (column: string) => {
    // If clicking the same column, toggle direction
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, set to default sort direction for that column
      setSortColumn(column);
      // Default directions per column
      switch (column) {
        case 'date':
          setSortDirection('desc'); // Most recent first
          setSortOption('recent');
          break;
        case 'grade':
          setSortDirection('desc'); // Highest grade first
          setSortOption('grade-high');
          break;
        case 'installs':
          setSortDirection('desc'); // Most installs first
          setSortOption('installs');
          break;
        case 'company':
          setSortDirection('asc'); // A-Z
          setSortOption('company');
          break;
        default:
          setSortDirection('desc');
      }
    }
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

  return {
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
  };
};
