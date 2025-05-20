
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Medal } from "lucide-react";
import { COMPANY_STATUS, getStatusDisplayName } from "@/types/company";

interface CompanyStatusProps {
  status?: string;
  lastVerified?: string;
}

const CompanyStatus = ({ status = COMPANY_STATUS.UNCLAIMED, lastVerified }: CompanyStatusProps) => {
  const isVerified = status === COMPANY_STATUS.VERIFIED;
  const isCertified = status === COMPANY_STATUS.CERTIFIED;
  const isActive = isVerified || isCertified;
  
  const StatusIcon = isCertified ? Medal : CheckCircle;
  const statusColor = isCertified ? 'bg-green-500' : isVerified ? 'bg-blue-500' : 'bg-gray-400';
  const statusText = getStatusDisplayName(status) || "Unclaimed";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${statusColor}`}></div>
          <div className="flex items-center">
            <span>{statusText}</span>
            {isActive && (
              <StatusIcon className={`ml-2 h-4 w-4 ${isCertified ? 'text-green-500' : 'text-blue-500'}`} />
            )}
          </div>
        </div>
        {isActive && lastVerified && (
          <p className="text-xs text-muted-foreground">
            Last verified: {new Date(lastVerified).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      <CardFooter>
        {!isActive && (
          <Button asChild size="sm">
            <Link to="/pricing">Get Verified</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CompanyStatus;
