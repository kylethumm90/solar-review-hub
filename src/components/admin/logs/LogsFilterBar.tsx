
import React from "react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search } from "lucide-react";

type LogsFilterBarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  actionTypeFilter: string | null;
  setActionTypeFilter: (value: string | null) => void;
  actionTypes: string[];
};

export default function LogsFilterBar({
  searchTerm,
  setSearchTerm,
  actionTypeFilter,
  setActionTypeFilter,
  actionTypes
}: LogsFilterBarProps) {
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
          value={actionTypeFilter || ""}
          onValueChange={(value) => setActionTypeFilter(value === "" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All action types</SelectItem>
            {actionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
