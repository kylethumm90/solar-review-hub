
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClaimsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClaimsFilter = ({ 
  searchQuery, 
  setSearchQuery,
  activeTab,
  setActiveTab
}: ClaimsFilterProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <TabsList>
        <TabsTrigger 
          value="all" 
          onClick={() => setActiveTab("all")}
          data-active={activeTab === "all"}
          className={activeTab === "all" ? "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground" : ""}
        >
          All
        </TabsTrigger>
        <TabsTrigger 
          value="pending" 
          onClick={() => setActiveTab("pending")}
          data-active={activeTab === "pending"}
          className={activeTab === "pending" ? "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground" : ""}
        >
          Pending
        </TabsTrigger>
        <TabsTrigger 
          value="approved" 
          onClick={() => setActiveTab("approved")}
          data-active={activeTab === "approved"}
          className={activeTab === "approved" ? "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground" : ""}
        >
          Approved
        </TabsTrigger>
        <TabsTrigger 
          value="rejected" 
          onClick={() => setActiveTab("rejected")}
          data-active={activeTab === "rejected"}
          className={activeTab === "rejected" ? "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground" : ""}
        >
          Rejected
        </TabsTrigger>
      </TabsList>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search claims..."
          className="pl-8 w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ClaimsFilter;
