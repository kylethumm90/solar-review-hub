
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CompanyDashboardContent from '@/components/dashboard/company/CompanyDashboardContent';
import UnauthorizedMessage from '@/components/dashboard/company/UnauthorizedMessage';
import NoAccessMessage from '@/components/dashboard/company/NoAccessMessage';
import { useCompanyData } from '@/hooks/useCompanyData';
import CompanySelector from '@/components/dashboard/company/CompanySelector';

const DashboardMyCompany = () => {
  const { user } = useAuth();
  const { 
    loading, 
    currentClaim, 
    currentCompany, 
    reviews, 
    companies,
    selectedClaimIndex,
    selectCompany,
    totalClaimedCompanies
  } = useCompanyData();
  
  if (!user) {
    return <UnauthorizedMessage />;
  }
  
  if (loading) {
    return <LoadingSpinner message="Loading company dashboard..." />;
  }
  
  if (!currentClaim || !currentCompany) {
    return <NoAccessMessage />;
  }

  // Ensure we have valid arrays for the selector
  const validCompanies = Array.isArray(companies) ? companies : [];
  const hasMultipleCompanies = validCompanies.length > 1;
  
  return (
    <div className="container mx-auto py-4">
      {hasMultipleCompanies && (
        <CompanySelector 
          companies={validCompanies}
          selectedIndex={selectedClaimIndex}
          onSelect={selectCompany}
        />
      )}
      
      <CompanyDashboardContent 
        company={currentCompany}
        claim={currentClaim}
        reviews={Array.isArray(reviews) ? reviews : []}
      />
    </div>
  );
};

export default DashboardMyCompany;
