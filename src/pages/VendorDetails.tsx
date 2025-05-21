
import { useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import VendorDetailsHeader from '@/components/vendor/VendorDetailsHeader';
import VendorActionButtons from '@/components/vendor/VendorActionButtons';
import ReviewsList from '@/components/vendor/ReviewsList';
import VendorNotFoundMessage from '@/components/vendor/VendorNotFoundMessage';
import { useVendorDetails } from '@/hooks/useVendorDetails';
import { scoreToGrade } from '@/utils/reviewUtils';

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
    return <LoadingSpinner message="Loading company details..." />;
  }
  
  if (!company) {
    return <VendorNotFoundMessage />;
  }
  
  // Calculate letter grade using our standardized function
  // If there are no reviews, it will return 'NR' (Not Rated)
  const letterGrade = reviews.length > 0 ? scoreToGrade(avgRating) : 'NR';
  
  return (
    <div className="container mx-auto py-8 px-4">
      <VendorDetailsHeader 
        company={company} 
        avgRating={avgRating} 
        reviewCount={reviews.length} 
        letterGrade={letterGrade}
      />
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
