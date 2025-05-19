
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CompanyStatusProps {
  isVerified: boolean;
  lastVerified?: string;
}

const CompanyStatus = ({ isVerified, lastVerified }: CompanyStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${isVerified ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span>{isVerified ? 'Verified' : 'Unverified'}</span>
        </div>
        {isVerified && lastVerified && (
          <p className="text-xs text-muted-foreground">
            Last verified: {new Date(lastVerified).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      <CardFooter>
        {!isVerified && (
          <Button asChild size="sm">
            <Link to="/pricing">Get Verified</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CompanyStatus;
