
import { z } from "zod";

// Company form validation schema
export const companyFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  type: z.string().min(1, "Company type is required"),
  operating_states: z.array(z.string()).optional(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export type CompanyData = {
  id: string;
  name: string;
  description?: string;
  website?: string;
  type?: string;
  logo_url?: string;
  operating_states?: string[];
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
