
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type LogsErrorDisplayProps = {
  error: Error;
  refetch: () => void;
};

export default function LogsErrorDisplay({ error, refetch }: LogsErrorDisplayProps) {
  return (
    <Card className="bg-red-50 border-red-200 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-red-800 mb-1">Error loading logs</h3>
            <p className="text-red-700 text-sm">{error.message}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-red-200 bg-red-50/50 flex justify-end">
        <Button 
          onClick={refetch} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </CardFooter>
    </Card>
  );
}
