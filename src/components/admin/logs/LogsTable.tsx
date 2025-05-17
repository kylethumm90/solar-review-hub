
import { AdminLog } from '@/types/admin';
import { format } from 'date-fns';

type LogsTableProps = {
  logs: AdminLog[];
  isLoading: boolean;
  filteredLogs: AdminLog[];
};

export default function LogsTable({ logs, isLoading, filteredLogs }: LogsTableProps) {
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

  return (
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
              <td className="p-3 font-medium">{formatActionType(log.action_type)}</td>
              <td className="p-3 capitalize">{log.target_entity}</td>
              <td className="p-3 font-mono text-xs">{log.target_id}</td>
              <td className="p-3">
                {log.admin?.full_name || log.admin?.email || log.admin_user_id}
              </td>
              <td className="p-3 whitespace-nowrap">
                {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
              </td>
              <td className="p-3 max-w-xs truncate">
                {log.details ? (
                  <details>
                    <summary className="cursor-pointer text-sm text-blue-600 hover:underline">
                      View details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs whitespace-pre-wrap overflow-hidden">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </details>
                ) : (
                  <span className="text-gray-400">No details</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
