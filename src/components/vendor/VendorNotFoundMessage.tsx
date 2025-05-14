
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VendorNotFoundMessage: React.FC = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vendor Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The vendor you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/vendors">Browse All Vendors</Link>
        </Button>
      </div>
    </div>
  );
};

export default VendorNotFoundMessage;
