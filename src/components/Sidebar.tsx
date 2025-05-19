
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Star, Briefcase, Building } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useHasApprovedClaim } from '@/hooks/useHasApprovedClaim';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { hasApprovedClaim, loading } = useHasApprovedClaim();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home
    },
    {
      name: "My Profile",
      href: "/dashboard/profile",
      icon: User
    },
    {
      name: "My Reviews",
      href: "/dashboard/reviews",
      icon: Star
    },
    {
      name: "My Claims",
      href: "/dashboard/claims",
      icon: Briefcase
    }
  ];
  
  // Add company management for users with approved claims or admin users
  if (hasApprovedClaim || user?.user_metadata?.role === 'admin') {
    navItems.push({
      name: "My Company",
      href: "/dashboard/my-company", // Fixed the route
      icon: Building
    });
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
      <div className="p-4">
        <div className="text-center p-4 mb-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {user?.user_metadata?.full_name || 'Dashboard'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
