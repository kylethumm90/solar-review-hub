import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Review } from "@/components/admin/reviews/types";
import { logAdminAction } from "@/utils/adminLogUtils";

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
          company:companies(id, name, description, website, type, is_verified, logo_url, grade, last_verified, created_at)
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
            role: user.role || 'user',
            created_at: user.created_at || new Date().toISOString()
          } : undefined,
          company: review.company ? {
            id: review.company.id,
            name: review.company.name,
            description: review.company.description || "",
            website: review.company.website || "",
            type: review.company.type || "",
            is_verified: review.company.is_verified || false,
            logo_url: review.company.logo_url,
            grade: review.company.grade,
            last_verified: review.company.last_verified,
            created_at: review.company.created_at || new Date().toISOString()
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
  
  // Handle review moderation action with proper logging
  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      // Get previous status for logging
      const { data: reviewData, error: fetchError } = await supabase
        .from("reviews")
        .select("verification_status")
        .eq("id", reviewId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching review status:", fetchError);
        toast.error(`Failed to fetch review status`);
        return;
      }
      
      const previousStatus = reviewData?.verification_status || null;
      
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
      
      // Log the admin action
      const actionType = action === 'approve' ? 'approve_review' : 'reject_review';
      const logResult = await logAdminAction({
        action_type: actionType,
        target_entity: 'review',
        target_id: reviewId,
        details: { previous_status: previousStatus, new_status: newStatus }
      });
      
      if (logResult.error) {
        console.error(`Error logging review ${action}:`, logResult.error);
        toast.error(`Review ${action === 'approve' ? 'approved' : 'rejected'} successfully, but failed to log action`);
      } else {
        toast.success(`Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      }
      
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
