import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyTypes, getCompanyTypeLabel } from "@/constants/companyTypes";

const companyFormSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  type: z.string().min(1, "Company type is required"),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export type CompanyData = {
  id: string;
  name: string;
  description?: string;
  website?: string;
  type?: string;
  logo_url?: string;
};

export const useCompanyUpdate = (company: CompanyData) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo_url || null);
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || "",
      description: company?.description || "",
      website: company?.website || "",
      type: company?.type || "",
    },
  });

  // Helper function to format company type for display
  const formatCompanyType = (type: string): string => {
    return getCompanyTypeLabel(type);
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

      const { error } = await supabase
        .from("companies")
        .update({
          name: values.name,
          description: values.description,
          website: values.website,
          type: values.type,
          logo_url: logoUrl
        })
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
    onSubmit
  };
};
