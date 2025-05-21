
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import ReviewCategoryGroup from '@/components/ReviewCategoryGroup';

interface ReviewFormProps {
  companyId: string;
  companyName: string;
  companyType: string;
}

// Define local ReviewQuestion interface to match what's used in this component
interface ReviewQuestionLocal {
  id: string;
  category: string;
  company_type: string;
  question: string;
  weight: number;
}

interface GroupedQuestions {
  [key: string]: ReviewQuestionLocal[];
}

const ReviewForm = ({ companyId, companyName, companyType }: ReviewFormProps) => {
  const [reviewForm, setReviewForm] = useState({
    title: '',
    details: '',
    feedback: ''
  });
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [questions, setQuestions] = useState<ReviewQuestionLocal[]>([]);
  const [groupedQuestions, setGroupedQuestions] = useState<GroupedQuestions>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchReviewQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('review_questions')
          .select('*')
          .eq('company_type', companyType)
          .order('category');
          
        if (error) throw error;
        
        if (data) {
          setQuestions(data);
          
          // Group questions by category
          const grouped = data.reduce<GroupedQuestions>((acc, question) => {
            if (!acc[question.category]) {
              acc[question.category] = [];
            }
            acc[question.category].push(question);
            return acc;
          }, {});
          
          setGroupedQuestions(grouped);
          setCategories(Object.keys(grouped));
          
          // Initialize ratings
          const initialRatings: Record<string, number> = {};
          data.forEach(q => {
            initialRatings[q.id] = 3; // Default to middle value (assuming 1-5 scale)
          });
          setRatings(initialRatings);
        }
      } catch (error) {
        console.error('Error fetching review questions:', error);
      }
    };
    
    fetchReviewQuestions();
  }, [companyType]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRatingChange = (questionId: string, value: number) => {
    setRatings(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review."
      });
      navigate('/login');
      return;
    }
    
    if (Object.keys(ratings).length === 0) {
      toast({
        title: "Rating required",
        description: "Please provide ratings for at least one category."
      });
      return;
    }
    
    if (!reviewForm.feedback.trim()) {
      toast({
        title: "Feedback required",
        description: "Please provide some written feedback about your experience."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate average score from all ratings
      const ratingValues = Object.values(ratings);
      const averageScore = ratingValues.length > 0 
        ? ratingValues.reduce((sum, val) => sum + val, 0) / ratingValues.length 
        : 0;
      
      // Insert review with required fields matching the Review type in index.ts
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          company_id: companyId,
          user_id: user.id,
          text_feedback: reviewForm.feedback,
          review_title: reviewForm.title || null,
          review_details: reviewForm.details || null,
          average_score: averageScore,
          verification_status: 'pending',
          // Include all required fields from the reviews table
          rating_communication: 0,
          rating_install_quality: 0, 
          rating_payment_reliability: 0,
          rating_post_install_support: 0,
          rating_timeliness: 0
        })
        .select()
        .single();
        
      if (reviewError) throw reviewError;
      
      // Insert review answers
      if (reviewData) {
        const reviewAnswers = Object.entries(ratings).map(([questionId, rating]) => ({
          review_id: reviewData.id,
          question_id: questionId,
          rating: rating
        }));
        
        const { error: answersError } = await supabase
          .from('review_answers')
          .insert(reviewAnswers);
          
        if (answersError) throw answersError;
      }
      
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!"
      });
      
      // Navigate to review confirmation page
      navigate(`/review-confirmation/${companyId}`);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error submitting review",
        description: error.message || "There was a problem submitting your review. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Your Review of {companyName}</h2>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-base">Review Title</Label>
            <Input 
              id="title"
              name="title"
              placeholder="Summarize your experience in a few words"
              value={reviewForm.title}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          {categories.map((category) => (
            <div key={category} className="pt-4">
              <h3 className="text-lg font-medium mb-4">{category}</h3>
              <ReviewCategoryGroup 
                questions={groupedQuestions[category]}
                ratings={ratings}
                onRatingChange={handleRatingChange}
              />
              <Separator className="mt-6" />
            </div>
          ))}
          
          <div>
            <Label htmlFor="details" className="text-base">Additional Details (Optional)</Label>
            <Textarea 
              id="details"
              name="details"
              placeholder="Share specific details about your overall experience"
              value={reviewForm.details}
              onChange={handleInputChange}
              className="mt-1 min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="feedback" className="text-base">
              General Feedback <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              id="feedback"
              name="feedback"
              placeholder="Share your overall experience. What went well? What could be improved?"
              value={reviewForm.feedback}
              onChange={handleInputChange}
              className="mt-1 min-h-[150px]"
              required
            />
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end space-x-4">
        <Button 
          type="button"
          variant="outline"
          onClick={() => navigate(`/companies/${companyId}`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        
        <Button 
          type="submit"
          disabled={isSubmitting || !reviewForm.feedback.trim()}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
