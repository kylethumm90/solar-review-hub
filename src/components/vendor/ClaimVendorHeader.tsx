
import React from 'react';

interface ClaimVendorHeaderProps {
  vendor: {
    name: string;
    logo_url?: string;
  };
}

const ClaimVendorHeader: React.FC<ClaimVendorHeaderProps> = ({ vendor }) => {
  return (
    <div className="flex items-center mb-6">
      {vendor.logo_url ? (
        <img 
          src={vendor.logo_url} 
          alt={`${vendor.name} logo`}
          className="w-12 h-12 object-contain rounded-lg mr-4"
        />
      ) : (
        <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg mr-4">
          <span className="text-xl text-gray-400">{vendor.name.charAt(0)}</span>
        </div>
      )}
      <h2 className="text-xl font-semibold">{vendor.name}</h2>
    </div>
  );
};

export default ClaimVendorHeader;
