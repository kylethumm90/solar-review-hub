
import React, { useState } from "react";
import { useClaimsAdmin } from "@/hooks/useClaimsAdmin";
import ClaimsContent from "@/components/admin/claims/ClaimsContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bug, RefreshCw } from "lucide-react";

const ClaimsPage = () => {
  const {
    claims,
    rawClaimsData,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleClaimAction,
    debugMode,
    setDebugMode,
    refetchAllClaims
  } = useClaimsAdmin();

  const [showRawData, setShowRawData] = useState(false);
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Claims Management</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDebugMode(!debugMode)}
            className={debugMode ? "border-red-500 text-red-500" : ""}
          >
            <Bug className="h-4 w-4 mr-1" />
            {debugMode ? "Disable" : "Enable"} Debug Mode
            {debugMode && <Badge className="ml-2 bg-red-500">ON</Badge>}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchAllClaims();
              setShowRawData(!showRawData);
            }}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            {showRawData ? "Hide" : "Show"} Raw Data
          </Button>
        </div>
      </div>
      
      {debugMode && (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border">
          <h3 className="text-md font-semibold mb-2">Debug Information</h3>
          <div className="text-xs space-y-2">
            <p><strong>Active Tab:</strong> {activeTab}</p>
            <p><strong>Search Query:</strong> "{searchQuery || 'none'}"</p>
            <p><strong>Filtered Claims:</strong> {claims?.length || 0}</p>
            <p><strong>Total Claims:</strong> {rawClaimsData?.length || 0}</p>
            <p><strong>Auto-refresh:</strong> {debugMode ? 'Enabled (5s)' : 'Disabled'}</p>
          </div>
        </div>
      )}
      
      {showRawData && rawClaimsData && (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border overflow-auto max-h-60">
          <h3 className="text-md font-semibold mb-2">Raw Database Claims</h3>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(rawClaimsData, null, 2)}
          </pre>
        </div>
      )}
      
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
