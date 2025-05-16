
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user found when attempting to log admin action');
      toast.error('Failed to log admin action: No authenticated user found');
      return { error: new Error('No user found') };
    }
    
    console.log('Attempting to log admin action:', {
      admin_user_id: user.id,
      action_type,
      target_entity,
      target_id,
    });
    
    const { data, error } = await supabase.from('admin_logs').insert({
      admin_user_id: user.id,
      action_type,
      target_entity,
      target_id,
      details
    });
    
    if (error) {
      console.error('Error logging admin action:', error);
      toast.error(`Failed to log admin action: ${error.message}`);
      return { error };
    }
    
    console.log('Admin action logged successfully:', data);
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
        return { error: new Error('No user found') };
      }
      
      console.log('Attempting to log admin action via hook:', {
        admin_user_id: user.id,
        action_type,
        target_entity,
        target_id,
      });
      
      const { data, error } = await supabase.from('admin_logs').insert({
        admin_user_id: user.id,
        action_type,
        target_entity,
        target_id,
        details
      });
      
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
