
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import CompanyStatus from './CompanyStatus';
import ReviewsSummary from './ReviewsSummary';
import ClaimInformation from './ClaimInformation';

interface CompanyDashboardProps {
  company: {
    id: string;
    name: string;
    is_verified: boolean;
    last_verified?: string;
  };
  claim: {
    full_name: string;
    job_title?: string;
    company_email?: string;
  };
  reviewsCount: number;
}

const CompanyDashboard = ({ company, claim, reviewsCount }: CompanyDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CompanyStatus 
        isVerified={company.is_verified} 
        lastVerified={company.last_verified} 
      />
      
      <ReviewsSummary reviewCount={reviewsCount} />
      
      <ClaimInformation 
        fullName={claim.full_name}
        jobTitle={claim.job_title}
        companyEmail={claim.company_email}
      />
    </div>
  );
};

export default CompanyDashboard;
