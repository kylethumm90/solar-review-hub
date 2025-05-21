
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Company } from "@/types";
import { CompanyFilter } from "@/components/admin/companies/CompanyFilters";

// Define an interface that matches the actual data returned from Supabase
interface CompanyWithReviewCount extends Omit<Company, 'reviews'> {
  reviews?: { count: number }[];
  review_count?: number;
  status?: string;
}

export function useCompaniesAdmin() {
  const [filters, setFilters] = useState<CompanyFilter>({
    name: "",
    type: null,
    status: null,
    grade: null,
  });
  
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all company types for the filter dropdown
  const companyTypes = ["epc", "sales_org", "lead_gen", "software", "other"];
  const companyStatuses = ["unclaimed", "verified", "certified"];
  const grades = ["A", "B", "C", "D", "F"];

  const { data: companies, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "companies", filters],
    queryFn: async () => {
      // Build the query based on filters
      let query = supabase.from("companies").select(`
        *,
        reviews:reviews(count)
      `);

      // Apply filters
      if (filters.name) {
        query = query.ilike("name", `%${filters.name}%`);
      }
      
      if (filters.type) {
        query = query.eq("type", filters.type);
      }
      
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      
      if (filters.grade) {
        query = query.eq("grade", filters.grade);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Process the data to extract review counts and transform to Company type
      return (data as CompanyWithReviewCount[]).map((company) => {
        let reviewCount = 0;
        if (company.reviews && Array.isArray(company.reviews)) {
          reviewCount = company.reviews.length > 0 ? company.reviews[0].count : 0;
        }

        // Create a proper Company object with the review_count property
        const processedCompany: Company = {
          id: company.id,
          name: company.name,
          description: company.description,
          website: company.website,
          logo_url: company.logo_url,
          type: company.type,
          is_verified: company.is_verified,
          status: company.status,
          grade: company.grade,
          last_verified: company.last_verified,
          created_at: company.created_at,
          review_count: reviewCount,
          reviews: undefined
        };

        return processedCompany;
      });
    },
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const updateObj: any = { 
        status: status,
        last_verified: new Date().toISOString()
      };
      
      // For backward compatibility, also update is_verified
      if (status === 'verified' || status === 'certified') {
        updateObj.is_verified = true;
      } else {
        updateObj.is_verified = false;
      }
      
      const { error } = await supabase
        .from("companies")
        .update(updateObj)
        .eq("id", id);

      if (error) {
        toast.error(`Failed to update status: ${error.message}`);
        throw error;
      }

      toast.success(`Company status updated successfully`);
      refetch();
    } catch (err) {
      console.error("Error updating company status:", err);
    }
  };

  const handleEditClick = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleEditSave = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
    refetch();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return {
    filters,
    setFilters,
    companies,
    isLoading,
    error,
    companyTypes,
    companyStatuses,
    grades,
    editingCompany,
    isModalOpen,
    setIsModalOpen,
    setEditingCompany,
    handleUpdateStatus,
    handleEditClick,
    handleEditSave,
    formatDate
  };
}
