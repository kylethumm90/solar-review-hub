
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VendorEmptyStateProps {
  searchTerm: string;
  selectedType: string;
  onClearFilters: () => void;
  user: any;
}

const VendorEmptyState: React.FC<VendorEmptyStateProps> = ({
  searchTerm,
  selectedType,
  onClearFilters,
  user
}) => {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
        No companies found matching your criteria.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button onClick={onClearFilters}>
          Clear Filters
        </Button>
        
        {user && (
          <Button 
            as={Link}
            to="/vendors/new"
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add a new company
          </Button>
        )}
      </div>
    </div>
  );
};

export default VendorEmptyState;
