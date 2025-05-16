
export type ReviewUser = {
  id: string;
  email: string;
  full_name: string;
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
};
