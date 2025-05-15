
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import ClaimsTable from "@/components/admin/claims/ClaimsTable";
import { Claim } from "@/types";

const ClaimsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  
  // Fetch claims with company and user details
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
          user:users(id, full_name, email),
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
      
      return data as Claim[];
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
      claim.company?.name?.toLowerCase().includes(searchTerm)
    );
  });
  
  // Handle claim action (approve/reject)
  const handleClaimAction = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      const claim = claims?.find(c => c.id === claimId);
      if (!claim) {
        toast.error("Claim not found");
        return;
      }
      
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
      }
      
      toast.success(`Claim ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      refetchClaims();
    } catch (error) {
      console.error(`Error ${action}ing claim:`, error);
      toast.error(`An error occurred while ${action}ing the claim`);
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Company Claims Management</h1>
      </div>
      
      <div className="bg-muted/20 p-4 rounded-md mb-4">
        <h2 className="font-medium mb-2">About Company Claims</h2>
        <p className="text-sm text-muted-foreground">
          Claims are submitted by users who want to represent their company on the platform. 
          Approved users become verified representatives and can manage their company profile and respond to reviews.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search claims..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          <ClaimsTable 
            claims={filteredClaims || []} 
            isLoading={isLoading}
            onApprove={(claimId) => handleClaimAction(claimId, 'approve')}
            onReject={(claimId) => handleClaimAction(claimId, 'reject')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClaimsPage;
