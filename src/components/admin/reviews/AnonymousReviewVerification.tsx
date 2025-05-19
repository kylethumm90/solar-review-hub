
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Eye, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatDate } from '@/lib/utils';

const AnonymousReviewVerification = () => {
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPendingReviews() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            users (full_name, email),
            companies (name, id)
          `)
          .eq('is_anonymous', true)
          .eq('verified', false);

        if (error) throw error;
        setPendingReviews(data || []);
      } catch (error) {
        console.error('Error fetching pending reviews:', error);
        toast.custom({
          title: "Error",
          description: "Failed to load pending reviews"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPendingReviews();
  }, []);

  const handleApprove = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ verified: true })
        .eq('id', reviewId);

      if (error) throw error;
      
      setPendingReviews(pendingReviews.filter(review => review.id !== reviewId));
      toast.custom({
        title: "Success",
        description: "Review has been verified and published"
      });
    } catch (error) {
      console.error('Error approving review:', error);
      toast.custom({
        title: "Error",
        description: "Failed to approve review"
      });
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      
      setPendingReviews(pendingReviews.filter(review => review.id !== reviewId));
      toast.custom({
        title: "Success",
        description: "Review has been rejected and removed"
      });
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.custom({
        title: "Error",
        description: "Failed to reject review"
      });
    }
  };

  if (loading) return <LoadingSpinner message="Loading pending reviews..." />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anonymous Review Verification</CardTitle>
        <CardDescription>
          Review and verify anonymous submissions by checking attached documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendingReviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No pending anonymous reviews to verify.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Documentation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">Anonymous</TableCell>
                  <TableCell>{review.companies?.name || "Unknown"}</TableCell>
                  <TableCell>{review.review_title || "Untitled Review"}</TableCell>
                  <TableCell>{formatDate(review.created_at)}</TableCell>
                  <TableCell>
                    {review.attachment_url ? (
                      <a 
                        href={review.attachment_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> View
                      </a>
                    ) : (
                      <span className="text-red-500">Missing</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-800 hover:bg-green-50"
                        onClick={() => handleApprove(review.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => handleReject(review.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`/vendors/${review.companies?.id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AnonymousReviewVerification;
