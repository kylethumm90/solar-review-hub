
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VendorActionButtonsProps {
  companyId: string;
}

const VendorActionButtons: React.FC<VendorActionButtonsProps> = ({ companyId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCompanyClaimed, setIsCompanyClaimed] = useState(false);
  const [isClaimedByCurrentUser, setIsClaimedByCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkClaimStatus = async () => {
      setLoading(true);
      try {
        // Check if company has any approved claims
        const { data: claims, error } = await supabase
          .from('claims')
          .select('*')
          .eq('company_id', companyId)
          .eq('status', 'approved');
          
        if (error) {
          console.error('Error checking claim status:', error);
          return;
        }
        
        const hasClaim = claims && claims.length > 0;
        setIsCompanyClaimed(hasClaim);
        
        // Check if current user is the claimer
        if (hasClaim && user) {
          const userClaim = claims.find(claim => claim.user_id === user.id);
          setIsClaimedByCurrentUser(!!userClaim);
        }
      } catch (error) {
        console.error('Error in checkClaimStatus:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkClaimStatus();
  }, [companyId, user]);
  
  const handleClaimClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to claim a vendor"
      });
      navigate('/login', { state: { from: { pathname: `/claim/${companyId}` } } });
      return;
    }
    
    navigate(`/claim/${companyId}`);
  };
  
  if (loading) {
    return <div className="flex gap-4 mb-8 h-10 animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 rounded w-32 h-full"></div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded w-40 h-full"></div>
    </div>;
  }
  
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Button asChild>
        <Link to={`/reviews/${companyId}`}>Write a Review</Link>
      </Button>
      
      {!isCompanyClaimed ? (
        <Button onClick={handleClaimClick} variant="outline">
          Claim This Company
        </Button>
      ) : isClaimedByCurrentUser ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200">
            You manage this listing
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/my-company">Go to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200">
          This profile has been claimed
        </Badge>
      )}
    </div>
  );
};

export default VendorActionButtons;
