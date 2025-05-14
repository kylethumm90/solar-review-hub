
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalReviews: 0,
    pendingClaims: 0
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch users count
        const { count: usersCount } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true });

        // Fetch companies count
        const { count: companiesCount } = await supabase
          .from('companies')
          .select('id', { count: 'exact', head: true });

        // Fetch reviews count
        const { count: reviewsCount } = await supabase
          .from('reviews')
          .select('id', { count: 'exact', head: true });

        // Fetch pending claims count
        const { count: pendingClaimsCount } = await supabase
          .from('claims')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending');

        setStats({
          totalUsers: usersCount || 0,
          totalCompanies: companiesCount || 0,
          totalReviews: reviewsCount || 0,
          pendingClaims: pendingClaimsCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.user_metadata?.full_name}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          You are logged in as an administrator. From here, you can manage all aspects of the SolarGrade platform.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Users</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Companies</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalCompanies}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Reviews</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalReviews}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Pending Claims</h3>
          <p className="text-3xl font-bold text-primary">{stats.pendingClaims}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-medium mb-4">Recent Activity</h3>
          <p className="text-gray-600 dark:text-gray-400">No recent activity to display.</p>
          {/* Here you would map over recent activity data */}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-medium mb-4">System Status</h3>
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-700 dark:text-gray-200">Database: Operational</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-700 dark:text-gray-200">Authentication: Operational</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-700 dark:text-gray-200">Storage: Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
