
import React from 'react';

interface VendorHeaderProps {
  vendor: {
    name: string;
    logo_url?: string;
    type?: string;
  };
}

const VendorHeader = ({ vendor }: VendorHeaderProps) => {
  const formattedCompanyType = vendor.type
    ? vendor.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Company';

  return (
    <div className="flex items-center mb-6 pb-4 border-b">
      {vendor.logo_url ? (
        <img 
          src={vendor.logo_url} 
          alt={`${vendor.name} logo`}
          className="w-16 h-16 object-contain rounded-lg mr-4"
        />
      ) : (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg mr-4">
          <span className="text-2xl text-gray-400">{vendor.name.charAt(0)}</span>
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold">{vendor.name}</h2>
        <p className="text-muted-foreground">{formattedCompanyType}</p>
      </div>
    </div>
  );
};

export default VendorHeader;
