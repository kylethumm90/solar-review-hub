
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Define allowed action types
const ALLOWED_ACTION_TYPES = [
  'approve_vendor',
  'deny_vendor',
  'edit_vendor',
  'delete_vendor',
  'approve_review',
  'reject_review', // Using reject_review instead of delete_review for consistency
  'edit_review',
  'approve_claim',
  'reject_claim', // Using reject_claim instead of deny_claim for consistency
  'promote_user',
  'change_user_role', // For consistent naming with existing code
  'revoke_admin',
  'edit_vendor_metadata',
  'verify_company' // Used in existing code
];

export interface AdminLogPayload {
  action_type: string;
  target_entity: string;
  target_id: string;
  details?: Record<string, any>;
}

/**
 * Logs an admin action to the admin_logs table if action_type is allowed
 */
export const logAdminAction = async ({
  action_type,
  target_entity,
  target_id,
  details,
}: AdminLogPayload) => {
  try {
    // Validate action type is in allowed list
    if (!ALLOWED_ACTION_TYPES.includes(action_type)) {
      console.error(`Invalid action type: ${action_type}. Must be one of: ${ALLOWED_ACTION_TYPES.join(', ')}`);
      return { 
        error: new Error(`Invalid action type: ${action_type}. Must be one of: ${ALLOWED_ACTION_TYPES.join(', ')}`) 
      };
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return { error: sessionError };
    }
    
    if (!sessionData.session?.user) {
      console.error('No authenticated user found when attempting to log admin action');
      return { error: new Error('No authenticated user found') };
    }
    
    const user = sessionData.session.user;
    
    // Convert target_id to string if it's not already
    const stringTargetId = typeof target_id === 'string' ? target_id : String(target_id);
    
    const { data, error } = await supabase.from('admin_logs').insert({
      admin_user_id: user.id,
      action_type,
      target_entity,
      target_id: stringTargetId,
      details
    }).select();
    
    if (error) {
      console.error('Error logging admin action:', error);
      return { error };
    }
    
    console.log('Admin action logged successfully:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in logAdminAction:', err);
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
};

/**
 * React hook for logging admin actions
 */
export const useAdminLogger = () => {
  const { user } = useAuth();
  
  const logAction = async ({
    action_type,
    target_entity,
    target_id,
    details,
  }: AdminLogPayload) => {
    try {
      // Validate action type is in allowed list
      if (!ALLOWED_ACTION_TYPES.includes(action_type)) {
        console.error(`Invalid action type: ${action_type}. Must be one of: ${ALLOWED_ACTION_TYPES.join(', ')}`);
        toast.error(`Invalid admin action type: ${action_type}`);
        return { 
          error: new Error(`Invalid action type: ${action_type}. Must be one of: ${ALLOWED_ACTION_TYPES.join(', ')}`) 
        };
      }

      if (!user) {
        console.error('No user found when attempting to log admin action');
        toast.error('Failed to log admin action: No authenticated user found');
        return { error: new Error('No authenticated user found') };
      }
      
      // Convert target_id to string if it's not already
      const stringTargetId = typeof target_id === 'string' ? target_id : String(target_id);
      
      const { data, error } = await supabase.from('admin_logs').insert({
        admin_user_id: user.id,
        action_type,
        target_entity,
        target_id: stringTargetId,
        details
      }).select();
      
      if (error) {
        console.error('Error logging admin action:', error);
        toast.error(`Failed to log admin action: ${error.message}`);
        return { error };
      }
      
      console.log('Admin action logged successfully:', data);
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error in useAdminLogger.logAction:', err);
      toast.error(`Unexpected error logging admin action: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return { error: err instanceof Error ? err : new Error('Unknown error') };
    }
  };
  
  return { logAction };
};
