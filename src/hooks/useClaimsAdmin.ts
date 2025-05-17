
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Claim } from "@/types";
import { toast } from "sonner";
import { logAdminAction } from "@/utils/adminLogUtils";

export const useClaimsAdmin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch claims with company details
  const { data: claims, isLoading, refetch: refetchClaims } = useQuery({
    queryKey: ["admin", "claims", activeTab],
    queryFn: async () => {
      let query = supabase
        .from("claims")
        .select(`
          id,
          user_id,
          company_id,
          full_name,
          job_title,
          company_email,
          status,
          created_at,
          company:companies(id, name, is_verified)
        `);
      
      // Apply status filter based on active tab
      if (activeTab !== "all") {
        query = query.eq("status", activeTab);
      }
      
      // Order by date (newest first)
      query = query.order("created_at", { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        toast.error("Failed to load claims");
        throw error;
      }
      
      // Separately fetch user details for each claim
      const claimsWithUsers = [];
      
      for (const claim of data || []) {
        try {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, full_name, email, role")
            .eq("id", claim.user_id)
            .single();
          
          if (userError) {
            console.error("Error fetching user for claim:", userError);
            claimsWithUsers.push({
              ...claim,
              user: null
            });
          } else {
            claimsWithUsers.push({
              ...claim,
              user: userData
            });
          }
        } catch (error) {
          console.error("Error processing claim user data:", error);
          claimsWithUsers.push({
            ...claim,
            user: null
          });
        }
      }
      
      return claimsWithUsers as Claim[];
    },
  });
  
  // Filter claims based on search query
  const filteredClaims = claims?.filter(claim => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    return (
      claim.full_name?.toLowerCase().includes(searchTerm) ||
      claim.company_email?.toLowerCase().includes(searchTerm) ||
      claim.job_title?.toLowerCase().includes(searchTerm) ||
      claim.company?.name?.toLowerCase().includes(searchTerm) ||
      claim.user?.full_name?.toLowerCase().includes(searchTerm) ||
      claim.user?.email?.toLowerCase().includes(searchTerm)
    );
  });
  
  // Handle claim action (approve/reject) with proper logging
  const handleClaimAction = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      const claim = claims?.find(c => c.id === claimId);
      if (!claim) {
        toast.error("Claim not found");
        return;
      }
      
      // Get previous status for logging
      const previousStatus = claim.status;
      
      // Update claim status
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      const { error: claimError } = await supabase
        .from("claims")
        .update({ status: newStatus })
        .eq("id", claimId);
      
      if (claimError) {
        toast.error(`Failed to ${action} claim`);
        throw claimError;
      }
      
      // If approving, update company verification status
      if (action === 'approve') {
        // Get previous company verification status for logging
        const { data: companyData } = await supabase
          .from("companies")
          .select("is_verified")
          .eq("id", claim.company_id)
          .single();
        
        const previousCompanyStatus = companyData?.is_verified || false;
        
        // Update company verification status
        const { error: companyError } = await supabase
          .from("companies")
          .update({ is_verified: true })
          .eq("id", claim.company_id);
        
        if (companyError) {
          toast.error("Failed to verify company");
          throw companyError;
        }
        
        // Update user role to verified_rep
        const { error: userError } = await supabase
          .from("users")
          .update({ role: "verified_rep" })
          .eq("id", claim.user_id);
        
        if (userError) {
          toast.error("Failed to update user role");
          throw userError;
        }
        
        // Log company verification action
        await logAdminAction({
          action_type: 'verify_company',
          target_entity: 'company',
          target_id: claim.company_id,
          details: { 
            previous_status: { is_verified: previousCompanyStatus },
            new_status: { is_verified: true },
            related_claim_id: claimId
          }
        });
      }
      
      // Log the claim action
      const actionType = action === 'approve' ? 'approve_claim' : 'reject_claim';
      const logResult = await logAdminAction({
        action_type: actionType,
        target_entity: 'claim',
        target_id: claimId,
        details: { previous_status: previousStatus, new_status: newStatus }
      });
      
      if (logResult.error) {
        console.error(`Error logging claim ${action}:`, logResult.error);
        toast.error(`Claim ${action === 'approve' ? 'approved' : 'rejected'} successfully, but failed to log action`);
      } else {
        toast.success(`Claim ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      }
      
      refetchClaims();
    } catch (error) {
      console.error(`Error ${action}ing claim:`, error);
      toast.error(`An error occurred while ${action}ing the claim`);
    }
  };

  return {
    claims: filteredClaims || [],
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleClaimAction
  };
};

export default useClaimsAdmin;
