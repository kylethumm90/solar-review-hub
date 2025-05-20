
export interface UserWithRole {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
  created_at?: string;
  user_metadata?: {
    role?: string;
    full_name?: string;
    avatar_url?: string;
  };
}
