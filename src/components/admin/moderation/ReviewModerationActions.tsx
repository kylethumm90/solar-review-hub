
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logAdminAction } from '@/utils/adminLogUtils';
import { ReviewModerationProps } from './ModerationActionsTypes';

/**
 * Component for handling review-specific moderation actions
 */
const ReviewModerationActions = ({ id, onActionComplete }: ReviewModerationProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      // Get previous status for logging
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('verification_status')
        .eq('id', id)
        .single();
        
      const previousStatus = reviewData?.verification_status || null;
      
      // Update review status
      const { error } = await supabase
        .from('reviews')
        .update({ verification_status: 'approved' })
        .eq('id', id);

      if (error) throw error;
      
      // Log the admin action
      await logAdminAction({
        action_type: 'approve_review',
        target_entity: 'review',
        target_id: id,
        details: { previous_status: previousStatus, new_status: 'approved' }
      });
      
      toast.success('Review has been approved');
      onActionComplete();
    } catch (error) {
      console.error(`Error approving review:`, error);
      toast.error(`Failed to approve review`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      // Get previous status for logging
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('verification_status')
        .eq('id', id)
        .single();
        
      const previousStatus = reviewData?.verification_status || null;
      
      // Update review status
      const { error } = await supabase
        .from('reviews')
        .update({ verification_status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      
      // Log the admin action
      await logAdminAction({
        action_type: 'reject_review',
        target_entity: 'review',
        target_id: id,
        details: { previous_status: previousStatus, new_status: 'rejected' }
      });
      
      toast.success('Review has been rejected');
      onActionComplete();
    } catch (error) {
      console.error(`Error rejecting review:`, error);
      toast.error(`Failed to reject review`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleApprove}
        disabled={isLoading}
        className="px-2 py-1 text-sm text-green-600 hover:text-green-800 disabled:opacity-50"
        title="Approve"
      >
        ✅
      </button>
      <button
        onClick={handleReject}
        disabled={isLoading}
        className="px-2 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
        title="Reject"
      >
        ❌
      </button>
    </div>
  );
};

export default ReviewModerationActions;
