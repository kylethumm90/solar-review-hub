
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useCompanyData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<any[]>([]);
  const [selectedClaimIndex, setSelectedClaimIndex] = useState(0);
  const [companies, setCompanies] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  // Get the currently selected claim and company
  const currentClaim = claims.length > 0 ? claims[selectedClaimIndex] : null;
  const currentCompany = companies.length > 0 ? companies[selectedClaimIndex] : null;
  
  // Function to change the selected company
  const selectCompany = (index: number) => {
    if (index >= 0 && index < claims.length) {
      setSelectedClaimIndex(index);
    }
  };
  
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Find claims by the current user
        const { data: claimData, error: claimError } = await supabase
          .from('claims')
          .select('*, company:companies(*)')
          .eq('user_id', user.id)
          .eq('status', 'approved');
          
        if (claimError) {
          console.error('Error fetching claims:', claimError);
          toast.error('Failed to fetch company data');
          setLoading(false);
          return;
        }
        
        if (!claimData || claimData.length === 0) {
          setLoading(false);
          return;
        }
        
        setClaims(claimData);
        
        // Fetch full company details for all claimed companies
        const companyIds = claimData.map(claim => claim.company_id);
        
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('*, operating_states')
          .in('id', companyIds);
          
        if (companiesError) {
          console.error('Error fetching companies:', companiesError);
          toast.error('Failed to fetch company details');
          setLoading(false);
          return;
        }
        
        // Sort companies to match the order of claims
        const sortedCompanies = companyIds.map(id => 
          companiesData?.find(company => company.id === id)
        ).filter(Boolean);
        
        setCompanies(sortedCompanies);
        
        // Fetch all reviews for these companies
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .in('company_id', companyIds)
          .order('created_at', { ascending: false });
          
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          toast.error('Failed to fetch company reviews');
        } else {
          // Group reviews by company_id
          const reviewsByCompany = companyIds.map(id => 
            reviewsData?.filter(review => review.company_id === id) || []
          );
          
          setReviews(reviewsByCompany);
        }
        
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [user]);
  
  return {
    loading,
    claims,
    companies,
    currentClaim,
    currentCompany,
    reviews: reviews[selectedClaimIndex] || [],
    selectedClaimIndex,
    selectCompany,
    totalClaimedCompanies: claims.length
  };
};
