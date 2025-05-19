
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCompanyData = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [claim, setClaim] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchClaimAndCompany = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // For admin users, we'll fetch the first available company if they don't have claims
        const isUserAdmin = isAdmin();
        
        // Check if user has any approved claims
        const { data: claimData, error: claimError } = await supabase
          .from('claims')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'approved')
          .single();
          
        if (claimError) {
          console.log('Claim error:', claimError);
          
          // If the user is an admin but has no claims, fetch the first company
          if (isUserAdmin) {
            console.log('Admin user without claims - fetching first company');
            
            // Fetch first company for admin
            const { data: companiesData, error: companiesError } = await supabase
              .from('companies')
              .select('*')
              .limit(1);
              
            if (companiesError || !companiesData || companiesData.length === 0) {
              throw new Error('No companies found');
            }
            
            // Create a placeholder claim for admin
            const adminClaim = {
              id: 'admin-placeholder',
              user_id: user.id,
              company_id: companiesData[0].id,
              full_name: user?.user_metadata?.full_name || 'Admin User',
              job_title: 'Administrator',
              company_email: user.email,
              status: 'approved',
              created_at: new Date().toISOString()
            };
            
            setClaim(adminClaim);
            setCompany(companiesData[0]);
            
            // Fetch reviews for this company
            const { data: reviewsData, error: reviewsError } = await supabase
              .from('reviews')
              .select('*')
              .eq('company_id', companiesData[0].id)
              .order('created_at', { ascending: false });
              
            if (!reviewsError) {
              setReviews(reviewsData || []);
            }
            
            setLoading(false);
            return;
          } else {
            // Not an admin and no claims
            if (claimError.code === 'PGRST116') {
              // No claim found (single item not found)
              toast.error('You do not have any approved company claims');
              navigate('/dashboard');
              return;
            }
            throw claimError;
          }
        }
        
        // Regular user with approved claim - fetch their company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', claimData.company_id)
          .single();
          
        if (companyError) {
          throw companyError;
        }
        
        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('company_id', claimData.company_id)
          .order('created_at', { ascending: false });
          
        if (reviewsError) {
          throw reviewsError;
        }
        
        setClaim(claimData);
        setCompany(companyData);
        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Error fetching claim and company:', error);
        toast.error('Could not load company information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClaimAndCompany();
  }, [user, navigate, isAdmin]);

  return {
    loading,
    claim,
    company,
    reviews
  };
};
