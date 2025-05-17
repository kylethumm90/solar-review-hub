
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfilePage = () => {
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      {user && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || 'User'} />
              <AvatarFallback className="text-2xl bg-primary text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-4 text-center sm:text-left">
              <div>
                <h2 className="text-2xl font-bold">{user.user_metadata?.full_name || 'User'}</h2>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Role</p>
                <p className="text-sm bg-primary/10 text-primary inline-block px-3 py-1 rounded-full capitalize">
                  {user.user_metadata?.role || 'User'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
