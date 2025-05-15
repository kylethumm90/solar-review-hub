
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { InfoIcon } from 'lucide-react';

interface ClaimVendorFormProps {
  vendorId: string;
  vendor: any;
  fullNameInitial: string;
  existingClaim?: any;
}

const ClaimVendorForm: React.FC<ClaimVendorFormProps> = ({
  vendorId,
  vendor,
  fullNameInitial,
  existingClaim,
}) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState(fullNameInitial);
  const [jobTitle, setJobTitle] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          user_id: (await supabase.auth.getUser()).data.user?.id,
          full_name: fullName,
          job_title: jobTitle,
          company_email: companyEmail,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast.success('Claim submitted successfully! Our team will review your request within 1-2 business days.');
      navigate(`/vendors/${vendorId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  if (existingClaim && existingClaim.status === 'pending') {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4">
        <p className="text-yellow-800 dark:text-yellow-300">
          You already have a pending claim for this vendor. Our team is reviewing your request and will respond within 1-2 business days.
        </p>
      </div>
    );
  }

  return (
    <>
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
    </>
  );
};

export default ClaimVendorForm;
