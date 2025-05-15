
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

type ModerationActionsProps = {
  id: string;
  type: 'review' | 'claim';
  companyId?: string;
  userId?: string;
  onActionComplete: () => void;
};

const ModerationActions = ({ id, type, companyId, userId, onActionComplete }: ModerationActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      if (type === 'review') {
        const { error } = await supabase
          .from('reviews')
          .update({ verification_status: 'approved' })
          .eq('id', id);

        if (error) throw error;
        toast.success('Review has been approved');
      } else if (type === 'claim') {
        // Update claim status to approved
        const { error } = await supabase
          .from('claims')
          .update({ status: 'approved' })
          .eq('id', id);

        if (error) throw error;

        // Optionally, update the company to mark it as verified and link to the user
        if (companyId && userId) {
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
            toast.success('Claim request approved and company verified');
          }
        } else {
          toast.success('Claim request approved');
        }
      }

      onActionComplete();
    } catch (error) {
      console.error(`Error approving ${type}:`, error);
      toast.error(`Failed to approve ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      if (type === 'review') {
        const { error } = await supabase
          .from('reviews')
          .update({ verification_status: 'rejected' })
          .eq('id', id);

        if (error) throw error;
        toast.success('Review has been rejected');
      } else if (type === 'claim') {
        const { error } = await supabase
          .from('claims')
          .update({ status: 'rejected' })
          .eq('id', id);

        if (error) throw error;
        toast.success('Claim request has been rejected');
      }

      onActionComplete();
    } catch (error) {
      console.error(`Error rejecting ${type}:`, error);
      toast.error(`Failed to reject ${type}`);
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

export default ModerationActions;
