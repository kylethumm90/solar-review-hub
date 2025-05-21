
import { Review, Company } from '@/types';

// Extended review type that includes joined data
export interface ExtendedReview extends Review {
  company?: Company | any; // Handle simplified company structure from joined query
  install_count?: number;
  install_states?: string[];
  still_active?: string;
  is_anonymous?: boolean;
}

// Filter state type
export type FilterState = {
  vendorTypes: string[];
  companyName: string | null;
  reviewDate: string | null;
  states: string[];
  grades: string[];
  stillActive: string | null;
};

// Define a simplified company type for the dropdown
export type SimpleCompany = {
  id: string;
  name: string;
  type: string;
  is_verified: boolean;
  logo_url?: string;
};
