
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select';
import { useReviews } from '@/hooks/useReviews';
import ReviewTable from '@/components/reviews/ReviewTable';
import { FilterState, SimpleCompany } from '@/components/reviews/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ReviewFilters from '@/components/reviews/ReviewFilters';

const Reviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [companies, setCompanies] = useState<SimpleCompany[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  
  // Get initial filter state from URL params
  const getInitialFilters = (): FilterState => {
    return {
      vendorTypes: searchParams.get('types')?.split(',') || [],
      companyName: searchParams.get('company') || null,
      reviewDate: searchParams.get('date') || null,
      states: searchParams.get('states')?.split(',') || [],
      grades: searchParams.get('grades')?.split(',') || [],
      stillActive: searchParams.get('active') || null,
    };
  };
  
  const [filterState, setFilterState] = useState<FilterState>(getInitialFilters());
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  // Setup reviews hook - make sure it matches the expected parameters
  const { reviews, loading } = useReviews();
  
  // Fetch companies for the company filter
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name, type, is_verified, logo_url')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        setCompanies(data || []);
      } catch (err) {
        console.error('Error fetching companies:', err);
        toast({
          title: "Error loading companies",
          description: "Could not load the company filter data."
        });
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    
    fetchCompanies();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };
  
  const applyFilters = (newFilters: FilterState) => {
    setFilterState(newFilters);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    
    if (newFilters.vendorTypes.length > 0) {
      newParams.set('types', newFilters.vendorTypes.join(','));
    } else {
      newParams.delete('types');
    }
    
    if (newFilters.companyName) {
      newParams.set('company', newFilters.companyName);
    } else {
      newParams.delete('company');
    }
    
    if (newFilters.reviewDate) {
      newParams.set('date', newFilters.reviewDate);
    } else {
      newParams.delete('date');
    }
    
    if (newFilters.states.length > 0) {
      newParams.set('states', newFilters.states.join(','));
    } else {
      newParams.delete('states');
    }
    
    if (newFilters.grades.length > 0) {
      newParams.set('grades', newFilters.grades.join(','));
    } else {
      newParams.delete('grades');
    }
    
    if (newFilters.stillActive) {
      newParams.set('active', newFilters.stillActive);
    } else {
      newParams.delete('active');
    }
    
    setSearchParams(newParams);
    
    // Close mobile filters if open
    setIsFiltersOpen(false);
  };
  
  const clearFilters = () => {
    const emptyFilters: FilterState = {
      vendorTypes: [],
      companyName: null,
      reviewDate: null,
      states: [],
      grades: [],
      stillActive: null,
    };
    applyFilters(emptyFilters);
    
    // Also clear search
    setSearchTerm('');
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  };

  const handleSortColumn = (column: string) => {
    // This is just a placeholder - you'll need to implement actual sorting logic
    console.log("Sorting by column:", column);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Solar Industry Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explore genuine reviews from real solar industry professionals
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div className="lg:col-span-1">
          <ReviewFilters 
            filters={filterState}
            companies={companies}
            isLoading={isLoadingCompanies}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
          />
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="mb-6 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews by keywords..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  type="button"
                  className="lg:hidden flex items-center gap-2"
                  onClick={() => setIsFiltersOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
                
                <Button 
                  type="button" 
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </Card>
          
          <ReviewTable 
            reviews={reviews}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={(page) => console.log("Page change:", page)}
            onClearFilters={clearFilters}
            onSort={handleSortColumn}
            sortColumn=""
            sortDirection="asc"
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
