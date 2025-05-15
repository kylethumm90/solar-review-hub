
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import { format } from "date-fns";
import RoleDropdown from "@/components/admin/users/RoleDropdown";

interface AdminsTableProps {
  users: User[];
  isLoading: boolean;
  onRoleChange: (userId: string, role: 'user' | 'verified_rep' | 'admin') => Promise<void>;
  currentUserId: string;
}

const AdminsTable = ({ users, isLoading, onRoleChange, currentUserId }: AdminsTableProps) => {
  // Filter for admins and verified reps
  const elevatedUsers = users.filter(user => user.role === 'admin' || user.role === 'verified_rep');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'verified_rep':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {elevatedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No elevated users found
              </TableCell>
            </TableRow>
          ) : (
            elevatedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/40">
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {formatRole(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <RoleDropdown
                    currentRole={user.role as 'user' | 'verified_rep' | 'admin'} 
                    userId={user.id}
                    onRoleChange={onRoleChange}
                    disabled={user.id === currentUserId}
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

export default AdminsTable;
