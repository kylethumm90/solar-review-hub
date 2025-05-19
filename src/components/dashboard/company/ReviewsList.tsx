
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Review {
  id: string;
  review_title?: string;
  average_score?: number;
  text_feedback?: string;
  created_at: string;
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList = ({ reviews }: ReviewsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <CardDescription>Reviews from your customers</CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{review.review_title || 'Review'}</h3>
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.round(review.average_score || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm">{(review.average_score || 0).toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm mb-2">{review.text_feedback}</p>
                <p className="text-xs text-muted-foreground">
                  Posted on {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsList;
