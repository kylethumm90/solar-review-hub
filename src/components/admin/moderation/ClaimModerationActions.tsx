
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logAdminAction } from '@/utils/adminLogUtils';
import { ClaimModerationProps } from './ModerationActionsTypes';

/**
 * Component for handling claim-specific moderation actions
 */
const ClaimModerationActions = ({ id, companyId, userId, onActionComplete }: ClaimModerationProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
          
          toast.success('Claim request approved and company verified');
        }
      } else {
        toast.success('Claim request approved');
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
      
      toast.success('Claim request has been rejected');
      onActionComplete();
    } catch (error) {
      console.error(`Error rejecting claim:`, error);
      toast.error(`Failed to reject claim`);
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

export default ClaimModerationActions;
