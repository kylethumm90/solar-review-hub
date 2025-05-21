
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type CompanyFilter = {
  name: string;
  type: string | null;
  status: string | null;
  grade: string | null;
};

type CompanyFiltersProps = {
  filters: CompanyFilter;
  setFilters: React.Dispatch<React.SetStateAction<CompanyFilter>>;
  companyTypes: string[];
  companyStatuses: string[];
  grades: string[];
};

const CompanyFilters: React.FC<CompanyFiltersProps> = ({
  filters,
  setFilters,
  companyTypes,
  companyStatuses,
  grades,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search companies by name..."
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="w-full"
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Company Type Filter */}
        <select
          className="border rounded px-3 py-2 bg-background"
          value={filters.type || ""}
          onChange={(e) => setFilters({ ...filters, type: e.target.value || null })}
        >
          <option value="">All Types</option>
          {companyTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace("_", " ").charAt(0).toUpperCase() + type.replace("_", " ").slice(1)}
            </option>
          ))}
        </select>
        
        {/* Status Filter */}
        <select
          className="border rounded px-3 py-2 bg-background"
          value={filters.status || ""}
          onChange={(e) => setFilters({ ...filters, status: e.target.value || null })}
        >
          <option value="">All Statuses</option>
          {companyStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        
        {/* Grade Filter */}
        <select
          className="border rounded px-3 py-2 bg-background"
          value={filters.grade || ""}
          onChange={(e) => setFilters({ ...filters, grade: e.target.value || null })}
        >
          <option value="">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              Grade {grade}
            </option>
          ))}
        </select>
        
        {/* Reset Filters */}
        <Button
          variant="outline"
          onClick={() => setFilters({
            name: "",
            type: null,
            status: null,
            grade: null
          })}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default CompanyFilters;
