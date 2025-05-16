
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Review } from "@/components/admin/reviews/types";

export function useAdminReviews() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Fetch reviews with company details
  const { data: reviewsData, isLoading, refetch: refetchReviews } = useQuery({
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
          rating_communication,
          rating_install_quality,
          rating_payment_reliability,
          rating_timeliness,
          rating_post_install_support,
          company:companies(id, name)
        `);
      
      // Apply status filter based on active tab
      if (activeTab === "pending") {
        query = query.or('verification_status.eq.pending,verification_status.is.null');
      } else if (activeTab !== "all") {
        query = query.eq("verification_status", activeTab);
      }
      
      // Order by date (newest first)
      query = query.order("created_at", { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        toast.error("Failed to load reviews");
        throw error;
      }
      
      return data;
    },
  });

  // Fetch users for each review
  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["admin", "users", reviewsData?.map(r => r.user_id).join(',')],
    queryFn: async () => {
      if (!reviewsData || reviewsData.length === 0) return [];

      const userIds = reviewsData.map(review => review.user_id);
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email, role, created_at")
        .in("id", userIds);
      
      if (error) {
        console.error("Error fetching users:", error);
        return [];
      }
      
      return data;
    },
    enabled: !!reviewsData && reviewsData.length > 0,
  });

  // Combine review data with user data
  useEffect(() => {
    if (reviewsData && usersData) {
      const combinedReviews = reviewsData.map(review => {
        const user = usersData.find(u => u.id === review.user_id);
        
        return {
          ...review,
          user: user ? {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role || 'user', // Ensure role is always provided
            created_at: user.created_at || new Date().toISOString() // Ensure created_at is always provided
          } : undefined,
          // Ensure these are typed properly for the Review interface
          review_title: review.review_title || null,
          review_details: review.review_details || null,
          verification_status: review.verification_status || null,
          average_score: review.average_score || null,
          // Ensure text_feedback has a default value if it's null
          text_feedback: review.text_feedback || "",
          // Ensure rating fields have default values if they're null
          rating_communication: review.rating_communication || 0,
          rating_install_quality: review.rating_install_quality || 0,
          rating_payment_reliability: review.rating_payment_reliability || 0,
          rating_timeliness: review.rating_timeliness || 0,
          rating_post_install_support: review.rating_post_install_support || 0
        } as Review;
      });
      setReviews(combinedReviews);
    }
  }, [reviewsData, usersData]);
  
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

  return {
    reviews: filteredReviews || [],
    isLoading: isLoading || isUsersLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleReviewAction
  };
}
