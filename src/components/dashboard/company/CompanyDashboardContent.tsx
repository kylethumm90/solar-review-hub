
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CompanyHeader from '@/components/dashboard/company/CompanyHeader';
import CompanyProfile from '@/components/dashboard/company/CompanyProfile';
import CompanyDashboard from '@/components/dashboard/company/CompanyDashboard';
import ReviewsList from '@/components/dashboard/company/ReviewsList';

interface CompanyDashboardContentProps {
  company: any;
  claim: any;
  reviews: any[];
}

const CompanyDashboardContent = ({ company, claim, reviews }: CompanyDashboardContentProps) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <CompanyHeader 
        companyName={company.name} 
        companyId={company.id}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left column - Company Profile */}
        <div className="lg:col-span-2">
          <CompanyProfile company={company} />
        </div>
        
        {/* Right column - Company Dashboard and Stats */}
        <div>
          <CompanyDashboard 
            company={company}
            claim={claim}
            reviewsCount={reviews.length}
          />
        </div>
      </div>
      
      {/* Reviews Section - Full Width */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>Reviews from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewsList reviews={reviews} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDashboardContent;
