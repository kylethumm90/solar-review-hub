
import { User, Session } from '@supabase/supabase-js';

// Define the user type with role
export type UserWithRole = User & {
  user_metadata: {
    role?: 'user' | 'verified_rep' | 'admin';
    full_name?: string;
  };
};

export type AuthContextType = {
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
