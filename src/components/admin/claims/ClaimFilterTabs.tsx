
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ClaimFilterTabsProps = {
  activeFilter: string | null;
  onFilterChange: (status: string | null) => void;
};

const ClaimFilterTabs = ({ activeFilter, onFilterChange }: ClaimFilterTabsProps) => {
  return (
    <div className="mb-4">
      <Tabs value={activeFilter || "all"}>
        <TabsList>
          <TabsTrigger 
            value="all" 
            onClick={() => onFilterChange(null)}
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            onClick={() => onFilterChange("pending")}
          >
            Pending
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            onClick={() => onFilterChange("approved")}
          >
            Approved
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            onClick={() => onFilterChange("rejected")}
          >
            Rejected
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ClaimFilterTabs;
