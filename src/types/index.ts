
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'verified_rep' | 'admin';
  created_at: string;
  review_count?: number;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  logo_url?: string;
  type: string;
  is_verified: boolean;
  status?: string;
  grade?: string;
  last_verified?: string;
  created_at: string;
  reviews?: Review[];
  avg_rating?: number;
  review_count?: number;
}

export interface ReviewQuestion {
  id: string;
  company_type: string;
  category: string;
  question: string;
  weight: number;
  created_at: string;
}

export interface ReviewAnswer {
  id?: string;
  review_id: string;
  question_id: string;
  rating: number;
  notes?: string;
  created_at?: string;
  review_questions?: ReviewQuestion;
}

export interface Review {
  id: string;
  company_id: string;
  user_id: string;
  rating_communication?: number;
  rating_install_quality?: number;
  rating_payment_reliability?: number;
  rating_timeliness?: number;
  rating_post_install_support?: number;
  text_feedback: string;
  review_title?: string;
  review_details?: string;
  average_score?: number;
  verification_status?: string;
  created_at: string;
  user?: User;
  company?: Company;
  review_answers?: ReviewAnswer[];
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
