
import { z } from "zod";

// src/types/index.ts

export * from './company';
export * from './auth';
export * from './admin';
export * from './rankings';

export * from './review';
export * from './claim';
export * from './user';
export * from './reviewQuestion';

// Add missing types that aren't properly exported

// Review type if it isn't defined in review.ts
export interface Review {
  id: string;
  company_id: string;
  reviewer_id: string;
  review_title?: string;
  review_details?: string;
  text_feedback?: string;
  average_score?: number;
  status?: string;
  is_anonymous?: boolean;
  install_count?: number;
  created_at: string;
  updated_at?: string;
  company?: Company;
  user?: User;
  verification_status?: string;
  rating_communication?: number;
  rating_install_quality?: number;
  rating_payment_reliability?: number;
  rating_timeliness?: number;
  rating_post_install_support?: number;
  still_active?: string;
  install_states?: string[];
  verified?: boolean;
  attachment_url?: string;
  last_install_date?: string;
  recommend_epc?: string;
}

// Claim type if it isn't defined in claim.ts
export interface Claim {
  id: string;
  company_id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
  company?: Company;
  user?: User;
  full_name?: string;
  job_title?: string;
  company_email?: string;
}

// User type if it isn't defined in user.ts
export interface User {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  review_count?: number;
}

// ReviewQuestion type if it isn't defined in reviewQuestion.ts
export interface ReviewQuestion {
  id: string;
  question_text: string;
  question?: string;
  category: string;
  order?: number;
  weight?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Add Company type if it doesn't exist in other files
export type Company = {
  id: string;
  name: string;
  description: string;
  website?: string;
  logo_url?: string;
  type?: string;
  is_verified?: boolean;
  status?: string;
  grade?: string;
  avg_rating?: number;
  last_verified?: string;
  created_at: string;
  review_count?: number;
  reviews?: Review[] | undefined;
};

// Add ExtendedReview type for the review components
export interface ExtendedReview extends Review {
  company_id: string;
  average_score: number;
  is_anonymous: boolean;
  review_title?: string;
  review_details?: string;
  text_feedback?: string;
  created_at: string;
  company?: Company;
}

// Add missing FilterState and SimpleCompany types
export interface FilterState {
  vendorTypes: string[];
  companyName: string | null;
  reviewDate: string | null;
  states: string[];
  grades: string[];
  stillActive: string | null;
}

export interface SimpleCompany {
  id: string;
  name: string;
  type: string;
  is_verified: boolean;
  logo_url?: string;
}
