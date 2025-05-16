
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Review } from "@/types";
import ReviewsTable from "@/components/admin/reviews/ReviewsTable";

const ReviewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  
  // Fetch reviews with company and user details
  const { data: reviews, isLoading, refetch: refetchReviews } = useQuery({
    queryKey: ["admin", "reviews", activeTab],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select(`
          id,
          company_id,
          user_id,
          review_title,
          review_details,
          text_feedback,
          average_score,
          verification_status,
          created_at,
          company:companies(id, name),
          user:users(id, full_name, email)
        `);
      
      // Apply status filter based on active tab
      if (activeTab !== "all") {
        query = query.eq("verification_status", activeTab);
      }
      
      // Order by date (newest first)
      query = query.order("created_at", { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        toast.error("Failed to load reviews");
        throw error;
      }
      
      return data as Review[];
    },
  });
  
  // Filter reviews based on search query
  const filteredReviews = reviews?.filter(review => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    return (
      review.review_title?.toLowerCase().includes(searchTerm) ||
      review.text_feedback?.toLowerCase().includes(searchTerm) ||
      review.company?.name?.toLowerCase().includes(searchTerm) ||
      review.user?.full_name?.toLowerCase().includes(searchTerm) ||
      review.user?.email?.toLowerCase().includes(searchTerm)
    );
  });
  
  // Handle review moderation action
  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      // Update review verification status
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      const { error } = await supabase
        .from("reviews")
        .update({ verification_status: newStatus })
        .eq("id", reviewId);
      
      if (error) {
        toast.error(`Failed to ${action} review`);
        throw error;
      }
      
      toast.success(`Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      refetchReviews();
    } catch (error) {
      console.error(`Error ${action}ing review:`, error);
      toast.error(`An error occurred while ${action}ing the review`);
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Review Moderation Queue</h1>
      </div>
      
      <div className="bg-muted/20 p-4 rounded-md mb-4">
        <h2 className="font-medium mb-2">About Review Moderation</h2>
        <p className="text-sm text-muted-foreground">
          Reviews submitted by users are initially set to "pending" and must be approved before they appear publicly. 
          Ensure all reviews meet community guidelines before approval.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reviews..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          <ReviewsTable 
            reviews={filteredReviews || []} 
            isLoading={isLoading}
            onApprove={(reviewId) => handleReviewAction(reviewId, 'approve')}
            onReject={(reviewId) => handleReviewAction(reviewId, 'reject')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsPage;
