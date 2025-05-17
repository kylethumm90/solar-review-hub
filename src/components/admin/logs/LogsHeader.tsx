
type LogsHeaderProps = {
  isLoading: boolean;
  onRefresh: () => void;
};

export default function LogsHeader({ isLoading, onRefresh }: LogsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Admin Logs</h1>
      <Button 
        onClick={onRefresh} 
        variant="outline" 
        size="sm" 
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
}
