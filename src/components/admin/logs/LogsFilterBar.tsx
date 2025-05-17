import LogsHeader from './LogsHeader';
import LogsFilterBar from './LogsFilterBar';
import LogsTable from './LogsTable';
import LogsErrorDisplay from './LogsErrorDisplay';
import { AdminLog } from '@/types/admin';

interface LogsContentProps {
  logs: AdminLog[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  actionType: string | null;
  setActionType: (type: string | null) => void;
  filteredLogs: AdminLog[];
  handleRefresh: () => void;
  actionTypes: string[];
}

export default function LogsContent({
  logs,
  isLoading,
  error,
  searchQuery,
  setSearchQuery,
  actionType,
  setActionType,
  filteredLogs,
  handleRefresh,
  actionTypes
}: LogsContentProps) {
  return (
    <div className="p-4 space-y-4">
      <LogsHeader 
        isLoading={isLoading} 
        onRefresh={handleRefresh} 
      />
      <LogsFilterBar
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        actionTypeFilter={actionType}
        setActionTypeFilter={setActionType}
        actionTypes={actionTypes}
        onRefresh={handleRefresh}
      />
      {error ? (
        <LogsErrorDisplay error={error} onRetry={handleRefresh} />
      ) : (
        <LogsTable logs={logs} isLoading={isLoading} filteredLogs={filteredLogs} />
      )}
    </div>
  );
}

