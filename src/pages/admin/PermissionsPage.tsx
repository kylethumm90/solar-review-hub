
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AdminsTable from "@/components/admin/permissions/AdminsTable";
import VerifiedRepsTable from "@/components/admin/permissions/VerifiedRepsTable";
import { User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { logAdminAction } from "@/utils/adminLogUtils";

const PermissionsPage = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("verified-reps");
  
  // Fetch all users with elevated roles
  const { data: elevatedUsers, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["admin", "users", "elevated"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or("role.eq.admin,role.eq.verified_rep")
        .order("role");

      if (error) {
        toast.error("Failed to load users");
        throw error;
      }

      return data as User[];
    },
  });

  // Fetch claims data for verified reps
  const { data: claimsData, isLoading: claimsLoading, refetch: refetchClaims } = useQuery({
    queryKey: ["admin", "claims", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
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
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load claims");
        throw error;
      }

      return data;
    },
  });

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: 'user' | 'verified_rep' | 'admin') => {
    try {
      // Safety check: prevent removing the last admin
      if (newRole !== 'admin') {
        // Fix: Use .count() to get the count of admin users
        const { count, error: countError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'admin');
          
        if (countError) {
          toast.error("Failed to check admin count");
          throw countError;
        }
          
        if ((count === 1) && elevatedUsers?.find(u => u.id === userId)?.role === 'admin') {
          toast.error("Cannot demote the only admin user");
          return;
        }
      }
      
      // Don't allow users to demote themselves
      if (userId === currentUser?.id) {
        toast.error("You cannot change your own role");
        return;
      }

      // Get the current role for logging
      const { data: userData, error: getUserError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (getUserError) {
        throw getUserError;
      }
      
      const previousRole = userData.role;

      // Update the user role
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        toast.error("Failed to update user role");
        throw error;
      }

      // Log the role change with the appropriate action type
      let actionType: string;
      
      if (newRole === 'admin') {
        actionType = 'promote_user';
      } else if (previousRole === 'admin' && newRole !== 'admin') {
        actionType = 'revoke_admin';
      } else {
        actionType = 'change_user_role';
      }
      
      await logAdminAction({
        action_type: actionType,
        target_entity: 'user',
        target_id: userId,
        details: { previous_role: previousRole, new_role: newRole }
      });

      toast.success(`User role updated to ${newRole}`);
      refetchUsers();
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error("An error occurred while changing the role");
    }
  };

  // Handle removing a verified rep from a company
  const handleRemoveVerifiedRep = async (claimId: string, companyId: string) => {
    try {
      // Get previous status for logging
      const { data: claimData } = await supabase
        .from("claims")
        .select("status")
        .eq("id", claimId)
        .single();
        
      const previousStatus = claimData?.status || 'approved';
      
      // First update the claim status
      const { error: claimError } = await supabase
        .from("claims")
        .update({ status: "revoked" })
        .eq("id", claimId);

      if (claimError) {
        toast.error("Failed to update claim status");
        throw claimError;
      }

      // Then update the company verification status
      const { data: companyData } = await supabase
        .from('companies')
        .select('is_verified, last_verified')
        .eq('id', companyId)
        .single();
        
      const { error: companyError } = await supabase
        .from("companies")
        .update({ is_verified: false })
        .eq("id", companyId);

      if (companyError) {
        toast.error("Failed to update company verification");
        throw companyError;
      }

      // Log the action
      await logAdminAction({
        action_type: 'edit_vendor_metadata', // Using this as the closest match
        target_entity: 'company',
        target_id: companyId,
        details: { 
          previous_status: {
            is_verified: companyData?.is_verified || true,
            last_verified: companyData?.last_verified || null
          }, 
          new_status: {
            is_verified: false,
            last_verified: null
          },
          related_claim_id: claimId,
          claim_status_change: { from: previousStatus, to: 'revoked' }
        }
      });

      toast.success("Verified representative removed successfully");
      refetchClaims();
    } catch (error) {
      console.error("Error removing verified rep:", error);
      toast.error("An error occurred while removing the verified rep");
    }
  };

  // Handle reassigning a company to a different verified rep
  const handleReassignCompany = async (claimId: string, userId: string, companyId: string) => {
    // This would open a modal to select a new rep
    // For now, we'll just show a toast message
    toast.info("Reassignment functionality coming soon");
  };

  const isLoading = usersLoading || claimsLoading;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Permissions Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="verified-reps">Verified Representatives</TabsTrigger>
          <TabsTrigger value="admins">Administrators</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verified-reps" className="space-y-4">
          <div className="bg-muted/20 p-4 rounded-md mb-4">
            <h2 className="font-medium mb-2">About Verified Representatives</h2>
            <p className="text-sm text-muted-foreground">
              Verified representatives can manage their company profile, respond to reviews, and access company analytics.
              When a rep is removed, their company will return to unverified status.
            </p>
          </div>
          
          <VerifiedRepsTable 
            claims={claimsData || []} 
            isLoading={isLoading}
            onRemoveRep={handleRemoveVerifiedRep}
            onReassignCompany={handleReassignCompany}
          />
        </TabsContent>
        
        <TabsContent value="admins" className="space-y-4">
          <div className="bg-muted/20 p-4 rounded-md mb-4">
            <h2 className="font-medium mb-2">About Administrators</h2>
            <p className="text-sm text-muted-foreground">
              Administrators have full access to the platform, including moderation capabilities, 
              user management, and system configuration. Be careful when assigning admin privileges.
            </p>
          </div>
          
          <AdminsTable 
            users={elevatedUsers || []} 
            isLoading={isLoading}
            onRoleChange={handleRoleChange}
            currentUserId={currentUser?.id || ""}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermissionsPage;
