
import { Review, Company, SimpleCompany } from '@/types';

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

export interface ReviewFilter {
  search?: string;
  vendor?: string;
  grade?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  type?: string;
}

// Re-export these types for components that import from here
export type { FilterState, SimpleCompany };

export interface FilterState {
  vendorTypes: string[];
  companyName: string | null;
  reviewDate: string | null;
  states: string[];
  grades: string[];
  stillActive: string | null;
}
