
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { FilterState, SimpleCompany } from '../types';
import { formatVendorType } from '../reviewUtils';

interface DesktopFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  vendorTypes: string[];
  companies: SimpleCompany[];
  states: string[];
  gradeOptions: string[];
  sortOption: string;
  onSortChange: (value: string) => void;
  hasActiveFilters: boolean;
}

const DesktopFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  vendorTypes,
  companies,
  states,
  gradeOptions,
  sortOption,
  onSortChange,
  hasActiveFilters
}: DesktopFiltersProps) => {
  
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

  return (
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
};

export default DesktopFilters;
