
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserWithRole } from '@/types/auth';

export const signIn = async (email: string, password: string) => {
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

export const signUp = async (email: string, password: string, fullName: string) => {
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

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    toast.info('Signed out successfully');
  } catch (error: any) {
    toast.error(error.message || 'Error signing out');
    console.error('Error signing out:', error);
  }
};

export const fetchUserData = async (userId: string) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, full_name, avatar_url')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.log('Error fetching user data:', userError);
      return { userData: null, error: userError };
    }
    
    return { userData, error: null };
  } catch (err) {
    console.error('Unexpected error fetching user data:', err);
    return { userData: null, error: err };
  }
};

export const createUserInDatabase = async (
  userId: string, 
  email: string | undefined, 
  fullName: string | undefined, 
  role: string | undefined
) => {
  try {
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email || '',
        full_name: fullName || 'User',
        role: role || 'user'
      });
    
    return { error };
  } catch (err) {
    console.error('Error creating user in database:', err);
    return { error: err };
  }
};

export const updateUserWithRole = (
  user: UserWithRole | null, 
  role: 'user' | 'verified_rep' | 'admin',
  fullName: string,
  avatarUrl?: string
): UserWithRole | null => {
  if (!user) return null;
  
  return {
    ...user,
    user_metadata: {
      ...user.user_metadata,
      role,
      full_name: fullName,
      avatar_url: avatarUrl || user.user_metadata?.avatar_url
    }
  };
};

export const isAdmin = (user: UserWithRole | null): boolean => {
  return user?.user_metadata?.role === 'admin';
};

export const isVerifiedRep = (user: UserWithRole | null): boolean => {
  return user?.user_metadata?.role === 'verified_rep';
};
