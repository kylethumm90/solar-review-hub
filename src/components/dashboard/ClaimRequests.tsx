
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Claim } from '@/types';
import { formatDate } from '@/lib/utils';
import { Building } from 'lucide-react';

interface ClaimRequestsProps {
  claims: Claim[];
  isLoading: boolean;
}

const ClaimRequests = ({ claims, isLoading }: ClaimRequestsProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Claim Requests</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <div className="animate-pulse space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Claim Requests</h2>
      
      {claims.length > 0 ? (
        <div className="space-y-4">
          {claims.slice(0, 3).map((claim) => (
            <div key={claim.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <h3 className="font-medium">
                {claim.company?.name || 'Unknown Company'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {formatDate(claim.created_at)}
              </p>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${claim.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                  claim.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : 
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}`}>
                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
              </div>
            </div>
          ))}
          {claims.length > 3 && (
            <Button asChild variant="link" className="w-full">
              <Link to="/dashboard/claims">View All Claims</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <Building className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No company claims submitted</p>
          <Button asChild variant="link" className="mt-2">
            <Link to="/vendors">Claim Your Company</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClaimRequests;
