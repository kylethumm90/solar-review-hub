
import * as z from 'zod';

export function formatCompanyType(type: string | null): string {
  if (!type) return "Not specified";
  return type
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  type?: string;
  operating_states?: string[];
  is_verified?: boolean;
  last_verified?: string;
}

// Company form schema
export const companyFormSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  website: z.string().url("Please enter a valid URL").or(z.literal("")),
  type: z.string().min(1, "Company type is required"),
  operating_states: z.array(z.string()).optional(),
  logo_url: z.string().optional(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export interface CompanyData {
  id: string;
  name: string;
  description: string;
  website: string | null;
  type: string;
  operating_states: string[] | null;
  logo_url: string | null;
  is_verified: boolean;
  last_verified: string | null;
}

export const COMPANY_TYPES = [
  { value: "epc", label: "EPC (Engineering, Procurement, Construction)" },
  { value: "installer", label: "Installer" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "distributor", label: "Distributor" },
  { value: "sales_org", label: "Sales Organization" },
  { value: "lead_gen", label: "Lead Generation" },
  { value: "financing", label: "Financing Provider" },
  { value: "energy_storage", label: "Energy Storage" },
  { value: "software", label: "Software Provider" },
  { value: "consultant", label: "Consultant" },
  { value: "other", label: "Other" },
];
