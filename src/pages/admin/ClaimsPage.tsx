
import React, { useState, useEffect } from "react";
import { useClaimsAdmin } from "@/hooks/useClaimsAdmin";
import ClaimsContent from "@/components/admin/claims/ClaimsContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bug, RefreshCw, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  
  // Auto-refresh data when debug mode is enabled
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    
    if (debugMode) {
      // Refresh data every 10 seconds when in debug mode
      intervalId = setInterval(() => {
        refetchAllClaims();
      }, 10000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [debugMode, refetchAllClaims]);
  
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
      
      {/* Data Issues Alert */}
      {rawClaimsData && claims && rawClaimsData.length !== claims.length && (
        <Alert variant="warning" className="bg-amber-50 border-amber-300">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <span className="font-semibold">Filtered Data Notice:</span> Showing {claims.length} 
            claims after filtering, but {rawClaimsData.length} claims exist in the database. 
            {activeTab !== 'all' && ' Try changing the tab filter to "All" to see more claims.'}
            {searchQuery && ' Your search filter is also active, which may hide some claims.'}
          </AlertDescription>
        </Alert>
      )}
      
      {debugMode && (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border">
          <h3 className="text-md font-semibold mb-2">Debug Information</h3>
          <div className="text-xs space-y-2">
            <p><strong>Active Tab:</strong> {activeTab}</p>
            <p><strong>Search Query:</strong> "{searchQuery || 'none'}"</p>
            <p><strong>Filtered Claims:</strong> {claims?.length || 0}</p>
            <p><strong>Total Claims:</strong> {rawClaimsData?.length || 0}</p>
            <p><strong>Auto-refresh:</strong> {debugMode ? 'Enabled (10s)' : 'Disabled'}</p>
            <p><strong>Current Status:</strong> {isLoading ? 'Loading...' : 'Ready'}</p>
            <p><strong>Pending Count:</strong> {rawClaimsData?.filter(c => c.status === 'pending').length || 0}</p>
            <p><strong>Approved Count:</strong> {rawClaimsData?.filter(c => c.status === 'approved').length || 0}</p>
            <p><strong>Rejected Count:</strong> {rawClaimsData?.filter(c => c.status === 'rejected').length || 0}</p>
          </div>
        </div>
      )}
      
      {showRawData && rawClaimsData && (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border overflow-auto max-h-60">
          <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
            Raw Database Claims 
            <Badge variant="outline" className="ml-2">{rawClaimsData.length} total</Badge>
          </h3>
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
