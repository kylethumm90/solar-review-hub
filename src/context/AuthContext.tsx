
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserWithRole } from '@/types/user';
import { signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from '@/services/AuthService';

interface AuthContextType {
  user: UserWithRole | null;
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null; data: any | null }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserWithRole | null>>;
  isAdmin: () => boolean;
  isVerifiedRep: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  isLoading: true,
  setUser: () => {},
  isAdmin: () => false,
  isVerifiedRep: () => false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth functions
  const signIn = async (email: string, password: string) => {
    return await authSignIn(email, password);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    return await authSignUp(email, password, fullName);
  };

  // Sign out function
  const signOut = async () => {
    await authSignOut();
    setUser(null);
  };

  // Role check functions
  const isAdmin = (): boolean => {
    return user?.role === 'admin' || user?.user_metadata?.role === 'admin';
  };

  const isVerifiedRep = (): boolean => {
    return user?.role === 'verified_rep' || user?.user_metadata?.role === 'verified_rep';
  };

  // Simulate auth loading
  useEffect(() => {
    // Mock user for development
    setUser({
      id: 'mock-user-id',
      email: 'user@example.com',
      full_name: 'Test User',
      role: 'user',
      user_metadata: {
        role: 'user',
        full_name: 'Test User'
      }
    });
    setIsLoading(false);
  }, []);

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    isLoading,
    setUser,
    isAdmin,
    isVerifiedRep,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
