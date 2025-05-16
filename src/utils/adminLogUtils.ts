
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface AdminLogPayload {
  action_type: string;
  target_entity: string;
  target_id: string;
  details?: object;
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
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('No user found when attempting to log admin action');
    return { error: new Error('No user found') };
  }
  
  return supabase.from('admin_logs').insert([{
    admin_user_id: user.id,
    action_type,
    target_entity,
    target_id,
    details
  }]);
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
    if (!user) {
      console.error('No user found when attempting to log admin action');
      return { error: new Error('No user found') };
    }
    
    return supabase.from('admin_logs').insert([{
      admin_user_id: user.id,
      action_type,
      target_entity,
      target_id,
      details
    }]);
  };
  
  return { logAction };
};
