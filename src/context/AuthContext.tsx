
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserWithRole, AuthContextType } from '@/types/auth';
import { 
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  fetchUserData,
  createUserInDatabase,
  updateUserWithRole,
  isAdmin as checkIsAdmin,
  isVerifiedRep as checkIsVerifiedRep,
  signInWithGoogle as authSignInWithGoogle
} from '@/services/AuthService';

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
            const { userData, error: userError } = await fetchUserData(session.user.id);

            if (userError) {
              // If there's an error fetching user data but we have a session,
              // don't log the user out - they may just need to be inserted into the users table
              
              // If the error is "No rows found", the user may exist in auth but not in the users table
              if (userError.message.includes('No rows found') && isMounted) {
                // Try to create the user in the users table
                const { error: insertError } = await createUserInDatabase(
                  session.user.id,
                  session.user.email,
                  session.user.user_metadata?.full_name,
                  session.user.user_metadata?.role
                );
                  
                if (!insertError && isMounted) {
                  // User inserted successfully, now fetch the data again
                  const { userData: newUserData } = await fetchUserData(session.user.id);
                    
                  if (newUserData && isMounted) {
                    // Update user with role information
                    setUser(prevUser => updateUserWithRole(
                      prevUser,
                      newUserData.role as 'user' | 'verified_rep' | 'admin',
                      newUserData.full_name,
                      newUserData.avatar_url
                    ));
                  }
                }
              }
            } else if (userData && isMounted) {
              // Prioritize role from database over metadata
              setUser(prevUser => updateUserWithRole(
                prevUser,
                userData.role as 'user' | 'verified_rep' | 'admin',
                userData.full_name,
                userData.avatar_url
              ));
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
              const { userData, error: userError } = await fetchUserData(newSession.user.id);
              
              if (userError && isMounted) {
                console.log('Error fetching user data on auth change:', userError);
                
                // Handle missing user in users table
                if (userError.message.includes('No rows found')) {
                  await createUserInDatabase(
                    newSession.user.id,
                    newSession.user.email,
                    newSession.user.user_metadata?.full_name,
                    newSession.user.user_metadata?.role
                  );
                }
              } else if (userData && isMounted) {
                // Always prioritize the database role over metadata
                setUser(prevUser => updateUserWithRole(
                  prevUser,
                  userData.role as 'user' | 'verified_rep' | 'admin',
                  userData.full_name,
                  userData.avatar_url
                ));
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

  const signIn = authSignIn;
  const signUp = authSignUp;
  const signOut = authSignOut;
  const signInWithGoogle = authSignInWithGoogle;
  
  const isAdmin = () => checkIsAdmin(user);
  const isVerifiedRep = () => checkIsVerifiedRep(user);

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
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
