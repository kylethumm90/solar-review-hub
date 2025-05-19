
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type ReviewFilterTabsProps = {
  activeTab: string;
  onTabChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

const ReviewFilterTabs = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange
}: ReviewFilterTabsProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <TabsList>
        <TabsTrigger value="pending" onClick={() => onTabChange("pending")}>Pending</TabsTrigger>
        <TabsTrigger value="approved" onClick={() => onTabChange("approved")}>Approved</TabsTrigger>
        <TabsTrigger value="rejected" onClick={() => onTabChange("rejected")}>Rejected</TabsTrigger>
        <TabsTrigger value="all" onClick={() => onTabChange("all")}>All</TabsTrigger>
      </TabsList>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search reviews..."
          className="pl-8 w-64"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ReviewFilterTabs;
