
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanySelectorProps {
  companies: any[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ 
  companies, 
  selectedIndex, 
  onSelect 
}) => {
  if (!companies || companies.length <= 1) return null;

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
              <SelectItem key={company.id} value={index.toString()}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default CompanySelector;
