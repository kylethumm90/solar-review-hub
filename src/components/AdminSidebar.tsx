
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Building, Bell, Settings, Shield, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Home
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users
    },
    {
      name: "Companies",
      href: "/admin/companies",
      icon: Building
    },
    {
      name: "Claims",
      href: "/admin/claims",
      icon: Bell
    },
    {
      name: "Reviews",
      href: "/admin/reviews",
      icon: FileText
    },
    {
      name: "Logs",
      href: "/admin/logs",
      icon: Clock
    },
    {
      name: "Permissions",
      href: "/admin/permissions",
      icon: Shield
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings
    }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white hidden md:block">
      <div className="p-4">
        <div className="mb-8 px-4 pt-2">
          <h3 className="text-xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            Admin Console
          </h3>
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
                        ? "bg-primary/20 text-primary"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
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

export default AdminSidebar;
