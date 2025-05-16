
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface AdminLogPayload {
  action_type: string;
  target_entity: string;
  target_id: string;
  details?: Record<string, any>;
}

/**
 * Logs an admin action to the admin_logs table
 */
export const logAdminAction = async ({
  action_type,
  target_entity,
  target_id,
  details,
}: AdminLogPayload) => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      toast.error(`Authentication error: ${sessionError.message}`);
      return { error: sessionError };
    }
    
    if (!sessionData.session?.user) {
      console.error('No authenticated user found when attempting to log admin action');
      toast.error('Failed to log admin action: No authenticated user found');
      return { error: new Error('No authenticated user found') };
    }
    
    const user = sessionData.session.user;
    
    console.log('Attempting to log admin action:', {
      admin_user_id: user.id,
      action_type,
      target_entity,
      target_id,
    });
    
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
    toast.success('Admin action logged successfully');
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in logAdminAction:', err);
    toast.error(`Unexpected error logging admin action: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
      if (!user) {
        console.error('No user found when attempting to log admin action');
        toast.error('Failed to log admin action: No authenticated user found');
        return { error: new Error('No authenticated user found') };
      }
      
      console.log('Attempting to log admin action via hook:', {
        admin_user_id: user.id,
        action_type,
        target_entity,
        target_id,
      });
      
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
      toast.success('Admin action logged successfully');
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error in useAdminLogger.logAction:', err);
      toast.error(`Unexpected error logging admin action: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return { error: err instanceof Error ? err : new Error('Unknown error') };
    }
  };
  
  return { logAction };
};
