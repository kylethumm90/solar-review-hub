
export interface RankedCompany {
  id: string;
  name: string;
  type: string;
  status: string;
  average_grade: string;
  grade?: string;
  solargrade_score?: number;
  review_count: number;
  install_count?: number;
  last_verified?: string;
  rank_change?: number | null;
  is_new?: boolean;
  logo_url?: string;
}

export interface RankingsFilter {
  vendorType: string;
  gradeThreshold: string;
  // region?: string; // For future use with operating_states
}
