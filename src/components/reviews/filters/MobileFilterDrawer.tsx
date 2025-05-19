
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerHeader, DrawerFooter } from '@/components/ui/drawer';
import { FilterState, SimpleCompany } from '../types';
import ReviewFilters from '../ReviewFilters';

interface MobileFilterDrawerProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  vendorTypes: string[];
  companies: SimpleCompany[];
  states: string[];
  gradeOptions: string[];
  activeFiltersCount: number;
}

const MobileFilterDrawer = ({
  filters,
  onFilterChange,
  onClearFilters,
  vendorTypes,
  companies,
  states,
  gradeOptions,
  activeFiltersCount
}: MobileFilterDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="text-center">
          <h2 className="text-xl font-semibold">Filter Reviews</h2>
        </DrawerHeader>

        <ReviewFilters
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          vendorTypes={vendorTypes}
          companies={companies}
          states={states}
          gradeOptions={gradeOptions}
          isMobile={true}
        />

        <DrawerFooter>
          <Button onClick={onClearFilters} variant="outline">Clear All Filters</Button>
          <DrawerClose asChild>
            <Button>Apply Filters</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilterDrawer;
