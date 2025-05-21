
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import CompanyStatus from './CompanyStatus';
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
    <div className="space-y-6">
      {/* Verification Status Card */}
      <CompanyStatus 
        isVerified={company.is_verified} 
        lastVerified={company.last_verified} 
      />
      
      {/* Reviews Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Review Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">Total Reviews</span>
              <span className="font-semibold">{reviewsCount}</span>
            </div>
            
            <div className="text-center mt-2">
              <Button 
                asChild 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                <a href="#reviews">
                  View All Reviews <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Claim Information Card */}
      <ClaimInformation 
        fullName={claim.full_name}
        jobTitle={claim.job_title}
        companyEmail={claim.company_email}
      />
    </div>
  );
};

export default CompanyDashboard;
