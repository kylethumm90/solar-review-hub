
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
          <Link 
            to="/vendors/new"
            className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 gap-2"
          >
            <PlusCircle size={18} />
            Add a new company
          </Link>
        )}
      </div>
    </div>
  );
};

export default VendorEmptyState;
