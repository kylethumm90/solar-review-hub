
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import CompanyLogo from "./CompanyLogo";
import CompanyProfileForm from "./CompanyProfileForm";
import { useCompanyUpdate } from "@/hooks/useCompanyUpdate";
import { Badge } from "@/components/ui/badge";
import { getStateNames } from "@/data/us-states";
import { CompanyDataPartial } from "@/types/company";

interface CompanyProfileProps {
  company: CompanyDataPartial;
}

const CompanyProfile = ({ company }: CompanyProfileProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { formatCompanyType, US_STATES } = useCompanyUpdate(company);
  
  const stateNames = getStateNames(company.operating_states);
  const showStates = (company.type === 'epc' || company.type === 'sales_org') && 
                     stateNames.length > 0;
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
        <CardDescription>Manage your company's public information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start mb-6">
          {/* Logo Display */}
          <CompanyLogo 
            logoUrl={company.logo_url} 
            companyName={company.name}
            className="mr-6"
          />
          
          {/* Company Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{company.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatCompanyType(company.type || '')}
            </p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" 
                className="text-primary hover:underline text-sm mt-1 inline-block">
                {company.website}
              </a>
            )}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Description */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {company.description || 'No description provided'}
          </p>
        </div>
        
        {/* Operating States (only shown for EPCs and Sales Organizations) */}
        {showStates && (
          <>
            <Separator className="my-4" />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">States of Operation</h3>
              <div className="flex flex-wrap gap-1">
                {stateNames.map((state) => (
                  <Badge key={state} variant="secondary">
                    {state}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => setDialogOpen(true)} className="w-full">
          <Edit className="h-4 w-4 mr-2" /> Edit Company Profile
        </Button>
      </CardFooter>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
            <DialogDescription>
              Update your company's information and logo. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <CompanyProfileForm 
            company={company} 
            onCancel={() => setDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CompanyProfile;
