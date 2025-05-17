
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, PlusCircle } from "lucide-react";
import { logAdminAction } from "@/utils/adminLogUtils";
import { toast } from "sonner";

type LogsFilterBarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  actionTypeFilter: string | null;
  setActionTypeFilter: (value: string | null) => void;
  actionTypes: string[];
  onRefresh?: () => void;
};

export default function LogsFilterBar({
  searchTerm,
  setSearchTerm,
  actionTypeFilter,
  setActionTypeFilter,
  actionTypes,
  onRefresh
}: LogsFilterBarProps) {
  // Function to create a test log entry
  const createTestLogEntry = async () => {
    try {
      const testLogResult = await logAdminAction({
        action_type: 'approve_review',
        target_entity: 'review',
        target_id: `test-${Date.now()}`,
        details: { note: 'This is a test log entry created manually' }
      });
      
      if (testLogResult.error) {
        toast.error("Failed to create test log entry");
        console.error("Test log creation error:", testLogResult.error);
      } else {
        toast.success("Test log entry created successfully");
        // Refresh the logs if the callback is provided
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      console.error("Error creating test log:", error);
      toast.error("An unexpected error occurred creating test log");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search logs by action, entity, ID or admin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="w-full md:w-64">
        <Select
          value={actionTypeFilter || "all"}
          onValueChange={(value) => setActionTypeFilter(value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All action types</SelectItem>
            {actionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="whitespace-nowrap"
        onClick={createTestLogEntry}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Create Test Log
      </Button>
    </div>
  );
}
