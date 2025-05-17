
import { useState } from 'react';
import { AdminLog } from '@/types/admin';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import LogDetailsModal from './LogDetailsModal';

type LogsTableProps = {
  logs: AdminLog[];
  isLoading: boolean;
  filteredLogs: AdminLog[];
};

export default function LogsTable({ logs, isLoading, filteredLogs }: LogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <div className="text-center p-8 text-gray-500">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full mb-2" />
      <p>Loading logs...</p>
    </div>;
  }

  if (filteredLogs.length === 0) {
    return <div className="text-center p-8 text-gray-500">No matching logs found.</div>;
  }

  // Format the action type to be more readable
  const formatActionType = (actionType: string): string => {
    return actionType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Determine the color class based on action type
  const getActionTypeColorClass = (actionType: string): string => {
    if (actionType.startsWith('approve_')) return 'text-green-600';
    if (actionType.startsWith('reject_')) return 'text-red-600';
    if (actionType.startsWith('edit_')) return 'text-blue-600';
    if (actionType.startsWith('verify_')) return 'text-purple-600';
    return 'text-gray-800'; // default color
  };

  const handleViewDetails = (log: AdminLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3 font-medium border-b">Action</th>
              <th className="p-3 font-medium border-b">Entity</th>
              <th className="p-3 font-medium border-b">Target ID</th>
              <th className="p-3 font-medium border-b">Admin</th>
              <th className="p-3 font-medium border-b">Timestamp</th>
              <th className="p-3 font-medium border-b">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-muted/30">
                <td className={`p-3 font-medium ${getActionTypeColorClass(log.action_type)}`}>
                  {formatActionType(log.action_type)}
                </td>
                <td className="p-3 capitalize">{log.target_entity}</td>
                <td className="p-3 font-mono text-xs">{log.target_id}</td>
                <td className="p-3">
                  {log.admin?.full_name || log.admin?.email || log.admin_user_id}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                </td>
                <td className="p-3">
                  {log.details ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(log)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  ) : (
                    <span className="text-gray-400">No details</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LogDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        log={selectedLog} 
      />
    </>
  );
}
