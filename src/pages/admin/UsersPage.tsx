import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserTable from '@/components/admin/users/UserTable';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { logAdminAction } from '@/utils/adminLogUtils';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Modified query to count reviews differently to avoid schema cache issues
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');
        
      if (usersError) {
        throw new Error(usersError.message);
      }
      
      // Fetch review counts separately for each user
      const enhancedUsers = await Promise.all(
        usersData.map(async (user) => {
          const { count, error: countError } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
            
          return {
            ...user,
            review_count: countError ? 0 : (count || 0)
          } as User;
        })
      );
      
      return enhancedUsers;
    }
  });

  const filteredUsers = users?.filter(user => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.full_name.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower)
    );
  });

  const handleRoleChange = async (userId: string, newRole: 'user' | 'verified_rep' | 'admin') => {
    try {
      // Get the current role for logging
      const { data: userData, error: getUserError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (getUserError) {
        throw getUserError;
      }
      
      const previousRole = userData.role;
      
      // Update the role
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      // Log the role change with the appropriate action type
      let actionType: string;
      
      if (newRole === 'admin') {
        actionType = 'promote_user';
      } else if (previousRole === 'admin') {
        actionType = 'revoke_admin';
      } else {
        actionType = 'change_user_role';
      }
      
      await logAdminAction({
        action_type: actionType,
        target_entity: 'user',
        target_id: userId,
        details: { previous_role: previousRole, new_role: newRole }
      });
      
      toast.success(`User role updated successfully to ${newRole}`);
      refetch();
    } catch (err: any) {
      toast.error(`Failed to update role: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading users: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <UserTable 
        users={filteredUsers || []} 
        isLoading={isLoading} 
        onRoleChange={handleRoleChange} 
      />
    </div>
  );
};

export default UsersPage;
