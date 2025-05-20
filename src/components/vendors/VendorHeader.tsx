
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
        <Button 
          asChild
          className="flex items-center gap-2"
        >
          <Link to="/vendors/new">
            <PlusCircle size={18} />
            Add New Company
          </Link>
        </Button>
      )}
    </div>
  );
};

export default VendorHeader;
