
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterState, SimpleCompany } from './types';
import { formatVendorType } from './reviewUtils';

interface ReviewFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  vendorTypes: string[];
  companies: SimpleCompany[];
  states: string[];
  gradeOptions: string[];
  isMobile?: boolean;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  vendorTypes,
  companies,
  states,
  gradeOptions,
  isMobile = false
}) => {
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
          onValueChange={(value) => onFilterChange({ companyName: value || null })}
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
          onValueChange={(value) => onFilterChange({ reviewDate: value === "" ? null : value })}
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
          onValueChange={(value) => onFilterChange({ stillActive: value === "" ? null : value })}
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
      
      {/* Clear Filters button for mobile */}
      {isMobile && (
        <Button onClick={onClearFilters} variant="outline" className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default ReviewFilters;
