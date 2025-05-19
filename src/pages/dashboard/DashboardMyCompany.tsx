
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CompanyDashboardContent from '@/components/dashboard/company/CompanyDashboardContent';
import UnauthorizedMessage from '@/components/dashboard/company/UnauthorizedMessage';
import NoAccessMessage from '@/components/dashboard/company/NoAccessMessage';
import { useCompanyData } from '@/hooks/useCompanyData';

const DashboardMyCompany = () => {
  const { user } = useAuth();
  const { loading, claim, company, reviews } = useCompanyData();
  
  if (!user) {
    return <UnauthorizedMessage />;
  }
  
  if (loading) {
    return <LoadingSpinner message="Loading company dashboard..." />;
  }
  
  if (!claim || !company) {
    return <NoAccessMessage />;
  }
  
  return (
    <CompanyDashboardContent 
      company={company}
      claim={claim}
      reviews={reviews}
    />
  );
};

export default DashboardMyCompany;
