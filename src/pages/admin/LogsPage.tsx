
import React from "react";
import { useAdminLogs } from "@/hooks/useAdminLogs";
import LogsHeader from "@/components/admin/logs/LogsHeader";
import LogsFilterBar from "@/components/admin/logs/LogsFilterBar";
import LogsTable from "@/components/admin/logs/LogsTable";
import LogsErrorDisplay from "@/components/admin/logs/LogsErrorDisplay";
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
    setEntityType
  } = useAdminLogs();

  // Extract unique action types for filter dropdown
  const actionTypes = Array.from(new Set(logs?.map(log => log.action_type) || [])).sort();

  // Handle manual refresh
  const handleRefresh = () => {
    toast.info("Refreshing logs...");
    // Use the window.location.reload() as a simple way to refresh the data
    window.location.reload();
  };

  // Apply client-side filtering
  const filteredLogs = React.useMemo(() => {
    return logs || [];
  }, [logs]);

  return (
    <div className="p-6 space-y-6">
      {error && (
        <LogsErrorDisplay 
          error={error} 
          refetch={handleRefresh} 
        />
      )}

      <LogsHeader 
        isFetching={isLoading} 
        handleRefresh={handleRefresh}
      />

      <LogsFilterBar 
        searchTerm={searchQuery} 
        setSearchTerm={setSearchQuery}
        actionTypeFilter={actionType}
        setActionTypeFilter={setActionType}
        actionTypes={actionTypes}
      />

      <div className="bg-muted/20 p-4 rounded-md mb-6">
        <h2 className="font-medium mb-2">About Admin Logs</h2>
        <p className="text-sm text-muted-foreground">
          This page shows a record of all administrative actions performed in the system. 
          Logs include information about who performed the action, what type of action it was,
          and the target of the action.
        </p>
      </div>

      <LogsTable 
        logs={logs} 
        isLoading={isLoading} 
        filteredLogs={filteredLogs} 
      />
    </div>
  );
};

export default LogsPage;
