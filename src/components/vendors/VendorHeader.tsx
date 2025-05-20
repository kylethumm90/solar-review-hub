
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VendorHeaderProps {
  user: any;
}

const VendorHeader: React.FC<VendorHeaderProps> = ({ user }) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">Solar Companies Directory</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find and review the best companies in the solar industry
        </p>
      </div>
      
      {/* Add New Company Button - Only visible for logged in users */}
      {user && (
        <Link 
          to="/vendors/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium"
        >
          <PlusCircle size={18} />
          Add New Company
        </Link>
      )}
    </div>
  );
};

export default VendorHeader;
