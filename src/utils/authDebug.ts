
import { supabase } from '@/integrations/supabase/client';

/**
 * Utility function to diagnose and fix common auth issues
 * This can be called from any admin-related component if issues persist
 */
export const diagnoseAuthIssues = async (userId: string | undefined) => {
  if (!userId) {
    console.error('Auth diagnosis: No user ID provided');
    return { success: false, message: 'No user ID provided' };
  }
  
  try {
    console.log('Starting auth diagnosis for user', userId);
    
    // 1. Check if user exists in auth.users (via getUserById)
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError) {
      console.error('Auth diagnosis: Error fetching user from auth.users', userError);
      return { success: false, message: 'User not found in auth system' };
    }
    
    // 2. Check if user exists in public.users
    const { data: publicUserData, error: publicUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (publicUserError) {
      console.error('Auth diagnosis: User not found in public.users table', publicUserError);
      
      // 3. If not in public.users, create the record
      if (publicUserError.message.includes('No rows found')) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: userData.user?.email || '',
            full_name: userData.user?.user_metadata?.full_name || 'User',
            role: userData.user?.user_metadata?.role || 'user'
          });
          
        if (insertError) {
          console.error('Auth diagnosis: Failed to create user record', insertError);
          return { success: false, message: 'Failed to create user record' };
        }
        
        console.log('Auth diagnosis: Created missing user record in public.users');
        return { success: true, message: 'Created missing user record', fixed: true };
      }
      
      return { success: false, message: 'Error accessing user record' };
    }
    
    // 4. Compare roles between auth.users and public.users
    const authRole = userData.user?.user_metadata?.role;
    const dbRole = publicUserData?.role;
    
    console.log('Auth diagnosis: Role comparison', { authRole, dbRole });
    
    if (authRole !== dbRole) {
      // 5. Synchronize roles (prioritize database role)
      if (dbRole === 'admin') {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { role: dbRole }
        });
        
        if (updateError) {
          console.error('Auth diagnosis: Failed to update auth user role', updateError);
          return { success: false, message: 'Failed to synchronize roles' };
        }
        
        // Also refresh session
        await supabase.auth.refreshSession();
        
        console.log('Auth diagnosis: Updated auth role to match database', dbRole);
        return { success: true, message: 'Synchronized roles to admin', fixed: true };
      } else if (authRole === 'admin') {
        // If auth has admin but db doesn't, update db
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Auth diagnosis: Failed to update database role', updateError);
          return { success: false, message: 'Failed to synchronize roles' };
        }
        
        console.log('Auth diagnosis: Updated database role to match auth', authRole);
        return { success: true, message: 'Synchronized roles to admin', fixed: true };
      }
    }
    
    return { 
      success: true, 
      message: 'User authentication appears correct',
      roles: { authRole, dbRole }
    };
    
  } catch (error) {
    console.error('Auth diagnosis: Unexpected error', error);
    return { success: false, message: 'Unexpected error during diagnosis' };
  }
};
