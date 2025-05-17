import useAdminLogs from '@/hooks/useAdminLogs';

export default function LogsPage() {
  const { logs, isLoading } = useAdminLogs();

  if (isLoading) return <div>Loading logs...</div>;

  return (
    <div className="p-4">
      <pre className="text-xs bg-gray-100 p-4 rounded">{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
}
