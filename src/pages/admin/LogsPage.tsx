import useAdminLogs from '@/hooks/useAdminLogs';

export default function LogsPage() {
  const { logs, isLoading } = useAdminLogs();

  if (isLoading) return <div>Loading logs...</div>;

  return (
    <div className="p-4">
      <table className="min-w-full bg-white text-sm">
  <thead className="text-left border-b font-medium">
    <tr>
      <th className="px-4 py-2">Action</th>
      <th className="px-4 py-2">Entity</th>
      <th className="px-4 py-2">Target ID</th>
      <th className="px-4 py-2">Admin</th>
      <th className="px-4 py-2">Timestamp</th>
    </tr>
  </thead>
  <tbody>
    {logs.map((log) => (
      <tr key={log.id} className="border-b hover:bg-gray-50">
        <td className="px-4 py-2">{log.action_type}</td>
        <td className="px-4 py-2">{log.target_entity}</td>
        <td className="px-4 py-2 truncate max-w-xs">{log.target_id}</td>
        <td className="px-4 py-2 text-gray-500">{log.admin_user_id}</td>
        <td className="px-4 py-2 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
