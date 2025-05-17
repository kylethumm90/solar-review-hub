
import React from "react";
import { useClaimsAdmin } from "@/hooks/useClaimsAdmin";
import ClaimsContent from "@/components/admin/claims/ClaimsContent";

const ClaimsPage = () => {
  const {
    claims,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleClaimAction
  } = useClaimsAdmin();
  
  return (
    <div className="p-6 space-y-6">
      <ClaimsContent 
        claims={claims}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onApprove={(claimId) => handleClaimAction(claimId, 'approve')}
        onReject={(claimId) => handleClaimAction(claimId, 'reject')}
      />
    </div>
  );
};

export default ClaimsPage;
