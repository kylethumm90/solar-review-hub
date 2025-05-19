
import { FilterState, SimpleCompany } from './types';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileFilterDrawer from './filters/MobileFilterDrawer';
import DesktopFilters from './filters/DesktopFilters';
import ActiveFiltersList from './filters/ActiveFiltersList';
import { getActiveFilters } from './filters/FilterUtils';

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
  const isMobile = useIsMobile();
  
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
  
  const activeFilters = getActiveFilters(filters, companies);
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="mb-6">
      {/* Mobile or Desktop View */}
      <div className="md:hidden">
        <MobileFilterDrawer 
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          vendorTypes={vendorTypes}
          companies={companies}
          states={states}
          gradeOptions={gradeOptions}
          activeFiltersCount={activeFilters.length}
        />
      </div>
      <div className="hidden md:block">
        <DesktopFilters 
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          vendorTypes={vendorTypes}
          companies={companies}
          states={states}
          gradeOptions={gradeOptions}
          sortOption={sortOption}
          onSortChange={onSortChange}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
      
      {/* Active filter badges */}
      <ActiveFiltersList 
        filters={activeFilters}
        onRemoveFilter={removeFilter}
      />
    </div>
  );
};

export default TableFilters;
