
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfileProps {
  isLoading: boolean;
}

const UserProfile = ({ isLoading }: UserProfileProps) => {
  const { user } = useAuth();

  // Get user initials for the avatar fallback
  const getInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    return user.user_metadata.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || 'User'} />
          <AvatarFallback className="text-xl bg-primary text-white">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">Your Profile</h2>
        </div>
      </div>
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
