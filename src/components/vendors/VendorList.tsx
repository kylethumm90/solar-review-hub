
import React from 'react';
import { Company } from '@/types';
import VendorCard from '@/components/VendorCard';
import VendorEmptyState from './VendorEmptyState';

interface VendorListProps {
  isLoading: boolean;
  filteredCompanies: Company[];
  searchTerm: string;
  selectedType: string;
  setSearchTerm: (term: string) => void;
  setSelectedType: (type: string) => void;
  user: any;
}

const VendorList: React.FC<VendorListProps> = ({
  isLoading,
  filteredCompanies,
  searchTerm,
  selectedType,
  setSearchTerm,
  setSelectedType,
  user
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading companies...</p>
        </div>
      </div>
    );
  }
  
  if (filteredCompanies.length === 0) {
    return (
      <VendorEmptyState 
        searchTerm={searchTerm}
        selectedType={selectedType}
        onClearFilters={() => {
          setSearchTerm('');
          setSelectedType('all');
        }}
        user={user}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCompanies.map((company) => (
        <VendorCard
          key={company.id}
          id={company.id}
          name={company.name}
          description={company.description || ''}
          logoUrl={company.logo_url}
          website={company.website}
          grade={company.grade}
          type={company.type || ''}
          rating={company.avg_rating || 0}
          status={company.status}
          isVerified={company.is_verified}
          reviewCount={company.review_count}
        />
      ))}
    </div>
  );
};

export default VendorList;
