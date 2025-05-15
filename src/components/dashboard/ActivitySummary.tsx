
import { Star, Building, Calendar } from 'lucide-react';
import { Review, Claim } from '@/types';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface ActivitySummaryProps {
  reviews: Review[];
  claims: Claim[];
  isLoading: boolean;
}

const ActivitySummary = ({ reviews, claims, isLoading }: ActivitySummaryProps) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="animate-pulse space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-7 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Star className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Reviews</h3>
          </div>
          <p className="text-2xl font-bold">{reviews.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {reviews.length === 1 ? 'Review' : 'Reviews'} submitted
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Building className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Claims</h3>
          </div>
          <p className="text-2xl font-bold">{claims.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {claims.length === 1 ? 'Claim' : 'Claims'} submitted
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Member Since</h3>
          </div>
          <p className="text-lg font-medium">
            {user?.created_at ? formatDate(user.created_at) : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivitySummary;
