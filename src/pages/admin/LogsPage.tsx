
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { logAdminAction } from '@/utils/adminLogUtils';

// Type definition for admin log
interface AdminLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_entity: string;
  target_id: string;
  details?: Record<string, any>;
  timestamp: string;
  admin?: {
    email?: string;
    full_name?: string;
  };
}

const LogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Log page view on component mount
  useEffect(() => {
    const logPageView = async () => {
      if (!isInitialized) {
        try {
          await logAdminAction({
            action_type: 'PAGE_VIEW',
            target_entity: 'admin_logs',
            target_id: `logs_page_${Date.now()}`,
            details: {
              page: '/admin/logs',
              timestamp: new Date().toISOString()
            }
          });
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to log page view:', error);
        }
      }
    };
    
    logPageView();
  }, [isInitialized]);
  
  const { 
    data: logs, 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: async () => {
      try {
        console.log('Fetching admin logs...');
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          throw new Error('No authenticated session found');
        }
        
        // First, check if the user can access admin logs
        console.log('Attempting to fetch admin logs as user:', sessionData.session.user.id);
        
        const { data, error } = await supabase
          .from('admin_logs')
          .select(`
            *,
            admin:admin_user_id (email, full_name)
          `)
          .order('timestamp', { ascending: false });
          
        if (error) {
          console.error('Error fetching admin logs:', error);
          throw error;
        }
        
        console.log('Admin logs fetched successfully, count:', data?.length ?? 0);
        return data as AdminLog[];
      } catch (err) {
        console.error('Error in logs query function:', err);
        throw err;
      }
    },
    staleTime: 15000, // Consider data stale after 15 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    retry: 1
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
  
  const handleRefresh = () => {
    toast.info('Refreshing logs...');
    refetch();
  };
  
  const handleCreateTestLog = async () => {
    toast.info('Creating test log entry...');
    try {
      const result = await logAdminAction({
        action_type: 'TEST_LOG',
        target_entity: 'admin_logs',
        target_id: `manual_test_${Date.now()}`,
        details: { 
          created_by: 'admin_user', 
          timestamp: new Date().toISOString(),
          purpose: 'Testing admin logs functionality'
        }
      });
      
      if (result.error) {
        toast.error(`Failed to create test log: ${result.error.message}`);
      } else {
        toast.success('Test log created successfully');
        setTimeout(() => refetch(), 1000); // Wait a moment before refetching
      }
    } catch (err) {
      console.error('Error creating test log:', err);
      toast.error(`Error creating test log: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  if (error) {
    return (
      <div className="p-6 max-w-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="font-bold">Error loading logs</div>
          <div>{error instanceof Error ? error.message : 'Unknown error occurred'}</div>
          <pre className="mt-2 text-xs whitespace-pre-wrap overflow-auto max-h-40">
            {error instanceof Error && error.stack ? error.stack : 'No stack trace available'}
          </pre>
        </div>
        <Button onClick={() => refetch()} className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Action Logs</h1>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} /> 
            Refresh Logs
          </Button>
          <Button
            variant="default"
            onClick={handleCreateTestLog}
            disabled={isFetching}
          >
            Create Test Log
          </Button>
        </div>
      </div>
      
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
              {isLoading || isFetching ? (
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
                    <td className="px-4 py-3">
                      {log.target_id.length > 16 
                        ? `${log.target_id.slice(0, 8)}...${log.target_id.slice(-8)}`
                        : log.target_id}
                    </td>
                    <td className="px-4 py-3">{log.target_entity}</td>
                    <td className="px-4 py-3">{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}</td>
                    <td className="px-4 py-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          toast.info(
                            <pre className="whitespace-pre-wrap font-mono text-xs">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>,
                            {
                              duration: 10000,
                              id: `log-details-${log.id}`
                            }
                          );
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center">
                    No logs found. Try creating a test log with the button above.
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
