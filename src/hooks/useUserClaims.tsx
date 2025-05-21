
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Claim, Company } from '@/types';

export type UserClaimWithCompany = Claim & {
  company: Company;
};

export const useUserClaims = () => {
  const [claims, setClaims] = useState<UserClaimWithCompany[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  const fetchUserClaims = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch all claims by this user
      const { data: claimsData, error: claimsError } = await supabase
        .from('claims')
        .select(`
          id,
          user_id,
          company_id,
          full_name,
          job_title,
          company_email,
          status,
          created_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (claimsError) throw claimsError;
      
      if (!claimsData || claimsData.length === 0) {
        setClaims([]);
        setLoading(false);
        return;
      }

      // Get all company data for the claims
      const companyIds = claimsData.map(claim => claim.company_id);
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('id, name, description, logo_url, type, is_verified, created_at')
        .in('id', companyIds);

      if (companiesError) throw companiesError;

      // Combine the data
      const userClaimsWithCompanies = claimsData.map(claim => {
        const company = companiesData?.find(c => c.id === claim.company_id);
        return {
          ...claim,
          company: company || {
            id: claim.company_id,
            name: 'Unknown Company',
            description: '',
            type: '',
            is_verified: false,
            created_at: new Date().toISOString()
          }
        } as unknown as UserClaimWithCompany;
      });

      setClaims(userClaimsWithCompanies);
    } catch (error: any) {
      console.error('Error fetching user claims:', error);
      toast.error('Failed to load your claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserClaims();
  }, [user]);

  return {
    claims,
    loading,
    refreshClaims: fetchUserClaims
  };
};
