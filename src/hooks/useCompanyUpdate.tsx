
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useLogoUpload } from "./useLogoUpload";
import { useClaimPermission } from "./useClaimPermission";
import { US_STATES } from "@/data/us-states";
import { 
  companyFormSchema, 
  type CompanyFormValues, 
  type CompanyData,
  COMPANY_TYPES,
  formatCompanyType
} from "@/types/company";

export const useCompanyUpdate = (company: CompanyData) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use our custom hooks
  const { logoFile, logoPreview, handleLogoChange } = useLogoUpload(company.logo_url);
  const { showStatesField } = useClaimPermission(company.id, company.type);
  
  // TODO: Re-enable operating_states once we add proper null guards and controlled default values
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || "",
      description: company?.description || "",
      website: company?.website || "",
      type: company?.type || "",
      // operating_states: [], // Removed to avoid any iteration attempts on this field
    },
  });

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
      
      // TODO: Re-enable operating_states once we add proper null guards and controlled default values
      // Only include operating_states if the user has permission
      // if (showStatesField) {
      //   // Ensure operating_states is always an array
      //   updateData.operating_states = values.operating_states || [];
      // }

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
    companyTypes: COMPANY_TYPES,
    formatCompanyType,
    handleLogoChange,
    onSubmit,
    US_STATES,
    showStatesField
  };
};

// Re-export types for backwards compatibility
export type { CompanyFormValues, CompanyData };
