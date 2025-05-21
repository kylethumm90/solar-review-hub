
import { Review, Company, FilterState, SimpleCompany } from '@/types';

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
export { FilterState, SimpleCompany };
