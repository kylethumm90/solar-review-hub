
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';

const AdminLayout = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect if not authenticated or not admin
  if (!user || !isAdmin()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
