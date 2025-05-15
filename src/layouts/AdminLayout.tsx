
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AdminLayout = () => {
  const { user, isLoading, setUser } = useAuth();
  const [adminVerified, setAdminVerified] = useState<boolean | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAdminStatus = async () => {
      setVerificationLoading(true);
      
      if (!user?.id) {
        setAdminVerified(false);
        setVerificationLoading(false);
        return;
      }

      try {
        // Double check admin status by querying the users table directly
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error verifying admin role:', error);
          // If there's no record found, try to create one
          if (error.message.includes('No rows found')) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || 'User',
                role: user.user_metadata?.role || 'user'
              });
              
            if (insertError) {
              console.error('Failed to create user record:', insertError);
              setAdminVerified(false);
            } else {
              // If user metadata has admin role, respect that
              setAdminVerified(user.user_metadata?.role === 'admin');
            }
          } else {
            setAdminVerified(false);
          }
        } else {
          // Verify if the user has admin role in the database
          const isAdmin = data?.role === 'admin';
          setAdminVerified(isAdmin);
          
          // Update user metadata if it doesn't match the database
          if (isAdmin && user.user_metadata?.role !== 'admin') {
            await supabase.auth.updateUser({
              data: { role: 'admin' }
            });
            
            // Update the user in the local state to reflect the admin role
            setUser(prevUser => {
              if (!prevUser) return null;
              return {
                ...prevUser,
                user_metadata: {
                  ...prevUser.user_metadata,
                  role: 'admin'
                }
              };
            });
            
            // Refresh the session to ensure role persistence
            await supabase.auth.refreshSession();
          }
        }
      } catch (err) {
        console.error('Unexpected error verifying admin status:', err);
        setAdminVerified(false);
      } finally {
        setVerificationLoading(false);
      }
    };

    if (user && !isLoading) {
      verifyAdminStatus();
    } else if (!isLoading) {
      setAdminVerified(false);
      setVerificationLoading(false);
    }
  }, [user, isLoading, setUser]);

  // Show loading state
  if (isLoading || verificationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!user || adminVerified === false) {
    toast({
      title: "Access Denied",
      description: "You do not have admin privileges for this area.",
      variant: "destructive"
    });
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex">
        <AdminSidebar />
        <main className="flex-grow p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
