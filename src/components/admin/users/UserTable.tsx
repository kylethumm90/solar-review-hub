
import { useState } from 'react';
import { User } from '@/types';
import { format } from 'date-fns';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import RoleDropdown from './RoleDropdown';
import { useAuth } from '@/context/AuthContext';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onRoleChange: (userId: string, role: 'user' | 'verified_rep' | 'admin') => Promise<void>;
}

const UserTable: React.FC<UserTableProps> = ({ users, isLoading, onRoleChange }) => {
  const { user: currentUser } = useAuth();
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'verified_rep':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(user.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{user.review_count || 0}</TableCell>
                <TableCell>
                  <RoleDropdown 
                    currentRole={user.role as 'user' | 'verified_rep' | 'admin'}
                    userId={user.id}
                    onRoleChange={onRoleChange}
                    disabled={currentUser?.id === user.id}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
