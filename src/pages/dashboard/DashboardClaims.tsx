
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserClaims } from '@/hooks/useUserClaims';

const DashboardClaims = () => {
  const { claims, loading } = useUserClaims();
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">My Claims</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your claims...</p>
          </div>
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">You haven't submitted any claims yet</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Once you submit claims to become a verified vendor representative, they will appear here
          </p>
          <Button asChild className="mt-4">
            <Link to="/vendors">Browse Vendors</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {claims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  );
};

interface ClaimCardProps {
  claim: ReturnType<typeof useUserClaims>['claims'][0];
}

const ClaimCard = ({ claim }: ClaimCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center">
              {claim.company.logo_url ? (
                <img
                  src={claim.company.logo_url}
                  alt={`${claim.company.name} logo`}
                  className="h-10 w-10 object-contain rounded-md mr-3"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center mr-3">
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {claim.company.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {claim.company.name}
                </h3>
                <p className="text-sm text-gray-500">{claim.company_email}</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <p className="font-medium">{claim.job_title}</p>
            <StatusBadge status={claim.status} />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right flex items-center gap-1 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {format(new Date(claim.created_at), 'MMM d, yyyy')}
              </span>
            </div>
            
            <Button asChild variant="outline" size="sm">
              <Link to={`/vendors/${claim.company_id}`} className="flex items-center">
                View Company
                <ExternalLink size={14} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return (
        <Badge className="bg-green-500 text-white">
          ✅ Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-500 text-white">
          ❌ Rejected
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge className="bg-yellow-200 text-yellow-800">
          ⏳ Pending
        </Badge>
      );
  }
};

export default DashboardClaims;
