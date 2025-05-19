
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

interface ClaimsTableProps {
  claims: Claim[];
  isLoading: boolean;
  onApprove: (claimId: string) => void;
  onReject: (claimId: string) => void;
}

const ClaimsTable = ({ claims, isLoading, onApprove, onReject }: ClaimsTableProps) => {
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

  console.log('Rendering claims:', claims); // Add logging

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
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
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.company?.name || 'Unknown Company'}</TableCell>
                <TableCell>{claim.full_name}</TableCell>
                <TableCell>{claim.company_email}</TableCell>
                <TableCell>{claim.job_title}</TableCell>
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
