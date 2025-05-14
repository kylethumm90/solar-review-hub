
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { InfoIcon } from 'lucide-react';

const ClaimVendor = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [jobTitle, setJobTitle] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  
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
        
        // Check if there's an existing pending claim
        if (user) {
          const { data: claimData, error: claimError } = await supabase
            .from('claims')
            .select('*')
            .eq('company_id', vendorId)
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .maybeSingle();
            
          if (!claimError && claimData) {
            toast.info('You already have a pending claim for this vendor');
            navigate(`/vendors/${vendorId}`);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching vendor info:', error);
        toast.error('Vendor not found.');
        navigate('/vendors');
      } finally {
        setLoading(false);
      }
    }
    
    fetchVendorInfo();
  }, [vendorId, navigate, user]);
  
  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to claim a vendor');
      navigate('/login', { state: { from: { pathname: `/claim/${vendorId}` } } });
      return;
    }
    
    if (!companyEmail.includes('@')) {
      toast.error('Please enter a valid company email address');
      return;
    }
    
    // Basic validation for company email based on vendor website
    if (vendor.website) {
      const vendorDomain = vendor.website.replace('http://', '').replace('https://', '').split('/')[0];
      const emailDomain = companyEmail.split('@')[1];
      
      if (emailDomain !== vendorDomain && !companyEmail.endsWith(`.${vendorDomain}`)) {
        if (!confirm(`The email domain doesn't match the vendor's website domain. Are you sure this is the correct company email?`)) {
          return;
        }
      }
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('claims')
        .insert({
          company_id: vendorId,
          user_id: user.id,
          full_name: fullName,
          job_title: jobTitle,
          company_email: companyEmail,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast.success('Claim submitted successfully! Our team will review your request.');
      navigate(`/vendors/${vendorId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Claim This Vendor</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Claiming a vendor profile allows you to respond to reviews and update your company information.
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {vendor && (
            <div className="flex items-center mb-6">
              {vendor.logo_url ? (
                <img 
                  src={vendor.logo_url} 
                  alt={`${vendor.name} logo`}
                  className="w-12 h-12 object-contain rounded-lg mr-4"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg mr-4">
                  <span className="text-xl text-gray-400">{vendor.name.charAt(0)}</span>
                </div>
              )}
              <h2 className="text-xl font-semibold">{vendor.name}</h2>
            </div>
          )}
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4 mb-6">
            <div className="flex">
              <InfoIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <div>
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  To verify your claim, please use your company email address. Our team will review your request within 1-2 business days.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmitClaim}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title*
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Your position at the company"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Email*
                </label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="your.name@company.com"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Please use your company email address matching the vendor's domain.
                </p>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  type="submit" 
                  disabled={submitting || !fullName || !jobTitle || !companyEmail}
                >
                  {submitting ? 'Submitting...' : 'Submit Claim'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimVendor;
