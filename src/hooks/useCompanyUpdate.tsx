
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";

const companyFormSchema = z.object({
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

// List of US states for the multiselect dropdown
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" }
];

export const useCompanyUpdate = (company: CompanyData) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo_url || null);
  const [showStatesField, setShowStatesField] = useState(false);
  
  // Check if company type is EPC or Sales Org to determine if states field should be shown
  const isEligibleType = company.type === 'epc' || company.type === 'sales_org';
  
  // Check if the user has a valid claim on this company
  useState(() => {
    const checkClaim = async () => {
      if (!user || !isEligibleType) {
        setShowStatesField(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('claims')
        .select('status')
        .eq('company_id', company.id)
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();
        
      if (data && !error) {
        setShowStatesField(true);
      } else {
        setShowStatesField(false);
      }
    };
    
    checkClaim();
  }, [company.id, company.type, user]);
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || "",
      description: company?.description || "",
      website: company?.website || "",
      type: company?.type || "",
      operating_states: company?.operating_states || [],
    },
  });

  // Define company types
  const companyTypes = [
    { value: "epc", label: "EPC (Engineering, Procurement, Construction)" },
    { value: "sales_org", label: "Sales Organization" },
    { value: "lead_gen", label: "Lead Generation" },
    { value: "software", label: "Software" },
    { value: "other", label: "Other" }
  ];

  // Helper function to format company type for display
  const formatCompanyType = (type: string): string => {
    const foundType = companyTypes.find(t => t.value === type);
    return foundType ? foundType.label : type
      .replace("_", " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    
    // Create preview URL for the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      let logoUrl = company.logo_url;
      
      // Upload new logo if provided
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const filePath = `logos/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: fileData } = await supabase.storage
          .from("company-logos")
          .upload(filePath, logoFile);
          
        if (uploadError) {
          console.error("Logo upload error:", uploadError);
          toast.error("Failed to upload company logo.");
          setIsSubmitting(false);
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from("company-logos")
          .getPublicUrl(filePath);
          
        logoUrl = publicUrl;
      }

      // Prepare update object with conditional operating_states field
      const updateData: any = {
        name: values.name,
        description: values.description,
        website: values.website,
        type: values.type,
        logo_url: logoUrl
      };
      
      // Only include operating_states if the user has permission
      if (showStatesField) {
        updateData.operating_states = values.operating_states;
      }

      const { error } = await supabase
        .from("companies")
        .update(updateData)
        .eq("id", company.id);

      if (error) {
        throw error;
      }

      toast.success("Company profile updated successfully");
      
      // Refresh page to show updated info
      window.location.reload();
    } catch (error) {
      console.error("Error updating company profile:", error);
      toast.error("Failed to update company profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    logoFile,
    logoPreview,
    companyTypes,
    formatCompanyType,
    handleLogoChange,
    onSubmit,
    US_STATES,
    showStatesField
  };
};
