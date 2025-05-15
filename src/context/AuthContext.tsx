
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    let isMounted = true;

    async function getSession() {
      setIsLoading(true);
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        // Set the session and user
        if (isMounted) {
          setSession(session);
          setUser(session.user as UserWithRole);
        }
        
        // Get additional user data from database if needed
        if (isMounted && session?.user?.id) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role, full_name')
              .eq('id', session.user.id)
              .single();

            if (userError) {
              // If there's an error fetching user data but we have a session,
              // don't log the user out - they may just need to be inserted into the users table
              console.log('Error fetching user data:', userError);
              
              // If the error is "No rows found", the user may exist in auth but not in the users table
              if (userError.message.includes('No rows found') && isMounted) {
                // Try to create the user in the users table
                const { error: insertError } = await supabase
                  .from('users')
                  .insert({
                    id: session.user.id,
                    email: session.user.email,
                    full_name: session.user.user_metadata?.full_name || 'User',
                    role: 'user'
                  });
                  
                if (!insertError && isMounted) {
                  // User inserted successfully, now fetch the data again
                  const { data: newUserData } = await supabase
                    .from('users')
                    .select('role, full_name')
                    .eq('id', session.user.id)
                    .single();
                    
                  if (newUserData && isMounted) {
                    // Update user with role information
                    setUser(prevUser => {
                      if (!prevUser) return null;
                      return {
                        ...prevUser,
                        user_metadata: {
                          ...prevUser.user_metadata,
                          role: newUserData.role,
                          full_name: newUserData.full_name
                        }
                      };
                    });
                  }
                }
              }
            } else if (userData && isMounted) {
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
          } catch (err) {
            console.error('Unexpected error fetching user data:', err);
          }
        }
      } catch (err) {
        console.error('Unexpected error in getSession:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (isMounted) {
          setSession(newSession);
          setUser(newSession?.user as UserWithRole || null);
        }
        
        if (newSession?.user && isMounted) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            if (!isMounted) return;
            
            try {
              // Fetch user data
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('role, full_name')
                .eq('id', newSession.user.id)
                .single();
              
              if (userError && isMounted) {
                console.log('Error fetching user data on auth change:', userError);
                
                // Handle missing user in users table
                if (userError.message.includes('No rows found')) {
                  const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                      id: newSession.user.id,
                      email: newSession.user.email,
                      full_name: newSession.user.user_metadata?.full_name || 'User',
                      role: 'user'
                    });
                    
                  if (insertError) {
                    console.error('Error creating user in users table:', insertError);
                  }
                }
              } else if (userData && isMounted) {
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
            } catch (err) {
              console.error('Unexpected error in onAuthStateChange:', err);
            }
          }, 0);
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success('Signed in successfully!');
      }
      
      return response;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign in');
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
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

      if (response.error) {
        toast.error(response.error.message);
        return response;
      }
      
      toast.success('Account created successfully!');
      return response;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.info('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Error signing out:', error);
    }
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
