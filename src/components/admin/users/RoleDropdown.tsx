
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Shield, User, Users } from 'lucide-react';

interface RoleDropdownProps {
  currentRole: 'user' | 'verified_rep' | 'admin';
  userId: string;
  onRoleChange: (userId: string, role: 'user' | 'verified_rep' | 'admin') => Promise<void>;
  disabled?: boolean;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ 
  currentRole, 
  userId, 
  onRoleChange,
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRoleChange = async (role: 'user' | 'verified_rep' | 'admin') => {
    if (role === currentRole) return;
    
    setIsLoading(true);
    try {
      await onRoleChange(userId, role);
    } finally {
      setIsLoading(false);
    }
  };
  
  const roleIcons = {
    user: <User className="mr-2 h-4 w-4" />,
    verified_rep: <Users className="mr-2 h-4 w-4" />,
    admin: <Shield className="mr-2 h-4 w-4" />
  };
  
  const roleLabels = {
    user: 'User',
    verified_rep: 'Verified Rep',
    admin: 'Admin'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled || isLoading}>
        <Button variant="outline" size="sm" className="w-28 justify-between">
          <span className="flex items-center">
            {roleIcons[currentRole]}
            {isLoading ? 'Saving...' : 'Change Role'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleRoleChange('user')} disabled={currentRole === 'user'}>
          <User className="mr-2 h-4 w-4" />
          <span>User</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange('verified_rep')} disabled={currentRole === 'verified_rep'}>
          <Users className="mr-2 h-4 w-4" />
          <span>Verified Rep</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange('admin')} disabled={currentRole === 'admin'}>
          <Shield className="mr-2 h-4 w-4" />
          <span>Admin</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleDropdown;
