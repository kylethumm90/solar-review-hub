
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const clearSearch = () => {
    setSearchQuery('');
    console.log('[ClaimsFilter] Search query cleared');
  };

  const handleTabClick = (tab: string) => {
    console.log(`[ClaimsFilter] Tab changed from ${activeTab} to ${tab}`);
    setActiveTab(tab);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <TabsList>
        <TabsTrigger 
          value="all" 
          onClick={() => handleTabClick("all")}
          data-active={activeTab === "all"}
          className={activeTab === "all" ? "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground font-bold" : ""}
        >
          All Claims
        </TabsTrigger>
        <TabsTrigger 
          value="pending" 
          onClick={() => handleTabClick("pending")}
          data-active={activeTab === "pending"}
          className={activeTab === "pending" ? "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground font-bold" : ""}
        >
          Pending
        </TabsTrigger>
        <TabsTrigger 
          value="approved" 
          onClick={() => handleTabClick("approved")}
          data-active={activeTab === "approved"}
          className={activeTab === "approved" ? "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground font-bold" : ""}
        >
          Approved
        </TabsTrigger>
        <TabsTrigger 
          value="rejected" 
          onClick={() => handleTabClick("rejected")}
          data-active={activeTab === "rejected"}
          className={activeTab === "rejected" ? "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground font-bold" : ""}
        >
          Rejected
        </TabsTrigger>
      </TabsList>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search claims..."
          className="pl-8 pr-10 w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClaimsFilter;
