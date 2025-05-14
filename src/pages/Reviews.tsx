
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ReviewQuestion } from '@/types';
import ReviewCategoryGroup from '@/components/ReviewCategoryGroup';
import { calculateWeightedAverage } from '@/utils/reviewUtils';

const Reviews = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState<ReviewQuestion[]>([]);
  
  // Review form state
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDetails, setReviewDetails] = useState('');
  const [questionRatings, setQuestionRatings] = useState<
    Record<string, { rating: number; notes?: string; question: ReviewQuestion }>
  >({});
  
  useEffect(() => {
    async function fetchVendorInfo() {
      if (!vendorId) return;
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name, logo_url, type')
          .eq('id', vendorId)
          .single();
          
        if (error) throw error;
        setVendor(data);
        
        // Fetch questions for this vendor type
        if (data?.type) {
          const { data: questions, error: questionsError } = await supabase
            .from('review_questions')
            .select('*')
            .eq('company_type', data.type.toLowerCase().replace(/ /g, '_'))
            .order('category');
            
          if (questionsError) throw questionsError;
          setReviewQuestions(questions || []);
        }
      } catch (error) {
        console.error('Error fetching vendor info:', error);
        toast.error('Vendor not found.');
        navigate('/vendors');
      } finally {
        setLoading(false);
      }
    }
    
    fetchVendorInfo();
  }, [vendorId, navigate]);
  
  const handleQuestionChange = (questionId: string, rating: number, notes?: string) => {
    const question = reviewQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    setQuestionRatings(prev => ({
      ...prev,
      [questionId]: { rating, notes, question }
    }));
  };
  
  const calculateAverageScore = () => {
    return calculateWeightedAverage(questionRatings);
  };
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit a review');
      navigate('/login', { state: { from: { pathname: `/reviews/${vendorId}` } } });
      return;
    }
    
    // Validation
    const unansweredQuestions = reviewQuestions.filter(
      q => !questionRatings[q.id] || questionRatings[q.id].rating === 0
    );
    
    if (unansweredQuestions.length > 0) {
      toast.error('Please rate all questions before submitting.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Calculate average score
      const averageScore = calculateAverageScore();
      
      // Insert review
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          company_id: vendorId,
          user_id: user.id,
          review_title: reviewTitle,
          review_details: reviewDetails,
          text_feedback: reviewDetails,
          average_score: averageScore,
          // Add legacy fields for backward compatibility
          rating_communication: 5,
          rating_install_quality: 5,
          rating_payment_reliability: 5,
          rating_timeliness: 5,
          rating_post_install_support: 5
        })
        .select('id')
        .single();
        
      if (reviewError) throw reviewError;
      
      // Insert individual answers
      const reviewAnswers = Object.entries(questionRatings).map(([questionId, { rating, notes }]) => ({
        review_id: review.id,
        question_id: questionId,
        rating,
        notes
      }));
      
      const { error: answersError } = await supabase
        .from('review_answers')
        .insert(reviewAnswers);
        
      if (answersError) throw answersError;
      
      toast.success('Review submitted successfully!');
      navigate(`/vendors/${vendorId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!vendor) {
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
  }
  
  const formattedCompanyType = vendor.type
    ? vendor.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Company';
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
        <p className="text-muted-foreground mb-6">
          Share your experience working with {vendor.name}
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {vendor && (
            <div className="flex items-center mb-6 pb-4 border-b">
              {vendor.logo_url ? (
                <img 
                  src={vendor.logo_url} 
                  alt={`${vendor.name} logo`}
                  className="w-16 h-16 object-contain rounded-lg mr-4"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg mr-4">
                  <span className="text-2xl text-gray-400">{vendor.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{vendor.name}</h2>
                <p className="text-muted-foreground">{formattedCompanyType}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmitReview}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="review-title">Review Title</Label>
                <Input
                  id="review-title"
                  className="mt-1"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your experience in a few words"
                />
              </div>
              
              <div>
                <Label htmlFor="review-details">Overall Experience</Label>
                <Textarea
                  id="review-details"
                  className="min-h-[120px] mt-1"
                  value={reviewDetails}
                  onChange={(e) => setReviewDetails(e.target.value)}
                  placeholder="Share details about your overall experience working with this vendor..."
                />
              </div>
              
              {reviewQuestions.length > 0 ? (
                <ReviewCategoryGroup
                  title={`Rate Your Experience with this ${formattedCompanyType}`}
                  questions={reviewQuestions}
                  onQuestionChange={handleQuestionChange}
                />
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No review questions available for this vendor type.
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={
                    submitting || 
                    reviewQuestions.length === 0 ||
                    Object.keys(questionRatings).length < reviewQuestions.length
                  }
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
