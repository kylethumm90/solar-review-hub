
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle } from 'lucide-react';

interface CompanyHeaderProps {
  companyName: string;
  companyId: string;
}

const CompanyHeader = ({ companyName, companyId }: CompanyHeaderProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{companyName}</h1>
          <p className="text-muted-foreground">Company Dashboard</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="mr-4" variant="outline">
            <Link to={`/vendors/${companyId}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Profile
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium">Want to stand out from competitors?</h3>
            <p className="text-sm">
              Get your company verified to build trust and attract more customers. 
              <Link to="/pricing" className="text-blue-600 hover:underline ml-1">Learn about verification</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyHeader;
