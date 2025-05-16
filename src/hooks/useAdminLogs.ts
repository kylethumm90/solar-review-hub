
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLog } from '@/types/admin';
import { logAdminAction } from '@/utils/adminLogUtils';
import { toast } from 'sonner';

export const useAdminLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Log page view on component mount
  useEffect(() => {
    const logPageView = async () => {
      if (!isInitialized) {
        try {
          // Generate a proper UUID for the log entry
          const pageViewId = crypto.randomUUID();
          
          await logAdminAction({
            action_type: 'PAGE_VIEW',
            target_entity: 'admin_logs',
            target_id: pageViewId,
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
      // Generate a proper UUID for the test log
      const testLogId = crypto.randomUUID();
      
      const result = await logAdminAction({
        action_type: 'TEST_LOG',
        target_entity: 'admin_logs',
        target_id: testLogId,
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

  return {
    logs,
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
  };
};
