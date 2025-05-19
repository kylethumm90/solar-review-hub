
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerHeader, DrawerFooter } from '@/components/ui/drawer';
import { X, Filter, ChevronDown } from 'lucide-react';
import { FilterState, SimpleCompany } from './types';
import { formatVendorType } from './reviewUtils';
import { useMediaQuery } from '@/hooks/use-mobile';

interface TableFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  vendorTypes: string[];
  companies: SimpleCompany[];
  states: string[];
  gradeOptions: string[];
  sortOption: string;
  onSortChange: (value: string) => void;
}

const TableFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  vendorTypes,
  companies,
  states,
  gradeOptions,
  sortOption,
  onSortChange
}: TableFiltersProps) => {
  const [isVendorDrawerOpen, setIsVendorDrawerOpen] = useState(false);
  const [isGradeDrawerOpen, setIsGradeDrawerOpen] = useState(false);
  const [isStateDrawerOpen, setIsStateDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const toggleVendorType = (type: string) => {
    const updated = filters.vendorTypes.includes(type)
      ? filters.vendorTypes.filter(t => t !== type)
      : [...filters.vendorTypes, type];
    
    onFilterChange({ vendorTypes: updated });
  };
  
  const toggleGrade = (grade: string) => {
    const updated = filters.grades.includes(grade)
      ? filters.grades.filter(g => g !== grade)
      : [...filters.grades, grade];
    
    onFilterChange({ grades: updated });
  };
  
  const toggleState = (state: string) => {
    const updated = filters.states.includes(state)
      ? filters.states.filter(s => s !== state)
      : [...filters.states, state];
    
    onFilterChange({ states: updated });
  };
  
  const removeFilter = (type: string, value: string) => {
    switch(type) {
      case 'vendorType':
        onFilterChange({ vendorTypes: filters.vendorTypes.filter(t => t !== value) });
        break;
      case 'grade':
        onFilterChange({ grades: filters.grades.filter(g => g !== value) });
        break;
      case 'state':
        onFilterChange({ states: filters.states.filter(s => s !== value) });
        break;
      case 'reviewDate':
        onFilterChange({ reviewDate: null });
        break;
      case 'company':
        onFilterChange({ companyName: null });
        break;
      case 'stillActive':
        onFilterChange({ stillActive: null });
        break;
    }
  };
  
  // Active filters for display
  const getActiveFilters = () => {
    const active = [];
    
    // Vendor types
    filters.vendorTypes.forEach(type => {
      active.push({
        type: 'vendorType',
        value: type,
        label: formatVendorType(type)
      });
    });
    
    // Grades
    filters.grades.forEach(grade => {
      active.push({
        type: 'grade',
        value: grade,
        label: `Grade: ${grade}`
      });
    });
    
    // States
    filters.states.forEach(state => {
      active.push({
        type: 'state',
        value: state,
        label: `State: ${state}`
      });
    });
    
    // Date filter
    if (filters.reviewDate) {
      let dateLabel = '';
      switch(filters.reviewDate) {
        case '30days': dateLabel = 'Last 30 Days'; break;
        case '90days': dateLabel = 'Last 90 Days'; break;
        case '365days': dateLabel = 'Last Year'; break;
      }
      active.push({
        type: 'reviewDate',
        value: filters.reviewDate,
        label: dateLabel
      });
    }
    
    // Company
    if (filters.companyName) {
      const company = companies.find(c => c.id === filters.companyName);
      if (company) {
        active.push({
          type: 'company',
          value: filters.companyName,
          label: `Company: ${company.name}`
        });
      }
    }
    
    // Still active
    if (filters.stillActive) {
      active.push({
        type: 'stillActive',
        value: filters.stillActive,
        label: `${filters.stillActive === 'yes' ? 'Still Active' : 'Not Active'}`
      });
    }
    
    return active;
  };
  
  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;
  
  // Mobile drawer for all filters
  const renderMobileFilters = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">{activeFilters.length}</Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="text-center">
          <h2 className="text-xl font-semibold">Filter Reviews</h2>
        </DrawerHeader>

        <div className="space-y-6">
          {/* Vendor Types */}
          <div className="space-y-2">
            <h3 className="font-medium">Vendor Type</h3>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {vendorTypes.map((type) => (
                <div key={type} className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.vendorTypes.includes(type)}
                      onChange={() => toggleVendorType(type)}
                      className="rounded border-gray-300"
                    />
                    <span>{formatVendorType(type)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Company Name */}
          <div className="space-y-2">
            <h3 className="font-medium">Company</h3>
            <Select 
              value={filters.companyName || "all"} 
              onValueChange={(value) => onFilterChange({ companyName: value === "all" ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Grades */}
          <div className="space-y-2">
            <h3 className="font-medium">Grade</h3>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {gradeOptions.map((grade) => (
                <div key={grade} className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.grades.includes(grade)}
                      onChange={() => toggleGrade(grade)}
                      className="rounded border-gray-300"
                    />
                    <span>{grade}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* States */}
          <div className="space-y-2">
            <h3 className="font-medium">States</h3>
            <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto">
              {states.map((state) => (
                <div key={state} className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.states.includes(state)}
                      onChange={() => toggleState(state)}
                      className="rounded border-gray-300"
                    />
                    <span>{state}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Date Range */}
          <div className="space-y-2">
            <h3 className="font-medium">Date Range</h3>
            <Select 
              value={filters.reviewDate || "all"} 
              onValueChange={(value) => onFilterChange({ reviewDate: value === "all" ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="365days">Last 365 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Still Active */}
          <div className="space-y-2">
            <h3 className="font-medium">Still Working With Vendor</h3>
            <Select 
              value={filters.stillActive || "all"} 
              onValueChange={(value) => onFilterChange({ stillActive: value === "all" ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={onClearFilters} variant="outline">Clear All Filters</Button>
          <DrawerClose asChild>
            <Button>Apply Filters</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
  
  // Desktop filter dropdowns
  const renderDesktopFilters = () => (
    <div className="flex flex-wrap gap-2">
      {/* Vendor Type Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            Vendor Type <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Vendor Types</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {vendorTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={filters.vendorTypes.includes(type)}
              onCheckedChange={() => toggleVendorType(type)}
            >
              {formatVendorType(type)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Grade Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            Grade <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Grade Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {gradeOptions.map((grade) => (
            <DropdownMenuCheckboxItem
              key={grade}
              checked={filters.grades.includes(grade)}
              onCheckedChange={() => toggleGrade(grade)}
            >
              {grade}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* State Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            State <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
          <DropdownMenuLabel>States</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {states.map((state) => (
            <DropdownMenuCheckboxItem
              key={state}
              checked={filters.states.includes(state)}
              onCheckedChange={() => toggleState(state)}
            >
              {state}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Company Filter */}
      <Select 
        value={filters.companyName || "all"} 
        onValueChange={(value) => onFilterChange({ companyName: value === "all" ? null : value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Company" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Companies</SelectItem>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Date Filter */}
      <Select 
        value={filters.reviewDate || "all"} 
        onValueChange={(value) => onFilterChange({ reviewDate: value === "all" ? null : value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="30days">Last 30 Days</SelectItem>
          <SelectItem value="90days">Last 90 Days</SelectItem>
          <SelectItem value="365days">Last 365 Days</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Still Active Filter */}
      <Select 
        value={filters.stillActive || "all"} 
        onValueChange={(value) => onFilterChange({ stillActive: value === "all" ? null : value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Active Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="yes">Still Active</SelectItem>
          <SelectItem value="no">Not Active</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Sort */}
      <Select value={sortOption} onValueChange={onSortChange}>
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
      
      {/* Clear filters button */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters} className="text-red-600">
          Clear All
        </Button>
      )}
    </div>
  );

  return (
    <div className="mb-6">
      {/* Mobile or Desktop View */}
      <div className="md:hidden">{renderMobileFilters()}</div>
      <div className="hidden md:block">{renderDesktopFilters()}</div>
      
      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeFilters.map((filter, i) => (
            <Badge key={`${filter.type}-${i}`} variant="secondary" className="flex items-center gap-1">
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeFilter(filter.type, filter.value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableFilters;
