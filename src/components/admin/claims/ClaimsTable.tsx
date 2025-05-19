
import { Claim } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import ClaimActions from "./ClaimActions";
import StatusBadge from "./StatusBadge";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClaimsTableProps {
  claims: Claim[];
  isLoading: boolean;
  onApprove: (claimId: string) => void;
  onReject: (claimId: string) => void;
}

const ClaimsTable = ({ claims, isLoading, onApprove, onReject }: ClaimsTableProps) => {
  // Additional check for data quality issues
  const hasDataIssues = claims.some(claim => !claim.id || !claim.status || !claim.company_id);
  console.log('Rendering claims:', claims); // Add logging
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4">Loading claims...</p>
        </div>
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/10">
        <p className="text-muted-foreground mb-2">No claims found</p>
        <p className="text-sm text-muted-foreground">Try selecting a different filter or check if claims have been submitted</p>
      </div>
    );
  }

  // Check if a company already has an approved claim
  const companyHasApprovedClaim = (companyId: string): boolean => {
    return claims.some(claim => 
      claim.company_id === companyId && 
      claim.status === 'approved'
    );
  };

  // Count claims by status
  const pendingCount = claims.filter(c => c.status === 'pending').length;
  const approvedCount = claims.filter(c => c.status === 'approved').length;
  const rejectedCount = claims.filter(c => c.status === 'rejected').length;

  return (
    <div className="border rounded-md">
      <div className="bg-muted/20 p-3 flex items-center justify-between border-b">
        <h3 className="text-sm font-medium">
          Showing {claims.length} claim{claims.length !== 1 ? 's' : ''}
        </h3>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
            {pendingCount} pending
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
            {approvedCount} approved
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
            {rejectedCount} rejected
          </Badge>
        </div>
      </div>
      
      {hasDataIssues && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 text-yellow-800 dark:text-yellow-200 text-sm flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Warning: Some claims have missing or invalid data which may affect display
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Company</TableHead>
            <TableHead>Claimed By</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => {
            const hasApprovedClaim = companyHasApprovedClaim(claim.company_id);
            const isAlreadyApproved = claim.status === 'approved';
            
            return (
              <TableRow key={claim.id} className={claim.status === 'pending' ? 'bg-amber-50/50' : ''}>
                <TableCell className="font-medium">
                  {claim.company?.name || 
                    <span className="text-red-500">Unknown Company</span>}
                </TableCell>
                <TableCell>{claim.full_name || 'Unknown'}</TableCell>
                <TableCell>{claim.company_email || 'Unknown'}</TableCell>
                <TableCell>{claim.job_title || 'Unknown'}</TableCell>
                <TableCell>
                  {claim.created_at && formatDistanceToNow(new Date(claim.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={claim.status} />
                </TableCell>
                <TableCell className="text-right">
                  <ClaimActions 
                    claimId={claim.id}
                    status={claim.status}
                    isDisabled={!isAlreadyApproved && hasApprovedClaim}
                    onApprove={onApprove}
                    onReject={onReject}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClaimsTable;
