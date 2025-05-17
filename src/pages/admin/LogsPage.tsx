
import { useState, useMemo } from 'react';
import useAdminLogs from '@/hooks/useAdminLogs';
import LogsContent from '@/components/admin/logs/LogsContent';

export default function LogsPage() {
  const { logs, isLoading, error, refetchLogs } = useAdminLogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionType, setActionType] = useState<string | null>(null);
  
  // Extract unique action types for the filter dropdown
  const actionTypes = useMemo(() => {
    if (!logs) return [];
    return Array.from(new Set(logs.map(log => log.action_type)));
  }, [logs]);
  
  // Filter logs based on search query and selected action type
  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    
    return logs.filter(log => {
      const matchesSearch = searchQuery === '' || 
        log.action_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target_entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.admin?.full_name && log.admin.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.admin?.email && log.admin.email.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesActionType = actionType === null || log.action_type === actionType;
      
      return matchesSearch && matchesActionType;
    });
  }, [logs, searchQuery, actionType]);

  // Handle refresh
  const handleRefresh = () => {
    refetchLogs();
  };

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
      handleRefresh={handleRefresh}
      actionTypes={actionTypes}
    />
  );
}
