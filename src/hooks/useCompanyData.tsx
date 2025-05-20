
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useCompanyData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [claim, setClaim] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  
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
          .eq('status', 'approved')
          .single();
          
        if (claimError) {
          if (claimError.code !== 'PGRST116') { // Not Found error
            console.error('Error fetching claim:', claimError);
            toast.error('Failed to fetch company data');
          }
          setLoading(false);
          return;
        }
        
        if (!claimData || !claimData.company) {
          setLoading(false);
          return;
        }
        
        setClaim(claimData);
        
        // Fetch the full company data including operating states
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*, operating_states')
          .eq('id', claimData.company_id)
          .single();
          
        if (companyError) {
          console.error('Error fetching company:', companyError);
          toast.error('Failed to fetch company details');
          setLoading(false);
          return;
        }
        
        setCompany(companyData);
        
        // Fetch reviews for this company
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('company_id', claimData.company_id)
          .order('created_at', { ascending: false });
          
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          toast.error('Failed to fetch company reviews');
        } else {
          setReviews(reviewsData || []);
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
    claim,
    company,
    reviews
  };
};
