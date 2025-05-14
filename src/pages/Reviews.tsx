
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

const Reviews = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Review form state
  const [ratingCommunication, setRatingCommunication] = useState(0);
  const [ratingInstallQuality, setRatingInstallQuality] = useState(0);
  const [ratingPaymentReliability, setRatingPaymentReliability] = useState(0);
  const [ratingTimeliness, setRatingTimeliness] = useState(0);
  const [ratingPostInstallSupport, setRatingPostInstallSupport] = useState(0);
  const [textFeedback, setTextFeedback] = useState('');
  
  useEffect(() => {
    async function fetchVendorInfo() {
      if (!vendorId) return;
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name, logo_url')
          .eq('id', vendorId)
          .single();
          
        if (error) throw error;
        setVendor(data);
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
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to submit a review');
      navigate('/login', { state: { from: { pathname: `/reviews/${vendorId}` } } });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          company_id: vendorId,
          user_id: user.id,
          rating_communication: ratingCommunication,
          rating_install_quality: ratingInstallQuality,
          rating_payment_reliability: ratingPaymentReliability,
          rating_timeliness: ratingTimeliness,
          rating_post_install_support: ratingPostInstallSupport,
          text_feedback: textFeedback
        });
        
      if (error) throw error;
      
      toast.success('Review submitted successfully!');
      navigate(`/vendors/${vendorId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Star rating component
  const StarRating = ({ rating, setRating }: { rating: number, setRating: (rating: number) => void }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer ${
            star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300 dark:text-gray-600'
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
  
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
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {vendor && (
            <div className="flex items-center mb-6">
              {vendor.logo_url ? (
                <img 
                  src={vendor.logo_url} 
                  alt={`${vendor.name} logo`}
                  className="w-12 h-12 object-contain rounded-lg mr-4"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg mr-4">
                  <span className="text-xl text-gray-400">{vendor.name.charAt(0)}</span>
                </div>
              )}
              <h2 className="text-xl font-semibold">{vendor.name}</h2>
            </div>
          )}
          
          <form onSubmit={handleSubmitReview}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Communication
                </label>
                <StarRating rating={ratingCommunication} setRating={setRatingCommunication} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Install Quality
                </label>
                <StarRating rating={ratingInstallQuality} setRating={setRatingInstallQuality} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Reliability
                </label>
                <StarRating rating={ratingPaymentReliability} setRating={setRatingPaymentReliability} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timeliness
                </label>
                <StarRating rating={ratingTimeliness} setRating={setRatingTimeliness} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Post-Install Support
                </label>
                <StarRating rating={ratingPostInstallSupport} setRating={setRatingPostInstallSupport} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Feedback
                </label>
                <textarea
                  className="w-full min-h-[120px] p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-background"
                  value={textFeedback}
                  onChange={(e) => setTextFeedback(e.target.value)}
                  placeholder="Share your experience working with this vendor..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={submitting || !ratingCommunication || !ratingInstallQuality || !ratingPaymentReliability || !ratingTimeliness || !ratingPostInstallSupport}
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
