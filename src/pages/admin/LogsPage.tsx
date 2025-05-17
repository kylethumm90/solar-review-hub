
import React from "react";
import { useAdminLogs } from "@/hooks/useAdminLogs";
import LogsContent from "@/components/admin/logs/LogsContent";
import { toast } from "sonner";

const LogsPage = () => {
  const {
    logs,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    actionType,
    setActionType,
    entityType,
    setEntityType,
    refetchLogs
  } = useAdminLogs();

  // Extract unique action types for filter dropdown
  const actionTypes = Array.from(new Set(logs?.map(log => log.action_type) || [])).sort();

  // Handle manual refresh
  const handleRefresh = () => {
    toast.info("Refreshing logs...");
    refetchLogs();
  };

  // Apply client-side filtering
  const filteredLogs = React.useMemo(() => {
    return logs || [];
  }, [logs]);

  return (
    <div className="p-6 space-y-6">
      <LogsContent
        logs={logs}
        isLoading={isLoading}
        error={error}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        actionType={actionType}
        setActionType={setActionType}
        filteredLogs={filteredLogs}
        handleRefresh={handleRefresh}
        actionTypes={actionTypes}
      />
    </div>
  );
};

export default LogsPage;
