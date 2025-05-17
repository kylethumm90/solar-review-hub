
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type LogsHeaderProps = {
  isFetching: boolean;
  handleRefresh: () => void;
};

export default function LogsHeader({ isFetching, handleRefresh }: LogsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Admin Logs</h1>
      <Button 
        onClick={handleRefresh} 
        variant="outline" 
        size="sm" 
        disabled={isFetching}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        {isFetching ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
}
