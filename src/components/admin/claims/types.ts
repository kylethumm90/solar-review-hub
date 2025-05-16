
export type ClaimRequest = {
  id: string;
  full_name: string;
  job_title: string;
  company_email: string;
  created_at: string;
  status: string;
  user_id: string;
  company: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
};
