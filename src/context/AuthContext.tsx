
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabaseClient';

// Define the user type with role
export type UserWithRole = User & {
  user_metadata: {
    role?: 'user' | 'verified_rep' | 'admin';
    full_name?: string;
  };
};

type AuthContextType = {
  user: UserWithRole | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isVerifiedRep: () => boolean;
  setUser: React.Dispatch<React.SetStateAction<UserWithRole | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!error && session) {
        setSession(session);
        setUser(session.user as UserWithRole);
        
        // Get additional user data from database if needed
        const { data: userData } = await supabase
          .from('users')
          .select('role, full_name')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          // Update user with role information
          setUser(prevUser => {
            if (!prevUser) return null;
            return {
              ...prevUser,
              user_metadata: {
                ...prevUser.user_metadata,
                role: userData.role,
                full_name: userData.full_name
              }
            };
          });
        }
      }

      setIsLoading(false);
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user as UserWithRole || null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({ email, password });
    return response;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user' // Default role
        }
      }
    });

    // If sign up successful, add user to users table
    if (response.data.user) {
      await supabase.from('users').insert([
        {
          id: response.data.user.id,
          email: email,
          full_name: fullName,
          role: 'user'
        }
      ]);
    }

    return response;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = () => {
    return user?.user_metadata?.role === 'admin';
  };

  const isVerifiedRep = () => {
    return user?.user_metadata?.role === 'verified_rep';
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isVerifiedRep,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
