
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Star, Phone, Globe, Mail, MapPin, Calendar, Shield, AlertCircle } from 'lucide-react';
import { calculateAverageRating } from '@/lib/utils';

const VendorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewAnswers, setReviewAnswers] = useState<any[]>([]);
  const [reviewQuestions, setReviewQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchVendorDetails() {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .single();
        
        if (companyError) throw companyError;
        
        // Fetch reviews for this company
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            users (full_name)
          `)
          .eq('company_id', id)
          .order('created_at', { ascending: false });
        
        if (reviewsError) throw reviewsError;
        
        // Fetch review questions for this company type
        const companyType = companyData.type.toLowerCase().replace(/ /g, '_');
        const { data: questionsData, error: questionsError } = await supabase
          .from('review_questions')
          .select('*')
          .eq('company_type', companyType);
          
        if (questionsError) throw questionsError;
        
        // Fetch review answers if there are reviews
        let answersData: any[] = [];
        if (reviewsData && reviewsData.length > 0) {
          const reviewIds = reviewsData.map(review => review.id);
          const { data: fetchedAnswers, error: answersError } = await supabase
            .from('review_answers')
            .select(`
              *,
              review_questions (*)
            `)
            .in('review_id', reviewIds);
            
          if (answersError) throw answersError;
          answersData = fetchedAnswers || [];
        }
        
        setCompany(companyData);
        setReviews(reviewsData || []);
        setReviewQuestions(questionsData || []);
        setReviewAnswers(answersData);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchVendorDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading vendor details...</p>
        </div>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className="container mx-auto py-12">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vendor Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The vendor you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/vendors">Browse All Vendors</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Get average score either from the reviews.average_score or calculate it from legacy fields
  const getReviewAvgScore = (review: any) => {
    if (review.average_score) return review.average_score;
    return (
      review.rating_communication +
      review.rating_install_quality +
      review.rating_payment_reliability +
      review.rating_timeliness +
      review.rating_post_install_support
    ) / 5;
  };
  
  const avgRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + getReviewAvgScore(review), 0) / reviews.length 
    : 0;
  
  // Group review answers by review ID
  const reviewAnswersByReviewId = reviewAnswers.reduce((acc, answer) => {
    if (!acc[answer.review_id]) {
      acc[answer.review_id] = [];
    }
    acc[answer.review_id].push(answer);
    return acc;
  }, {} as Record<string, any[]>);
  
  return (
    <div className="container mx-auto py-8">
      {/* Company Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            {company.logo_url ? (
              <img 
                src={company.logo_url} 
                alt={`${company.name} logo`}
                className="w-24 h-24 object-contain rounded-lg border dark:border-gray-700"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                <span className="text-3xl text-gray-400">{company.name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mr-3">{company.name}</h1>
              {company.is_verified && (
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Verified</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-500 mr-2">
                {Array(5).fill(0).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(avgRating)
                        ? 'fill-yellow-500'
                        : 'fill-gray-200 dark:fill-gray-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-300">
                {avgRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {company.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              {company.website && (
                <a 
                  href={company.website} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  <span>Website</span>
                </a>
              )}
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Last verified: {new Date(company.last_verified || company.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button asChild>
          <Link to={`/reviews/${company.id}`}>Write a Review</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={`/claim/${company.id}`}>Claim This Vendor</Link>
        </Button>
      </div>
      
      {/* Reviews Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>
        
        {reviews.length > 0 ? (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="border-b dark:border-gray-700 pb-8 last:border-0"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="font-semibold">
                      {review.users?.full_name || 'Anonymous User'}
                    </span>
                    {review.review_title && (
                      <h3 className="text-lg font-medium mt-1">{review.review_title}</h3>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center text-yellow-500 mr-2">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(getReviewAvgScore(review))
                            ? 'fill-yellow-500'
                            : 'fill-gray-200 dark:fill-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {getReviewAvgScore(review).toFixed(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {review.review_details || review.text_feedback}
                </p>
                
                {/* Show detailed ratings if available */}
                {reviewAnswersByReviewId[review.id] && reviewAnswersByReviewId[review.id].length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {reviewAnswersByReviewId[review.id].map((answer) => (
                      <div key={answer.id} className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
                        <div className="text-sm font-medium mb-1">
                          {answer.review_questions?.category}
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center text-yellow-500 mr-2">
                            {Array(5).fill(0).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < answer.rating
                                    ? 'fill-yellow-500'
                                    : 'fill-gray-200 dark:fill-gray-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-600 dark:text-gray-300 text-xs">
                            {answer.rating}
                          </span>
                        </div>
                        {answer.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                            "{answer.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This vendor has no reviews yet. Be the first to leave one!
            </p>
            <Button asChild>
              <Link to={`/reviews/${company.id}`}>Write a Review</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDetails;
