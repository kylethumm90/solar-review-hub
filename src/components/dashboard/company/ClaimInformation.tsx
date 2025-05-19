
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClaimInformationProps {
  fullName: string;
  jobTitle?: string;
  companyEmail?: string;
}

const ClaimInformation = ({ fullName, jobTitle, companyEmail }: ClaimInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium">{fullName}</p>
        {jobTitle && <p className="text-sm text-muted-foreground">{jobTitle}</p>}
        {companyEmail && <p className="text-sm text-muted-foreground">{companyEmail}</p>}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">Edit Information</Button>
      </CardFooter>
    </Card>
  );
};

export default ClaimInformation;
