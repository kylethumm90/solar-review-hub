
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface AdminLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_entity: string;
  target_id: string;
  details: any;
  timestamp: string;
  admin_email?: string;
  admin_name?: string;
}

const LogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['admin-logs'],
    queryFn: async () => {
      // Fetch logs
      const { data: logsData, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (error) throw error;
      
      if (!logsData || logsData.length === 0) {
        return [];
      }
      
      // Get unique admin user IDs
      const adminUserIds = [...new Set(logsData.map(log => log.admin_user_id))];
      
      // Fetch admin user details
      const { data: adminUsers } = await supabase
        .from('users')
        .select('id, email, full_name')
        .in('id', adminUserIds);
      
      // Combine logs with admin user details
      const enhancedLogs = logsData.map(log => {
        const adminUser = adminUsers?.find(user => user.id === log.admin_user_id);
        return {
          ...log,
          admin_email: adminUser?.email,
          admin_name: adminUser?.full_name
        };
      });
      
      return enhancedLogs as AdminLog[];
    }
  });

  const filteredLogs = logs?.filter(log => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      log.action_type.toLowerCase().includes(searchTermLower) ||
      log.target_entity.toLowerCase().includes(searchTermLower) ||
      log.admin_email?.toLowerCase().includes(searchTermLower) ||
      log.admin_name?.toLowerCase().includes(searchTermLower)
    );
  });

  const handleViewDetails = (log: AdminLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };
  
  const getActionColor = (action: string) => {
    if (action.startsWith('approve')) return 'green';
    if (action.startsWith('reject')) return 'red';
    if (action.startsWith('edit')) return 'blue';
    if (action.startsWith('change')) return 'orange';
    if (action.startsWith('verify')) return 'green';
    return 'gray';
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Action Logs</h1>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" onClick={() => refetch()} title="Refresh Logs">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredLogs?.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-gray-500">No admin logs found</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Target Entity</TableHead>
                <TableHead>Target ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs?.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="outline" className={`text-${getActionColor(log.action_type)}-600 bg-${getActionColor(log.action_type)}-50 border-${getActionColor(log.action_type)}-200`}>
                      {log.action_type.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.admin_name || log.admin_email || log.admin_user_id}</TableCell>
                  <TableCell>{log.target_entity}</TableCell>
                  <TableCell>
                    <span className="text-xs font-mono truncate max-w-[120px] inline-block">
                      {log.target_id}
                    </span>
                  </TableCell>
                  <TableCell>{format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(log)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Details Modal */}
      {selectedLog && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Admin Action Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Action</p>
                  <p className="text-lg font-semibold">{selectedLog.action_type.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{format(new Date(selectedLog.timestamp), 'MMM d, yyyy HH:mm:ss')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Admin</p>
                  <p>{selectedLog.admin_name || selectedLog.admin_email || selectedLog.admin_user_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Target</p>
                  <p>{selectedLog.target_entity} ({selectedLog.target_id})</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Details</p>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LogsPage;
