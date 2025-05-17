
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logAdminAction } from '@/utils/adminLogUtils';
import { ClaimModerationProps } from './ModerationActionsTypes';

/**
 * Component for handling claim-specific moderation actions
 */
const ClaimModerationActions = ({ id, companyId, userId, onActionComplete }: ClaimModerationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  
  // Fetch the current status when the component mounts
  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await supabase
        .from('claims')
        .select('status')
        .eq('id', id)
        .single();
      
      setCurrentStatus(data?.status);
    };
    
    fetchStatus();
  }, [id]);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      // Get previous status for logging
      const { data: claimData } = await supabase
        .from('claims')
        .select('status')
        .eq('id', id)
        .single();
        
      const previousStatus = claimData?.status || 'pending';
      
      // Only proceed if the status is actually changing
      if (previousStatus === 'approved') {
        toast.info('Claim is already approved');
        setIsLoading(false);
        return;
      }
      
      // Update claim status to approved
      const { error } = await supabase
        .from('claims')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      // Optionally, update the company to mark it as verified and link to the user
      if (companyId && userId) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('is_verified, last_verified')
          .eq('id', companyId)
          .single();
          
        const { error: companyError } = await supabase
          .from('companies')
          .update({ 
            is_verified: true,
            last_verified: new Date().toISOString()
          })
          .eq('id', companyId);

        if (companyError) {
          console.error('Error updating company status:', companyError);
          toast.error('Claim approved, but failed to update company status');
        } else {
          // Log the company verification action
          await logAdminAction({
            action_type: 'verify_company',
            target_entity: 'company',
            target_id: companyId,
            details: { 
              previous_status: {
                is_verified: companyData?.is_verified || false,
                last_verified: companyData?.last_verified || null
              }, 
              new_status: {
                is_verified: true,
                last_verified: new Date().toISOString()
              },
              related_claim_id: id
            }
          });
          
          const isStatusChange = previousStatus === 'rejected';
          const message = isStatusChange 
            ? `Claim status changed from ${previousStatus} to approved and company verified` 
            : 'Claim request approved and company verified';
            
          toast.success(message);
        }
      } else {
        const isStatusChange = previousStatus === 'rejected';
        const message = isStatusChange 
          ? `Claim status changed from ${previousStatus} to approved` 
          : 'Claim request approved';
          
        toast.success(message);
      }
      
      // Log the claim approval action
      await logAdminAction({
        action_type: 'approve_claim',
        target_entity: 'claim',
        target_id: id,
        details: { previous_status: previousStatus, new_status: 'approved' }
      });

      onActionComplete();
    } catch (error) {
      console.error(`Error approving claim:`, error);
      toast.error(`Failed to approve claim`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      // Get previous status for logging
      const { data: claimData } = await supabase
        .from('claims')
        .select('status')
        .eq('id', id)
        .single();
        
      const previousStatus = claimData?.status || 'pending';
      
      // Only proceed if the status is actually changing
      if (previousStatus === 'rejected') {
        toast.info('Claim is already rejected');
        setIsLoading(false);
        return;
      }
      
      // Update claim status
      const { error } = await supabase
        .from('claims')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      
      // Log the admin action
      await logAdminAction({
        action_type: 'reject_claim',
        target_entity: 'claim',
        target_id: id,
        details: { previous_status: previousStatus, new_status: 'rejected' }
      });
      
      const isStatusChange = previousStatus === 'approved';
      const message = isStatusChange 
        ? `Claim status changed from ${previousStatus} to rejected` 
        : 'Claim request has been rejected';
        
      toast.success(message);
      onActionComplete();
    } catch (error) {
      console.error(`Error rejecting claim:`, error);
      toast.error(`Failed to reject claim`);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show the appropriate action buttons based on current status
  const showApproveButton = currentStatus !== 'approved';
  const showRejectButton = currentStatus !== 'rejected';

  return (
    <div className="flex space-x-2">
      {showApproveButton && (
        <button
          onClick={handleApprove}
          disabled={isLoading}
          className="px-2 py-1 text-sm text-green-600 hover:text-green-800 disabled:opacity-50"
          title={currentStatus === 'rejected' ? 'Change to approved' : 'Approve'}
        >
          ✅
        </button>
      )}
      {showRejectButton && (
        <button
          onClick={handleReject}
          disabled={isLoading}
          className="px-2 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          title={currentStatus === 'approved' ? 'Change to rejected' : 'Reject'}
        >
          ❌
        </button>
      )}
    </div>
  );
};

export default ClaimModerationActions;
