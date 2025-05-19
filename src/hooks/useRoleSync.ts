
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export function useRoleSync() {
  const { user } = useAuth();
  
  const syncUserRoleToDatabase = async (currentUser) => {
    if (!currentUser) return;
    
    try {
      const role = currentUser.user_metadata?.role || 'user';
      console.log(`[RoleSync] Syncing user role to database: ${role}`);
      
      // Upsert to ensure the user exists in the users table with correct role
      const { error } = await supabase
        .from('users')
        .upsert({
          id: currentUser.id,
          email: currentUser.email,
          role: role,
          full_name: currentUser.user_metadata?.full_name || 'User'
        }, {
          onConflict: 'id'
        });
      
      if (error) {
        console.error('[RoleSync] Error syncing user role to database:', error);
        toast.error('Failed to sync user permissions');
        return false;
      }
      
      toast.success('User permissions synchronized');
      return true;
    } catch (err) {
      console.error('[RoleSync] Error in syncUserRoleToDatabase:', err);
      return false;
    }
  };
  
  return {
    syncUserRoleToDatabase,
  };
}
