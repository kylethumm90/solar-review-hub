import { useState } from 'react';
import useAdminLogs from '@/hooks/useAdminLogs';
import LogsHeader from './LogsHeader';
import LogsFilterBar from './LogsFilterBar';
import LogsTable from './LogsTable';
import LogsErrorDisplay from './LogsErrorDisplay';

export default function LogsContent() {
  const { logs, isLoading, isFetching, error, refetch } = useAdminLogs();
  const [search, setSearch] = useState('');
  const [actionType, setActionType] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      search === '' ||
      log.action_type.toLowerCase().includes(search.toLowerCase()) ||
      log.target_entity.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionType === '' || log.action_type === actionType;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="p-4 space-y-4">
      <LogsHeader isFetching={isFetching} onRefresh={refetch} />
      <LogsFilterBar
        search={search}
        setSearch={setSearch}
        actionType={actionType}
        setActionType={setActionType}
      />
      {error ? (
        <LogsErrorDisplay error={error} onRetry={refetch} />
      ) : (
        <LogsTable logs={logs} isLoading={isLoading} filteredLogs={filteredLogs} />
      )}
    </div>
  );
}
