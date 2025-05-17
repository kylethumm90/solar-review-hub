import { useState, useMemo } from 'react';
import useAdminLogs from '@/hooks/useAdminLogs';
import LogsContent from '@/components/admin/logs/LogsContent';
import { AdminLog } from '@/types/admin';

export default function LogsPage() {
  const { logs, isLoading, error, refetch } = useAdminLogs();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionType, setActionType] = useState<string | null>(null);

  const filteredLogs: AdminLog[] = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        searchQuery === '' ||
        log.action_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target_entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.admin_user_id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAction = !actionType || log.action_type === actionType;

      return matchesSearch && matchesAction;
    });
  }, [logs, searchQuery, actionType]);

  const actionTypes = useMemo(() => {
    const types = Array.from(new Set(logs.map((log) => log.action_type)));
    return types.sort();
  }, [logs]);

  return (
    <LogsContent
      logs={logs}
      isLoading={isLoading}
      error={error}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      actionType={actionType}
      setActionType={setActionType}
      filteredLogs={filteredLogs}
      handleRefresh={refetch}
      actionTypes={actionTypes}
    />
  );
}
