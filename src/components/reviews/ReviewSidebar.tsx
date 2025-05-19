
import { Button } from '@/components/ui/button';
import ReviewFilters from './ReviewFilters';
import { FilterState, SimpleCompany } from './types';

interface ReviewSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  vendorTypes: string[];
  companies: SimpleCompany[];
  states: string[];
  gradeOptions: string[];
}

const ReviewSidebar: React.FC<ReviewSidebarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  vendorTypes,
  companies,
  states,
  gradeOptions
}) => {
  return (
    <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Filters</h2>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>
        <ReviewFilters
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          vendorTypes={vendorTypes}
          companies={companies}
          states={states}
          gradeOptions={gradeOptions}
        />
      </div>
    </div>
  );
};

export default ReviewSidebar;
