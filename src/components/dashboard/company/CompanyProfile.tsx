
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface CompanyProfileProps {
  company: {
    name: string;
    description?: string;
    website?: string;
    type?: string;
  };
}

const CompanyProfile = ({ company }: CompanyProfileProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
        <CardDescription>Manage your company's public information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Company Name</h3>
            <p>{company.name}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium mb-1">Description</h3>
            <p>{company.description || 'No description provided'}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium mb-1">Website</h3>
            <p>{company.website || 'No website provided'}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium mb-1">Type</h3>
            <p>{company.type}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Edit Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyProfile;
