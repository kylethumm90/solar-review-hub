
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import ModerationActions from '../ModerationActions';
import ClaimStatusBadge from './ClaimStatusBadge';
import { ClaimRequest } from './types';

type ClaimsTableViewProps = {
  claims: ClaimRequest[];
  onActionComplete: () => void;
};

const ClaimsTableView = ({ claims, onActionComplete }: ClaimsTableViewProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell className="font-medium">{claim.company?.name || 'Unknown'}</TableCell>
              <TableCell>{claim.full_name}</TableCell>
              <TableCell>{claim.job_title}</TableCell>
              <TableCell>{claim.company_email}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(claim.created_at), { addSuffix: true })}</TableCell>
              <TableCell>
                <ClaimStatusBadge status={claim.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {claim.status === 'pending' && (
                    <ModerationActions 
                      id={claim.id} 
                      type="claim" 
                      companyId={claim.company?.id}
                      userId={claim.user_id}
                      onActionComplete={onActionComplete} 
                    />
                  )}
                  <a 
                    href={`/admin/users/${claim.user_id}`} 
                    className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
                    title="View User Profile"
                  >
                    🔍
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClaimsTableView;
