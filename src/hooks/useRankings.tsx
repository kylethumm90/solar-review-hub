
import { useState, useEffect } from 'react';
import { RankedCompany } from '@/types/rankings';
import { RankingsService } from '@/services/RankingsService';

export const useRankings = () => {
  const [companies, setCompanies] = useState<RankedCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vendorType, setVendorType] = useState('all');
  const [gradeThreshold, setGradeThreshold] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const fetchRankings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await RankingsService.getTopCompanies(
        100,
        vendorType === 'all' ? undefined : vendorType,
        gradeThreshold === 'all' ? undefined : gradeThreshold
      );
      setCompanies(data);
    } catch (err) {
      setError('Unable to load rankings at this time. Please try again later.');
      console.error('Error fetching rankings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
    
    // Set up a refresh interval - every 30 minutes
    const intervalId = setInterval(fetchRankings, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [vendorType, gradeThreshold]);

  return {
    companies,
    isLoading,
    error,
    vendorType,
    setVendorType,
    gradeThreshold,
    setGradeThreshold,
    refresh: fetchRankings
  };
};
