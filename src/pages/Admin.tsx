
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewQueueTable from '@/components/admin/ReviewQueueTable';
import ClaimRequestsTable from '@/components/admin/ClaimRequestsTable';
import { toast } from 'sonner';

const Admin = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalReviews: 0,
    pendingReviews: 0,
    totalClaims: 0,
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
          
        // Fetch pending reviews count
        const { count: pendingReviewsCount } = await supabase
          .from('reviews')
          .select('id', { count: 'exact', head: true })
          .eq('verification_status', 'pending');

        // Fetch total claims count
        const { count: claimsCount } = await supabase
          .from('claims')
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
          pendingReviews: pendingReviewsCount || 0,
          totalClaims: claimsCount || 0,
          pendingClaims: pendingClaimsCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard statistics');
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
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Reviews</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalReviews}</p>
          {stats.pendingReviews > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full ml-2">
              {stats.pendingReviews} pending
            </span>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Claims</h3>
          <p className="text-3xl font-bold text-primary">{stats.totalClaims}</p>
          {stats.pendingClaims > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full ml-2">
              {stats.pendingClaims} pending
            </span>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <Tabs defaultValue="claims" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="claims" className="text-base">🏷️ Claim Requests</TabsTrigger>
            <TabsTrigger value="reviews" className="text-base">📝 Review Queue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="claims">
            <ClaimRequestsTable />
          </TabsContent>
          
          <TabsContent value="reviews">
            <ReviewQueueTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
