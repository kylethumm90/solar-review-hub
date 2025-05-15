
import { Badge } from "@/components/ui/badge";
import { Check, X, Circle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="default" className="bg-green-500">
          <Check className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    
    case 'rejected':
      return (
        <Badge variant="default" className="bg-red-500">
          <X className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    
    case 'pending':
    default:
      return (
        <Badge variant="secondary" className="bg-orange-200 text-orange-800">
          <Circle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
  }
};

export default StatusBadge;
