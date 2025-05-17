
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Diagnoses and repairs auth/user table synchronization issues.
 * - Verifies if the user exists in public.users
 * - Creates the user if missing
 * - Ensures roles are synchronized between auth metadata and public.users
 */
export const diagnoseAuthIssues = async () => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast.error("Not logged in. Please sign in first.");
      return { success: false, message: "Not authenticated" };
    }
    
    const userId = session.user.id;
    const userEmail = session.user.email;
    const metadataRole = session.user.user_metadata?.role;
    const metadataName = session.user.user_metadata?.full_name;
    
    console.log("Diagnosing auth issues for user:", {
      userId,
      userEmail,
      metadataRole,
      metadataName
    });
    
    // Check if user exists in public.users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (userError) {
      if (userError.message.includes('No rows found')) {
        console.log("User not found in public.users table. Creating...");
        
        // Create user in the public.users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: userEmail || '',
            full_name: metadataName || 'User',
            role: metadataRole || 'user'
          });
          
        if (insertError) {
          console.error("Failed to create user record:", insertError);
          toast.error("Failed to create user record in database");
          return { success: false, message: "Failed to create user record" };
        } else {
          toast.success("User record created in database");
        }
      } else {
        console.error("Error fetching user data:", userError);
        toast.error("Error fetching user data");
        return { success: false, message: "Database error" };
      }
    } else {
      console.log("Found user in public.users table:", userData);
      
      // Check if roles match between metadata and public.users
      if (userData.role !== metadataRole && metadataRole) {
        console.log(`Role mismatch: DB=${userData.role}, Metadata=${metadataRole}. Updating DB role...`);
        
        // Update public.users with the role from metadata
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: metadataRole })
          .eq('id', userId);
          
        if (updateError) {
          console.error("Failed to update user role in database:", updateError);
          toast.error("Failed to update role in database");
        } else {
          toast.success("User role synchronized in database");
        }
      }
    }
    
    // If user doesn't have admin role in metadata but should be admin, update it
    if (metadataRole !== 'admin' && userData?.role === 'admin') {
      console.log("Setting admin role in user metadata");
      
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { role: 'admin' }
      });
      
      if (metadataError) {
        console.error("Failed to update user metadata role:", metadataError);
        toast.error("Failed to update role in user metadata");
      } else {
        toast.success("User metadata role updated to admin");
      }
    }
    
    // Refresh session to ensure changes are picked up
    const { error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error("Error refreshing session:", refreshError);
      toast.error("Failed to refresh session. Please try logging out and back in.");
      return { success: false, message: "Session refresh failed" };
    }
    
    const { data: { user: refreshedUser } } = await supabase.auth.getUser();
    
    console.log("Auth diagnosis complete. Current state:", {
      dbRole: userData?.role || 'Not in DB',
      metadataRole: refreshedUser?.user_metadata?.role || 'No role in metadata'
    });
    
    toast.success("Auth diagnosis completed");
    return { 
      success: true, 
      message: "Auth diagnostics complete",
      userInDb: !!userData,
      dbRole: userData?.role || null,
      metadataRole: refreshedUser?.user_metadata?.role || null
    };
    
  } catch (error) {
    console.error("Unexpected error during auth diagnosis:", error);
    toast.error("Error during auth diagnostics");
    return { success: false, message: "Unexpected error" };
  }
};
