
import { useAuth } from '@/context/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import ActivitySummary from '@/components/dashboard/ActivitySummary';
import RecentReviews from '@/components/dashboard/RecentReviews';
import UserProfile from '@/components/dashboard/UserProfile';
import ClaimRequests from '@/components/dashboard/ClaimRequests';

const Dashboard = () => {
  const { user } = useAuth();
  const { reviews, claims, isLoading } = useDashboardData();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Welcome back, {user?.user_metadata?.full_name || 'User'}
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your data...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Summary and Recent Reviews Column */}
          <div className="lg:col-span-2 space-y-6">
            <ActivitySummary 
              reviews={reviews as any[]} 
              claims={claims as any[]}
              isLoading={false}
            />
            <RecentReviews 
              reviews={reviews as any[]}
              isLoading={false}
            />
          </div>
          
          {/* Sidebar Column */}
          <div className="space-y-6">
            <UserProfile isLoading={false} />
            <ClaimRequests 
              claims={claims as any[]}
              isLoading={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
