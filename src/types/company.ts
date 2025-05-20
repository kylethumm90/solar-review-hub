
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
