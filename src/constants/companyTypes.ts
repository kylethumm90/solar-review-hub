
export interface CompanyTypeOption {
  value: string;
  label: string;
}

export const companyTypes: CompanyTypeOption[] = [
  { value: "epc", label: "EPC (Engineering, Procurement, Construction)" },
  { value: "sales_org", label: "Sales Organization" },
  { value: "lead_gen", label: "Lead Generation" },
  { value: "software", label: "Software Provider" },
  { value: "other", label: "Other" }
];

export const getCompanyTypeLabel = (value: string): string => {
  const type = companyTypes.find(t => t.value === value);
  return type ? type.label : value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
