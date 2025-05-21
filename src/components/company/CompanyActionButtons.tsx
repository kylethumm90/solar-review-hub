
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Flag, Share, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CompanyActionButtons = ({ companyId }: { companyId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  
  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const shareUrl = `${window.location.origin}/companies/${companyId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this solar company',
          url: shareUrl
        });
        toast({
          title: "Shared successfully",
          description: "The company page has been shared."
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Company link copied to clipboard."
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing failed",
        description: "There was an issue sharing this company.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button 
        asChild 
        className="flex items-center gap-2"
      >
        <Link to={`/reviews/${companyId}`}>
          <Star className="h-4 w-4" />
          Write a Review
        </Link>
      </Button>
      
      <Button 
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleShare}
        disabled={isSharing}
      >
        <Share className="h-4 w-4" />
        Share
      </Button>
      
      {!user && (
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          asChild
        >
          <Link to={`/claim/${companyId}`}>
            <BadgeCheck className="h-4 w-4" />
            Claim Company
          </Link>
        </Button>
      )}
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => {
          toast({
            title: "Report submitted",
            description: "Thank you for reporting this company. We will review it shortly."
          });
        }}
      >
        <Flag className="h-4 w-4" />
        Report
      </Button>
    </div>
  );
};

export default CompanyActionButtons;
