
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Failed to sign out");
    }
  };
  
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="font-bold text-xl">
            SolarGrade
          </Link>
          
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <NavLink to="/" className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-foreground/80 ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`
            }>Home</NavLink>
            <NavLink to="/vendors" className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-foreground/80 ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`
            }>Vendors</NavLink>
            <NavLink to="/rankings" className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-foreground/80 ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`
            }>Rankings</NavLink>
            {user?.user_metadata?.role === 'admin' && (
              <NavLink to="/admin/dashboard" className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-foreground/80 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`
              }>Admin</NavLink>
            )}
          </nav>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.user_metadata?.full_name || 'User'} />
                    <AvatarFallback>{(user.user_metadata?.full_name || 'User').slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
