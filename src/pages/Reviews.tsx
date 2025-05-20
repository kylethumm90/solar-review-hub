
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { calculateWeightedAverage } from '@/utils/reviewUtils';
import { ReviewQuestion } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import VendorNotFound from '@/components/review/VendorNotFound';
import VendorHeader from '@/components/review/VendorHeader';
import ReviewForm from '@/components/review/ReviewForm';
import { ReviewService, VendorInfo } from '@/services/ReviewService';
import { Star } from 'lucide-react';

interface ReviewMetadata {
  installCount: number | null;
  stillActive: string | null;
  lastInstallDate: string | null;
  installStates: string[];
  recommendEpc: string | null;
}

const Reviews = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState<ReviewQuestion[]>([]);
  
  useEffect(() => {
    async function fetchVendorInfo() {
      if (!vendorId) return;
      
      try {
        const vendorData = await ReviewService.fetchVendorInfo(vendorId);
        setVendor(vendorData);
        
        // Fetch questions for this vendor type
        if (vendorData?.type) {
          const questions = await ReviewService.fetchReviewQuestions(vendorData.type);
          setReviewQuestions(questions);
        }
      } catch (error) {
        console.error('Error fetching vendor info:', error);
        toast.custom({
          title: "Error",
          description: "Vendor not found."
        });
        navigate('/vendors');
      } finally {
        setLoading(false);
      }
    }
    
    fetchVendorInfo();
  }, [vendorId, navigate]);
  
  const handleSubmitReview = async (
    title: string, 
    details: string, 
    questionRatings: Record<string, { rating: number; question: ReviewQuestion }>,
    isAnonymous: boolean,
    attachment: File | null,
    metadata: ReviewMetadata
  ) => {
    if (!user) {
      toast.custom({
        title: "Authentication required",
        description: "You must be logged in to submit a review"
      });
      navigate('/login', { state: { from: { pathname: `/reviews/${vendorId}` } } });
      return;
    }
    
    if (!vendorId) return;
    
    // Validation
    const unansweredQuestions = reviewQuestions.filter(
      q => !questionRatings[q.id] || questionRatings[q.id].rating === 0
    );
    
    if (unansweredQuestions.length > 0) {
      toast.custom({
        title: "Incomplete review",
        description: "Please rate all questions before submitting"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Calculate average score using the weighted average function
      const averageScore = calculateWeightedAverage(questionRatings);
      
      // Format question ratings for API
      const formattedRatings: Record<string, { rating: number; notes?: string }> = {};
      Object.keys(questionRatings).forEach(key => {
        const { rating } = questionRatings[key];
        formattedRatings[key] = { rating };
      });
      
      await ReviewService.submitReview(
        vendorId,
        user.id,
        title,
        details,
        averageScore,
        formattedRatings,
        isAnonymous,
        attachment,
        metadata
      );
      
      // After submission, navigate to confirmation page with review data
      navigate('/review/confirmation', {
        state: {
          answers: questionRatings,
          vendorName: vendor?.name,
          averageScore,
          vendorId
        }
      });
      
    } catch (error: any) {
      toast.custom({
        title: "Error",
        description: error.message || 'Failed to submit review'
      });
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }
  
  if (!vendor) {
    return <VendorNotFound />;
  }
  
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
      <p className="text-muted-foreground mb-6">
        Share your experience working with {vendor.name}
      </p>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <VendorHeader vendor={vendor} />
        
        <div className="mb-6">
          <span className="text-sm text-gray-500 italic flex items-center gap-1">
            <Star className="h-4 w-4" /> Your selections will be translated into SolarGrade letter grades after submission.
          </span>
        </div>
        
        <ReviewForm 
          vendor={vendor}
          reviewQuestions={reviewQuestions}
          onSubmit={handleSubmitReview}
          submitting={submitting}
        />
      </div>
    </div>
  );
};

export default Reviews;
