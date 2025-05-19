
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
      <div className="flex items-center">
        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-sm text-muted-foreground mr-2">Status Filter:</span>
        <TabsList>
          <TabsTrigger 
            value="all" 
            onClick={() => handleTabClick("all")}
            data-active={activeTab === "all"}
            className={activeTab === "all" ? "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground font-bold" : ""}
          >
            All Claims
            {activeTab === "all" && <Badge className="ml-2 bg-primary-foreground text-primary">Active</Badge>}
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            onClick={() => handleTabClick("pending")}
            data-active={activeTab === "pending"}
            className={activeTab === "pending" ? "data-[active=true]:bg-amber-500 data-[active=true]:text-white font-bold" : ""}
          >
            Pending
            {activeTab === "pending" && <Badge className="ml-2 bg-amber-100 text-amber-800">Active</Badge>}
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            onClick={() => handleTabClick("approved")}
            data-active={activeTab === "approved"}
            className={activeTab === "approved" ? "data-[active=true]:bg-green-500 data-[active=true]:text-white font-bold" : ""}
          >
            Approved
            {activeTab === "approved" && <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>}
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            onClick={() => handleTabClick("rejected")}
            data-active={activeTab === "rejected"}
            className={activeTab === "rejected" ? "data-[active=true]:bg-red-500 data-[active=true]:text-white font-bold" : ""}
          >
            Rejected
            {activeTab === "rejected" && <Badge className="ml-2 bg-red-100 text-red-800">Active</Badge>}
          </TabsTrigger>
        </TabsList>
      </div>
      
      <div className="relative w-full md:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search claims..."
          className="pl-8 pr-10 w-full md:w-64"
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
