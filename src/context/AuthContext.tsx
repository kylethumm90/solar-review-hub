
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserWithRole } from '@/types/user';

interface AuthContextType {
  user: UserWithRole | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: async () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock sign out function for now
  const signOut = async () => {
    setUser(null);
  };

  // Simulate auth loading
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const value = {
    user,
    signOut,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
