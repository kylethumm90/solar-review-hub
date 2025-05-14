
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface VendorActionButtonsProps {
  companyId: string;
}

const VendorActionButtons: React.FC<VendorActionButtonsProps> = ({ companyId }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button asChild>
        <Link to={`/reviews/${companyId}`}>Write a Review</Link>
      </Button>
      <Button asChild variant="outline">
        <Link to={`/claim/${companyId}`}>Claim This Vendor</Link>
      </Button>
    </div>
  );
};

export default VendorActionButtons;
