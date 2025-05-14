
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface VendorActionButtonsProps {
  companyId: string;
}

const VendorActionButtons: React.FC<VendorActionButtonsProps> = ({ companyId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleClaimClick = () => {
    if (!user) {
      toast.info("You must be logged in to claim a vendor");
      navigate('/login', { state: { from: { pathname: `/claim/${companyId}` } } });
      return;
    }
    
    navigate(`/claim/${companyId}`);
  };
  
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button asChild>
        <Link to={`/reviews/${companyId}`}>Write a Review</Link>
      </Button>
      <Button onClick={handleClaimClick} variant="outline">
        Claim This Vendor
      </Button>
    </div>
  );
};

export default VendorActionButtons;
