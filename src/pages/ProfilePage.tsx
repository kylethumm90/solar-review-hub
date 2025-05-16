
import React from 'react';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      {user && (
        <div className="bg-white rounded-lg shadow p-6">
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
