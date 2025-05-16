
export type ReviewUser = {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'verified_rep' | 'admin';
  created_at: string;
};

export type ReviewCompany = {
  name: string;
};

export type Review = {
  id: string;
  review_title: string | null;
  average_score: number | null;
  verification_status: string | null;
  created_at: string;
  user_id: string;
  company_id: string;
  user?: ReviewUser;
  company?: ReviewCompany;
  // Rating fields from main Review type (non-optional to match index.ts)
  rating_communication: number;
  rating_install_quality: number;
  rating_payment_reliability: number;
  rating_timeliness: number;
  rating_post_install_support: number;
  // Other fields can remain optional
  review_details?: string | null;
  text_feedback: string;
};
