
import { z } from "zod";

// Importing and re-exporting specific type files
export * from './company';
export * from './auth';
export * from './admin';
export * from './rankings';

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
  last_verified?: string;
  created_at: string;
  review_count?: number;
  reviews?: any[] | undefined;
};
