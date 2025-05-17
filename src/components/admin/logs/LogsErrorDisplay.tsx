
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

type LogsErrorDisplayProps = {
  error: Error;
  refetch: () => void;
};

export default function LogsErrorDisplay({ error, refetch }: LogsErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-red-200 bg-red-50 text-red-800">
      <AlertCircle className="h-8 w-8 mb-4" />
      <h3 className="text-lg font-medium mb-2">Error loading logs</h3>
      <p className="text-sm mb-4">{error.message}</p>
      <Button 
        variant="outline" 
        onClick={refetch}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}
