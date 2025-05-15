
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ClaimActionsProps {
  claimId: string;
  status: string;
  isDisabled?: boolean;
  onApprove: (claimId: string) => void;
  onReject: (claimId: string) => void;
}

const ClaimActions = ({ 
  claimId, 
  status, 
  isDisabled = false,
  onApprove, 
  onReject 
}: ClaimActionsProps) => {
  // Don't show actions for already processed claims
  if (status === 'approved' || status === 'rejected') {
    return null;
  }
  
  return (
    <div className="flex space-x-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onApprove(claimId)}
        disabled={isDisabled}
        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
        title={isDisabled ? "Company already has an approved representative" : "Approve claim"}
      >
        <Check className="h-4 w-4 mr-1" />
        Approve
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onReject(claimId)}
        disabled={isDisabled}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        title={isDisabled ? "Company already has an approved representative" : "Reject claim"}
      >
        <X className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </div>
  );
};

export default ClaimActions;
