
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface UserProfileProps {
  isLoading: boolean;
}

const UserProfile = ({ isLoading }: UserProfileProps) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-1"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
          <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
          <p className="font-medium">{user?.user_metadata?.full_name || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <p className="font-medium">{user?.email || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
          <p className="font-medium capitalize">{user?.user_metadata?.role || 'User'}</p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link to="/dashboard/profile">Edit Profile</Link>
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
