
import { z } from "zod";

export * from './company';
export * from './auth';
export * from './admin';
export * from './rankings';

// Define all necessary types directly in this file to avoid missing module errors

// Review type
export interface Review {
  id: string;
  company_id: string;
  user_id: string;
  reviewer_id: string; // Make this required to fix type errors
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

// Claim type
export interface Claim {
  id: string;
  company_id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
  company?: Company;
  user?: User;
  full_name?: string; // Add missing properties that are used in components
  job_title?: string;
  company_email?: string;
}

// User type
export interface User {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  review_count?: number; // Add this property that was missing
}

// ReviewQuestion type
export interface ReviewQuestion {
  id: string;
  question_text: string; // Required property
  question?: string;     // Also keep the question property for backward compatibility
  category: string;
  order?: number;
  weight?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Company type
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

// ExtendedReview type
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

// FilterState
export interface FilterState {
  vendorTypes: string[];
  companyName: string | null;
  reviewDate: string | null;
  states: string[];
  grades: string[];
  stillActive: string | null;
}

// SimpleCompany
export interface SimpleCompany {
  id: string;
  name: string;
  type: string;
  is_verified: boolean;
  logo_url?: string;
}
