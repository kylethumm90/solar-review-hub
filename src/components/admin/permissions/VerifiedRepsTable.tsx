
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

interface Claim {
  id: string;
  user_id: string;
  company_id: string;
  full_name: string;
  job_title: string;
  company_email: string;
  status: string;
  created_at: string;
  company: {
    id: string;
    name: string;
    is_verified: boolean;
  };
}

interface VerifiedRepsTableProps {
  claims: Claim[];
  isLoading: boolean;
  onRemoveRep: (claimId: string, companyId: string) => Promise<void>;
  onReassignCompany: (claimId: string, userId: string, companyId: string) => Promise<void>;
}

const VerifiedRepsTable = ({ claims, isLoading, onRemoveRep, onReassignCompany }: VerifiedRepsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Representative</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No verified representatives found
              </TableCell>
            </TableRow>
          ) : (
            claims.map((claim) => (
              <TableRow key={claim.id} className="hover:bg-muted/40">
                <TableCell className="font-medium">{claim.company?.name || "Unknown Company"}</TableCell>
                <TableCell>{claim.full_name}</TableCell>
                <TableCell>{claim.company_email}</TableCell>
                <TableCell>{claim.job_title}</TableCell>
                <TableCell>
                  {claim.company?.is_verified ? (
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <X className="h-3 w-3" /> Not Verified
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveRep(claim.id, claim.company_id)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReassignCompany(claim.id, claim.user_id, claim.company_id)}
                    >
                      Reassign
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VerifiedRepsTable;
