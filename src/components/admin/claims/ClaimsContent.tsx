
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ClaimsTable from "./ClaimsTable";
import ClaimsFilter from "./ClaimsFilter";
import ClaimsInfoSection from "./ClaimsInfoSection";
import { Claim } from "@/types";

interface ClaimsContentProps {
  claims: Claim[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onApprove: (claimId: string) => void;
  onReject: (claimId: string) => void;
}

const ClaimsContent = ({
  claims,
  isLoading,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  onApprove,
  onReject
}: ClaimsContentProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Company Claims Management</h1>
      </div>
      
      <ClaimsInfoSection />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ClaimsFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <TabsContent value={activeTab} className="space-y-4">
          <ClaimsTable 
            claims={claims} 
            isLoading={isLoading}
            onApprove={onApprove}
            onReject={onReject}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ClaimsContent;
