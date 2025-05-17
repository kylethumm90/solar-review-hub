import { AdminLog } from '@/types/admin';

type LogsTableProps = {
  logs: AdminLog[];
  isLoading: boolean;
  filteredLogs: AdminLog[];
};

export default function LogsTable({ logs, isLoading, filteredLogs }: LogsTableProps) {
  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading logs...</div>;
  }

  if (filteredLogs.length === 0) {
    return <div className="text-sm text-gray-500">No matching logs found.</div>;
  }

  return (
    <table className="w-full border border-gray-200 text-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2 border-b">Action</th>
          <th className="p-2 border-b">Entity</th>
          <th className="p-2 border-b">Target ID</th>
          <th className="p-2 border-b">Admin User</th>
          <th className="p-2 border-b">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {filteredLogs.map((log) => (
          <tr key={log.id} className="border-b">
            <td className="p-2">{log.action_type}</td>
            <td className="p-2">{log.target_entity}</td>
            <td className="p-2">{log.target_id}</td>
            <td className="p-2">{log.admin_user_id}</td>
            <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
