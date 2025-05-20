
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CompanyHeader from './CompanyHeader';
import CompanyProfile from './CompanyProfile';
import ReviewsSummary from './ReviewsSummary';
import ReviewsList from './ReviewsList';
import ClaimInformation from './ClaimInformation';

interface CompanyDashboardContentProps {
  company: {
    id: string;
    name: string;
    description?: string;
    website?: string;
    type?: string;
    logo_url?: string;
    operating_states?: string[];
    status?: string;
  };
  claim: {
    full_name: string;
    job_title?: string;
    company_email?: string;
  };
  reviews: any[];
}

const CompanyDashboardContent: React.FC<CompanyDashboardContentProps> = ({ 
  company, 
  claim, 
  reviews 
}) => {
  return (
    <div className="container mx-auto">
      <CompanyHeader 
        companyName={company.name} 
        companyId={company.id} 
      />
      
      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <CompanyProfile company={company} />
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ReviewsSummary reviewCount={reviews.length} />
            </div>
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
                <ReviewsList reviews={reviews} />
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="claims" className="mt-6">
          <ClaimInformation 
            fullName={claim.full_name} 
            jobTitle={claim.job_title}
            companyEmail={claim.company_email} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDashboardContent;
