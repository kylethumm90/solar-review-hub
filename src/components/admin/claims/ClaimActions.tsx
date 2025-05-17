
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
  // Define what actions to show based on current status
  const showApproveButton = status === 'pending' || status === 'rejected';
  const showRejectButton = status === 'pending' || status === 'approved';
  
  // If no actions are available, don't render anything
  if (!showApproveButton && !showRejectButton) {
    return null;
  }
  
  return (
    <div className="flex space-x-2 justify-end">
      {showApproveButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onApprove(claimId)}
          disabled={isDisabled}
          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
          title={isDisabled 
            ? "Company already has an approved representative" 
            : status === 'rejected' 
              ? "Change to approved" 
              : "Approve claim"
          }
        >
          <Check className="h-4 w-4 mr-1" />
          {status === 'rejected' ? 'Change' : 'Approve'}
        </Button>
      )}
      
      {showRejectButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReject(claimId)}
          disabled={isDisabled}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          title={isDisabled 
            ? "Company already has an approved representative" 
            : status === 'approved' 
              ? "Change to rejected" 
              : "Reject claim"
          }
        >
          <X className="h-4 w-4 mr-1" />
          {status === 'approved' ? 'Change' : 'Reject'}
        </Button>
      )}
    </div>
  );
};

export default ClaimActions;
