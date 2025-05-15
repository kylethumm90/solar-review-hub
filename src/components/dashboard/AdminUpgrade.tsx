
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AdminUpgrade = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to upgrade the user to admin
  const upgradeToAdmin = async () => {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, update the user's role in the public.users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id);
        
      if (updateError) {
        // If the user doesn't exist in the users table, insert them
        if (updateError.message.includes('No rows found')) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || 'User',
              role: 'admin'
            });
          
          if (insertError) throw insertError;
          console.log('Created missing user record with admin role');
        } else {
          throw updateError;
        }
      }
      
      // Next, update the user_metadata in auth.users
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { role: 'admin' }
      });
      
      if (metadataError) throw metadataError;
      
      // Update the user in the local state
      setUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          user_metadata: {
            ...prevUser.user_metadata,
            role: 'admin' as 'user' | 'verified_rep' | 'admin',
            full_name: prevUser.user_metadata?.full_name
          }
        };
      });
      
      toast.success('Your account has been upgraded to admin!');
      
      // Force session refresh to ensure the role change is picked up on next page load
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
        toast.error("Failed to refresh session. Please try logging out and back in.");
      } else {
        console.log("Session refreshed successfully with new role");
      }
      
      // Give user feedback that they should now be able to access admin features
      toast.info('Admin access granted! Navigate to /admin to access the admin dashboard', {
        duration: 8000
      });
    } catch (error: any) {
      console.error('Error upgrading role:', error);
      toast.error(error.message || 'Failed to upgrade your account');
    } finally {
      setIsLoading(false);
    }
  };

  const forceSessionRefresh = async () => {
    try {
      setIsLoading(true);
      toast.info('Refreshing session...');
      
      // Force session refresh
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      // Update the user state with the refreshed session data
      if (data.session && data.user) {
        setUser(data.user as any);
        toast.success('Session refreshed successfully');
        toast.info(`Current role: ${data.user.user_metadata?.role || 'user'}`, { 
          duration: 5000 
        });
      }
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      toast.error(error.message || 'Failed to refresh session');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Access</CardTitle>
        <CardDescription>Upgrade your account to admin access</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Current Role:</p>
            <p className="text-lg font-bold capitalize">{user?.user_metadata?.role || 'User'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">User ID:</p>
            <p className="text-xs text-gray-500 break-all">{user?.id || 'Not logged in'}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button 
          onClick={upgradeToAdmin} 
          disabled={isLoading || user?.user_metadata?.role === 'admin'}
          className="w-full"
        >
          {isLoading ? 'Upgrading...' : user?.user_metadata?.role === 'admin' ? 'Already Admin' : 'Upgrade to Admin'}
        </Button>
        
        {user?.user_metadata?.role === 'admin' && (
          <Button 
            variant="outline" 
            onClick={forceSessionRefresh}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Working...' : 'Refresh Session'}
          </Button>
        )}
        
        {user?.user_metadata?.role === 'admin' && (
          <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            <a 
              href="/admin" 
              className="text-primary hover:underline"
            >
              Go to Admin Dashboard
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AdminUpgrade;
