
import { z } from "zod";

// Company form validation schema
export const companyFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  type: z.string().min(1, "Company type is required"),
  // TODO: Re-enable operating_states once we add proper null guards and controlled default values
  // operating_states: z.array(z.string()).optional(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export type CompanyData = {
  id: string;
  name: string;
  description?: string;
  website?: string;
  type?: string;
  logo_url?: string;
  // TODO: Re-enable operating_states once we add proper null guards and controlled default values
  operating_states?: string[];
  status?: string;
  is_verified?: boolean; // Keeping for backward compatibility
  last_verified?: string;
};

// Define the company status options
export const COMPANY_STATUS = {
  UNCLAIMED: 'unclaimed',
  VERIFIED: 'verified', 
  CERTIFIED: 'certified'
};

// Company type options for the dropdown
export const COMPANY_TYPES = [
  { value: "epc", label: "EPC (Engineering, Procurement, Construction)" },
  { value: "sales_org", label: "Sales Organization" },
  { value: "lead_gen", label: "Lead Generation" },
  { value: "software", label: "Software" },
  { value: "other", label: "Other" }
];

// Helper function to format company type for display
export const formatCompanyType = (type: string): string => {
  const foundType = COMPANY_TYPES.find(t => t.value === type);
  return foundType ? foundType.label : type
    .replace("_", " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function to check if company is verified or certified
export const isVerifiedOrCertified = (status?: string): boolean => {
  return status === COMPANY_STATUS.VERIFIED || status === COMPANY_STATUS.CERTIFIED;
};

// Helper function to check if company is certified
export const isCertified = (status?: string): boolean => {
  return status === COMPANY_STATUS.CERTIFIED;
};

// Get status display name for UI
export const getStatusDisplayName = (status?: string): string => {
  switch (status) {
    case COMPANY_STATUS.VERIFIED:
      return "Verified Company";
    case COMPANY_STATUS.CERTIFIED:
      return "SolarGrade Certified";
    default:
      return "";
  }
};
