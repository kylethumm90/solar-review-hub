
import React from 'react';
import { useRankings } from '@/hooks/useRankings';
import RankingsFilters from '@/components/rankings/RankingsFilters';
import RankingsTable from '@/components/rankings/RankingsTable';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Rankings = () => {
  const {
    companies,
    isLoading,
    error,
    vendorType,
    setVendorType,
    gradeThreshold,
    setGradeThreshold,
    refresh
  } = useRankings();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Solar Industry Power Rankings</h1>
          <p className="text-muted-foreground mt-2">
            See the top-rated companies in the solar industry based on verified reviews
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0" 
          onClick={refresh}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Rankings
        </Button>
      </div>
      
      <RankingsFilters
        vendorType={vendorType}
        setVendorType={setVendorType}
        gradeThreshold={gradeThreshold}
        setGradeThreshold={setGradeThreshold}
      />
      
      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Rankings temporarily unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <RankingsTable 
          companies={companies} 
          isLoading={isLoading} 
        />
      )}
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p><strong>Note:</strong> Rankings are updated every 30 minutes. Companies with fewer than 3 verified reviews are not included.</p>
        <p className="mt-2">
          <strong>Ranking Methodology:</strong> Companies are ranked based on average review grade, with number of reviews and installs used as tiebreakers.
        </p>
      </div>
    </div>
  );
};

export default Rankings;
