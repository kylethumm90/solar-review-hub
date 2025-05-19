
import { useState } from 'react';
import { FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerHeader, DrawerFooter } from '@/components/ui/drawer';
import ReviewFilters from './ReviewFilters';
import { FilterState, SimpleCompany } from './types';

interface MobileReviewControlsProps {
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

const MobileReviewControls: React.FC<MobileReviewControlsProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  vendorTypes,
  companies,
  states,
  gradeOptions,
  sortOption,
  onSortChange
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  return (
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
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
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
    </div>
  );
};

export default MobileReviewControls;
