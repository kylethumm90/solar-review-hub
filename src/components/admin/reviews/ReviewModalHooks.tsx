
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@/types";

export const useReviewData = (reviewId: string, isOpen: boolean) => {
  // Fetch review details
  const { 
    data: review, 
    isLoading: isReviewLoading 
  } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id, 
          review_title, 
          text_feedback, 
          review_details, 
          average_score, 
          verification_status,
          created_at,
          user_id,
          is_anonymous,
          attachment_url,
          company:companies(id, name)
        `)
        .eq("id", reviewId)
        .single();

      if (error) {
        toast.error("Failed to load review details");
        throw error;
      }

      return data;
    },
    enabled: isOpen && !!reviewId,
  });

  // Fetch user separately
  const { 
    data: user, 
    isLoading: isUserLoading 
  } = useQuery({
    queryKey: ["review-user", review?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email")
        .eq("id", review?.user_id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return null;
      }

      return data as User;
    },
    enabled: isOpen && !!review?.user_id,
  });

  // Fetch review answers
  const { 
    data: answers, 
    isLoading: isAnswersLoading 
  } = useQuery({
    queryKey: ["review-answers", reviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("review_answers")
        .select(`
          id, 
          rating, 
          notes,
          question:review_questions(id, category, question)
        `)
        .eq("review_id", reviewId);

      if (error) {
        toast.error("Failed to load review answers");
        throw error;
      }

      return data;
    },
    enabled: isOpen && !!reviewId,
  });

  const isLoading = isReviewLoading || isUserLoading || isAnswersLoading;

  return {
    review,
    user,
    answers,
    isLoading
  };
};
