
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'verified_rep' | 'admin';
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  logo_url?: string;
  type: string; // Changed from specific literals to accept any string to match database
  is_verified: boolean;
  grade?: string;
  last_verified?: string;
  created_at: string;
  reviews?: Review[];
  avg_rating?: number;
}

export interface Review {
  id: string;
  company_id: string;
  user_id: string;
  rating_communication: number;
  rating_install_quality: number;
  rating_payment_reliability: number;
  rating_timeliness: number;
  rating_post_install_support: number;
  text_feedback: string;
  created_at: string;
  user?: User;
  company?: Company;
}

export interface Claim {
  id: string;
  user_id: string;
  company_id: string;
  full_name: string;
  job_title: string;
  company_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user?: User;
  company?: Company;
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
