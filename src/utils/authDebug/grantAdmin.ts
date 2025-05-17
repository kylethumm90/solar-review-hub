
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Explicitly grants admin role to current user in both auth metadata and public.users
 */
export const grantAdminRole = async () => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast.error("Not logged in. Please sign in first.");
      return { success: false, message: "Not authenticated" };
    }
    
    const userId = session.user.id;
    const userEmail = session.user.email;
    const metadataName = session.user.user_metadata?.full_name;
    
    console.log("Granting admin role to user:", userId);
    
    // Update or create user in public.users with admin role
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (existingUser) {
      // Update existing user
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userId);
        
      if (updateError) {
        console.error("Failed to update user role:", updateError);
        toast.error("Failed to update role in database");
        return { success: false, message: "Database update failed" };
      }
    } else {
      // Insert new user
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: userEmail || '',
          full_name: metadataName || 'User',
          role: 'admin'
        });
        
      if (insertError) {
        console.error("Failed to create admin user:", insertError);
        toast.error("Failed to create admin user in database");
        return { success: false, message: "Database insert failed" };
      }
    }
    
    // Update user metadata with admin role
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { role: 'admin' }
    });
    
    if (metadataError) {
      console.error("Failed to update user metadata:", metadataError);
      toast.error("Failed to update role in user metadata");
      return { success: false, message: "Metadata update failed" };
    }
    
    // Refresh session
    const { error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error("Error refreshing session:", refreshError);
      toast.error("Failed to refresh session. Please try logging out and back in.");
      return { success: false, message: "Session refresh failed" };
    }
    
    toast.success("Admin role granted! You can now access the admin dashboard.");
    return { success: true, message: "Admin role granted" };
    
  } catch (error) {
    console.error("Error granting admin role:", error);
    toast.error("Error granting admin role");
    return { success: false, message: "Unexpected error" };
  }
};
