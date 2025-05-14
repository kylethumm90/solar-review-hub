
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import LoadingState from '@/components/ui/LoadingState';
import ClaimVendorHeader from '@/components/vendor/ClaimVendorHeader';
import ClaimVendorForm from '@/components/vendor/ClaimVendorForm';

const ClaimVendor = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [existingClaim, setExistingClaim] = useState<any>(null);
  
  useEffect(() => {
    async function fetchVendorInfo() {
      if (!vendorId) return;
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name, logo_url, website')
          .eq('id', vendorId)
          .single();
          
        if (error) throw error;
        setVendor(data);
        
        // Check if there's an existing claim
        if (user) {
          const { data: claimData, error: claimError } = await supabase
            .from('claims')
            .select('*')
            .eq('company_id', vendorId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (!claimError && claimData) {
            setExistingClaim(claimData);
            
            if (claimData.status === 'pending') {
              toast({
                description: 'You already have a pending claim for this vendor',
                variant: 'default'
              });
            } else if (claimData.status === 'approved') {
              toast({
                description: 'Your claim for this vendor has been approved!',
                variant: 'default'
              });
              navigate(`/vendors/${vendorId}`);
              return;
            }
          }
        } else {
          // If not logged in, redirect to login
          toast({
            description: 'You must be logged in to claim a vendor',
            variant: 'default'
          });
          navigate('/login', { state: { from: { pathname: `/claim/${vendorId}` } } });
          return;
        }
      } catch (error) {
        console.error('Error fetching vendor info:', error);
        toast({
          description: 'Vendor not found.',
          variant: 'destructive'
        });
        navigate('/vendors');
      } finally {
        setLoading(false);
      }
    }
    
    fetchVendorInfo();
  }, [vendorId, navigate, user]);
  
  if (loading) {
    return <LoadingState message="Loading vendor information..." />;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Claim This Vendor</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Claiming a vendor profile allows you to respond to reviews and update your company information.
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {vendor && <ClaimVendorHeader vendor={vendor} />}
          
          <ClaimVendorForm 
            vendorId={vendorId || ''}
            vendor={vendor}
            fullNameInitial={user?.user_metadata?.full_name || ''}
            existingClaim={existingClaim}
          />
        </div>
      </div>
    </div>
  );
};

export default ClaimVendor;
