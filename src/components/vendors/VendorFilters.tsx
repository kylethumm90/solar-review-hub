
import React from 'react';
import { Search } from 'lucide-react';
import VendorFilterPill from './VendorFilterPill';
import { Company } from '@/types';

interface FilterType {
  value: string;
  label: string;
  icon: string;
}

interface VendorFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  companies: Company[];
  companyTypes: FilterType[];
}

const VendorFilters: React.FC<VendorFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  companies,
  companyTypes,
}) => {
  // Get count of companies by type for the filter pills
  const getCompanyCountByType = (type: string) => {
    if (type === 'all') return companies.length;
    return companies.filter(company => company.type === type).length;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-8 sticky top-0 z-10">
      <div className="flex flex-col space-y-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filter Pills */}
        <div className="flex overflow-x-auto gap-2 pb-1">
          {companyTypes.map(type => (
            <VendorFilterPill
              key={type.value}
              icon={type.icon}
              label={type.label}
              count={getCompanyCountByType(type.value)}
              isActive={selectedType === type.value}
              onClick={() => setSelectedType(type.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorFilters;
