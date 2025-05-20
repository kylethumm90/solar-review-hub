
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { COMPANY_TYPES } from '@/types/company';

interface RankingsFiltersProps {
  vendorType: string;
  setVendorType: (type: string) => void;
  gradeThreshold: string;
  setGradeThreshold: (grade: string) => void;
}

const RankingsFilters: React.FC<RankingsFiltersProps> = ({
  vendorType,
  setVendorType,
  gradeThreshold,
  setGradeThreshold
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="vendor-type-filter" className="block text-sm font-medium mb-2">
              Vendor Type
            </label>
            <Select value={vendorType} onValueChange={setVendorType}>
              <SelectTrigger id="vendor-type-filter" className="w-full">
                <SelectValue placeholder="All Vendor Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendor Types</SelectItem>
                {COMPANY_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="grade-filter" className="block text-sm font-medium mb-2">
              Minimum Grade
            </label>
            <Select value={gradeThreshold} onValueChange={setGradeThreshold}>
              <SelectTrigger id="grade-filter" className="w-full">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="A+">A+ or better</SelectItem>
                <SelectItem value="A">A or better</SelectItem>
                <SelectItem value="A-">A- or better</SelectItem>
                <SelectItem value="B+">B+ or better</SelectItem>
                <SelectItem value="B">B or better</SelectItem>
                <SelectItem value="C+">C+ or better</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Commented out for future use with operating_states
          <div>
            <label htmlFor="region-filter" className="block text-sm font-medium mb-2">
              Region
            </label>
            <Select value="" onValueChange={() => {}}>
              <SelectTrigger id="region-filter" className="w-full">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Regions</SelectItem>
                <SelectItem value="northeast">Northeast</SelectItem>
                <SelectItem value="southeast">Southeast</SelectItem>
                <SelectItem value="midwest">Midwest</SelectItem>
                <SelectItem value="southwest">Southwest</SelectItem>
                <SelectItem value="west">West</SelectItem>
              </SelectContent>
            </Select>
          </div>
          */}
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingsFilters;
