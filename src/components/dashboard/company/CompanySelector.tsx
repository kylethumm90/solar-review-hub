
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanySelectorProps {
  companies: any[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ 
  companies = [], // Provide default empty array
  selectedIndex = 0, 
  onSelect 
}) => {
  // Don't render if there are no companies or only one company
  if (!companies || !Array.isArray(companies) || companies.length <= 1) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Select Company</CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedIndex.toString()} 
          onValueChange={(value) => onSelect(parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company, index) => (
              <SelectItem key={company?.id || index} value={index.toString()}>
                {company?.name || `Company ${index + 1}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default CompanySelector;
