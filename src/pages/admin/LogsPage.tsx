
import React from 'react';
import LogsHeader from '@/components/admin/logs/LogsHeader';
import LogsFilterBar from '@/components/admin/logs/LogsFilterBar';
import LogsTable from '@/components/admin/logs/LogsTable';
import LogsErrorDisplay from '@/components/admin/logs/LogsErrorDisplay';
import { useAdminLogs } from '@/hooks/useAdminLogs';

const LogsPage = () => {
  const {
    filteredLogs,
    isLoading,
    isFetching,
    error,
    searchTerm,
    setSearchTerm,
    actionTypeFilter,
    setActionTypeFilter,
    actionTypes,
    handleRefresh,
    handleCreateTestLog,
    refetch
  } = useAdminLogs();
  
  if (error) {
    return <LogsErrorDisplay error={error} refetch={refetch} />;
  }
  
  return (
    <div className="p-6 max-w-full">
      <LogsHeader 
        handleRefresh={handleRefresh}
        handleCreateTestLog={handleCreateTestLog}
        isFetching={isFetching}
      />
      
      <LogsFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        actionTypeFilter={actionTypeFilter}
        setActionTypeFilter={setActionTypeFilter}
        actionTypes={actionTypes}
      />
      
      <LogsTable
        logs={filteredLogs}
        isLoading={isLoading}
        isFetching={isFetching}
        filteredLogs={filteredLogs}
      />
    </div>
  );
};

export default LogsPage;
