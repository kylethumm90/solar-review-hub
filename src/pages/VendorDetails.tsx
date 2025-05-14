
import { useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import VendorDetailsHeader from '@/components/vendor/VendorDetailsHeader';
import VendorActionButtons from '@/components/vendor/VendorActionButtons';
import ReviewsList from '@/components/vendor/ReviewsList';
import VendorNotFoundMessage from '@/components/vendor/VendorNotFoundMessage';
import { useVendorDetails } from '@/hooks/useVendorDetails';
import { Globe, Calendar } from 'lucide-react';

const VendorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    company, 
    reviews, 
    loading, 
    avgRating, 
    getReviewAvgScore, 
    reviewAnswersByReviewId 
  } = useVendorDetails(id);
  
  if (loading) {
    return <LoadingSpinner message="Loading vendor details..." />;
  }
  
  if (!company) {
    return <VendorNotFoundMessage />;
  }
  
  return (
    <div className="container mx-auto py-8">
      <VendorDetailsHeader company={company} avgRating={avgRating} reviewCount={reviews.length} />
      <VendorActionButtons companyId={company.id} />
      <ReviewsList 
        companyId={company.id}
        reviews={reviews}
        getReviewAvgScore={getReviewAvgScore}
        reviewAnswersByReviewId={reviewAnswersByReviewId}
      />
    </div>
  );
};

export default VendorDetails;
