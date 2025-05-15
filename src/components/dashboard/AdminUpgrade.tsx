
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
      // Update the user's role in the database
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Also update the user_metadata in auth.users to ensure persistence
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
      if (error) console.error("Error refreshing session:", error);
      if (data) console.log("Session refreshed");
      
      // Give user feedback that they should now be able to access admin features
      toast.info('Please try accessing the admin area again', {
        duration: 5000
      });
    } catch (error: any) {
      console.error('Error upgrading role:', error);
      toast.error(error.message || 'Failed to upgrade your account');
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
      <CardFooter>
        <Button 
          onClick={upgradeToAdmin} 
          disabled={isLoading || user?.user_metadata?.role === 'admin'}
          className="w-full"
        >
          {isLoading ? 'Upgrading...' : user?.user_metadata?.role === 'admin' ? 'Already Admin' : 'Upgrade to Admin'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminUpgrade;
