
import React from 'react';
import { Button } from '@/components/ui/button';

const VendorNotFound = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Vendor Not Found</h1>
        <p className="mb-4">Sorry, we couldn't find the vendor you're looking for.</p>
        <Button asChild>
          <a href="/vendors">Browse Vendors</a>
        </Button>
      </div>
    </div>
  );
};

export default VendorNotFound;
