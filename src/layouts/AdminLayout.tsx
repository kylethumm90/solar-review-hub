
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { diagnoseAuthIssues } from '@/utils/authDebug';

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
        // First check if the user has admin role in their metadata
        const isAdminInMetadata = user.user_metadata?.role === 'admin';
        
        if (isAdminInMetadata) {
          setAdminVerified(true);
          setVerificationLoading(false);
          return;
        }
        
        // Double check admin status by querying the users table directly
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error verifying admin role:', error);
          
          // If we're in development and the error is "No rows found", run auto-diagnose
          if (error.message.includes('No rows found')) {
            console.log('Running auto-diagnosis for missing user record...');
            const result = await diagnoseAuthIssues();
            
            // If diagnosis was successful and created the user with admin role, verify again
            if (result.success && result.dbRole === 'admin') {
              setAdminVerified(true);
            } else {
              setAdminVerified(false);
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
            try {
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
              
            } catch (updateError) {
              console.error('Error updating user metadata:', updateError);
            }
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
    toast.error("Access Denied", {
      description: "You do not have admin privileges for this area."
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
