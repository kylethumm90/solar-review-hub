
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { calculateWeightedAverage } from '@/utils/reviewUtils';
import { ReviewQuestion } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import VendorNotFound from '@/components/review/VendorNotFound';
import VendorHeader from '@/components/review/VendorHeader';
import ReviewForm from '@/components/review/ReviewForm';
import { ReviewService, VendorInfo } from '@/services/ReviewService';

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
        toast({
          title: "Error",
          description: "Vendor not found.",
          variant: "destructive"
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
    questionRatings: Record<string, { rating: number; notes?: string; question: ReviewQuestion }>
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit a review",
        variant: "destructive"
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
      toast({
        title: "Incomplete review",
        description: "Please rate all questions before submitting",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Calculate average score
      const averageScore = calculateWeightedAverage(questionRatings);
      
      // Format question ratings for API
      const formattedRatings: Record<string, { rating: number; notes?: string }> = {};
      Object.keys(questionRatings).forEach(key => {
        const { rating, notes } = questionRatings[key];
        formattedRatings[key] = { rating, notes };
      });
      
      await ReviewService.submitReview(
        vendorId,
        user.id,
        title,
        details,
        averageScore,
        formattedRatings
      );
      
      toast({
        title: "Success",
        description: "Review submitted successfully!"
      });
      navigate(`/vendors/${vendorId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to submit review',
        variant: "destructive"
      });
    } finally {
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
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
        <p className="text-muted-foreground mb-6">
          Share your experience working with {vendor.name}
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <VendorHeader vendor={vendor} />
          
          <ReviewForm 
            vendor={vendor}
            reviewQuestions={reviewQuestions}
            onSubmit={handleSubmitReview}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
