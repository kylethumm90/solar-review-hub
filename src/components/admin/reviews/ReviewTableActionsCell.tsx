
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logAdminAction } from "@/utils/adminLogUtils";
import { toast } from "sonner";

interface ReviewTableActionsCellProps {
  reviewId: string;
  status: string | null;
  onApprove: (reviewId: string) => void;
  onReject: (reviewId: string) => void;
  onView: (reviewId: string) => void;
}

const ReviewTableActionsCell = ({
  reviewId,
  status,
  onApprove,
  onReject,
  onView
}: ReviewTableActionsCellProps) => {
  const handleApprove = async (reviewId: string) => {
    try {
      // Get previous status for logging
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('verification_status')
        .eq('id', reviewId)
        .single();
        
      const previousStatus = reviewData?.verification_status || null;
      
      // Call the original onApprove function
      onApprove(reviewId);
      
      // Log the admin action
      await logAdminAction({
        action_type: 'approve_review',
        target_entity: 'review',
        target_id: reviewId,
        details: { previous_status: previousStatus, new_status: 'approved' }
      });
    } catch (error) {
      console.error('Error processing review approval:', error);
      toast.error('Failed to log review approval action');
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      // Get previous status for logging
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('verification_status')
        .eq('id', reviewId)
        .single();
        
      const previousStatus = reviewData?.verification_status || null;
      
      // Call the original onReject function
      onReject(reviewId);
      
      // Log the admin action
      await logAdminAction({
        action_type: 'reject_review',
        target_entity: 'review',
        target_id: reviewId,
        details: { previous_status: previousStatus, new_status: 'rejected' }
      });
    } catch (error) {
      console.error('Error processing review rejection:', error);
      toast.error('Failed to log review rejection action');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {(status === "pending" || status === null) && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 text-green-600 hover:text-green-800 hover:bg-green-50"
            onClick={() => handleApprove(reviewId)}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
            onClick={() => handleReject(reviewId)}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="h-8 px-2"
        onClick={() => onView(reviewId)}
      >
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
    </div>
  );
};

export default ReviewTableActionsCell;
