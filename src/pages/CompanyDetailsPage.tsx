
import { useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useVendorDetails } from '@/hooks/useVendorDetails';
import { scoreToGrade } from '@/utils/reviewUtils';
import CompanyDetailsHeader from '@/components/company/CompanyDetailsHeader';
import CompanyActionButtons from '@/components/company/CompanyActionButtons';
import ReviewsList from '@/components/company/ReviewsList';
import CompanyNotFoundMessage from '@/components/company/CompanyNotFoundMessage';

const CompanyDetailsPage = () => {
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
    return <CompanyNotFoundMessage />;
  }
  
  // Calculate letter grade using our standardized function
  // If there are no reviews, it will return 'NR' (Not Rated)
  const letterGrade = reviews.length > 0 ? scoreToGrade(avgRating) : 'NR';
  
  console.log(`Company ${company.name} has grade ${letterGrade} with avg score ${avgRating}`);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <CompanyDetailsHeader 
        company={company} 
        avgRating={avgRating} 
        reviewCount={reviews.length} 
        letterGrade={letterGrade}
      />
      <CompanyActionButtons companyId={company.id} />
      <ReviewsList 
        companyId={company.id}
        reviews={reviews}
        getReviewAvgScore={getReviewAvgScore}
        reviewAnswersByReviewId={reviewAnswersByReviewId}
      />
    </div>
  );
};

export default CompanyDetailsPage;
