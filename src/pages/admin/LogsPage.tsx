
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const LogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('');
  
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_logs')
        .select(`
          *,
          admin:admin_user_id (email, full_name)
        `)
        .order('timestamp', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });
  
  // Get unique action types for filtering
  const actionTypes = logs ? [...new Set(logs.map(log => log.action_type))] : [];
  
  // Filter logs based on search term and action type
  const filteredLogs = logs?.filter(log => {
    const matchesSearch = !searchTerm || 
      log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target_entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.admin?.email && log.admin.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.admin?.full_name && log.admin.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesActionType = !actionTypeFilter || log.action_type === actionTypeFilter;
    
    return matchesSearch && matchesActionType;
  });
  
  if (error) {
    return (
      <div className="p-6 max-w-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading logs: {error.message}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-full">
      <h1 className="text-2xl font-bold mb-6">Admin Action Logs</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={actionTypeFilter}
            onChange={(e) => setActionTypeFilter(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-background"
          >
            <option value="">All Action Types</option>
            {actionTypes.map((type) => (
              <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <Button 
          variant="outline"
          onClick={() => {
            setSearchTerm('');
            setActionTypeFilter('');
          }}
        >
          Reset Filters
        </Button>
      </div>
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Action Type</th>
                <th className="px-4 py-3 text-left font-medium">Admin</th>
                <th className="px-4 py-3 text-left font-medium">Target</th>
                <th className="px-4 py-3 text-left font-medium">Entity</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredLogs && filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3">{log.action_type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">{log.admin?.email || 'Unknown'}</td>
                    <td className="px-4 py-3">{log.target_id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">{log.target_entity}</td>
                    <td className="px-4 py-3">{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}</td>
                    <td className="px-4 py-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => alert(JSON.stringify(log.details, null, 2))}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center">
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
