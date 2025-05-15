import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Claim } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ClaimVendorFormProps = {
  vendorId: string;
  vendor: any;
  fullNameInitial: string;
  existingClaim: Claim | null;
};

const ClaimVendorForm = ({
  vendorId,
  vendor,
  fullNameInitial,
  existingClaim
}: ClaimVendorFormProps) => {
  const [fullName, setFullName] = useState(fullNameInitial || '');
  const [jobTitle, setJobTitle] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    if (!fullName || !jobTitle || !companyEmail) {
      toast.error('Please fill out all fields.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('claims')
        .insert({
          user_id: supabase.auth.currentUser?.id,
          company_id: vendorId,
          full_name: fullName,
          job_title: jobTitle,
          company_email: companyEmail,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast.success('Claim request submitted successfully!');
      // Optionally, redirect or show a success message
    } catch (error: any) {
      console.error('Error submitting claim:', error);
      toast.error(error.message || 'An error occurred while submitting your claim.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (existingClaim && existingClaim.status === 'pending') {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600 dark:text-gray-300">
          You have already submitted a claim for this vendor. It is currently under review.
        </p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your Full Name"
          required
        />
      </div>
      <div>
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          type="text"
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Your Job Title"
          required
        />
      </div>
      <div>
        <Label htmlFor="companyEmail">Company Email</Label>
        <Input
          type="email"
          id="companyEmail"
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          placeholder="Your Company Email"
          required
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Claim Request'}
      </Button>
    </form>
  );
};

export default ClaimVendorForm;
