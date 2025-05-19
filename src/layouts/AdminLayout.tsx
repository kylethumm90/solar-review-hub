
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
        
        // Double check admin status by querying the users table directly
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error verifying admin role:', error);
          
          // If the error is "No rows found", create the user record with appropriate role
          if (error.message.includes('No rows found')) {
            console.log('Synchronizing user record to database...');
            
            const { error: upsertError } = await supabase
              .from('users')
              .upsert({
                id: user.id,
                email: user.email,
                role: isAdminInMetadata ? 'admin' : 'user',
                full_name: user.user_metadata?.full_name || 'User'
              });
              
            if (upsertError) {
              console.error('Error creating user record:', upsertError);
              setAdminVerified(false);
            } else {
              // If we successfully created the record with admin role, verify
              setAdminVerified(isAdminInMetadata);
              
              // Run auto-diagnose if we're creating a new record
              const result = await diagnoseAuthIssues();
              console.log('Auto-diagnosis result:', result);
            }
          } else {
            setAdminVerified(false);
          }
        } else {
          // Verify if the user has admin role in the database
          const isAdminInDb = data?.role === 'admin';
          
          // Only grant access if BOTH metadata and database show admin role
          // This ensures RLS policies work correctly
          const isFullAdmin = isAdminInMetadata && isAdminInDb;
          setAdminVerified(isFullAdmin);
          
          // If there's a mismatch, synchronize the roles
          if (isAdminInMetadata !== isAdminInDb) {
            console.log('Role mismatch detected between metadata and database');
            
            if (isAdminInMetadata && !isAdminInDb) {
              // Update database to match metadata
              await supabase
                .from('users')
                .update({ role: 'admin' })
                .eq('id', user.id);
                
              console.log('Updated database role to admin to match metadata');
              setAdminVerified(true);
            } else if (!isAdminInMetadata && isAdminInDb) {
              // Update metadata to match database
              try {
                await supabase.auth.updateUser({
                  data: { role: 'admin' }
                });
                
                // Update the user in the local state
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
                
                console.log('Updated metadata role to admin to match database');
                setAdminVerified(true);
                
                // Refresh the session to ensure role persistence
                await supabase.auth.refreshSession();
                
              } catch (updateError) {
                console.error('Error updating user metadata:', updateError);
              }
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
