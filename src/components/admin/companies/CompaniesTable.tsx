
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Company } from "@/types";
import CompanyStatusBadge from "./CompanyStatusBadge";

interface CompaniesTableProps {
  companies: Company[] | null;
  isLoading: boolean;
  onEditCompany: (company: Company) => void;
  onUpdateStatus: (id: string, status: string) => void;
  formatDate: (dateString: string | null) => string;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  isLoading,
  onEditCompany,
  onUpdateStatus,
  formatDate,
}) => {
  return (
    <div className="border rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading state
            Array(5).fill(0).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                {Array(7).fill(0).map((_, cellIndex) => (
                  <TableCell key={`loading-cell-${cellIndex}`}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : companies && companies.length > 0 ? (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {company.type?.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${
                    company.grade === "A" ? "bg-green-500" :
                    company.grade === "B" ? "bg-green-400" :
                    company.grade === "C" ? "bg-yellow-400" :
                    company.grade === "D" ? "bg-orange-500" :
                    company.grade === "F" ? "bg-red-500" :
                    "bg-gray-400"
                  }`}>
                    {company.grade || "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded px-2 py-1 text-sm bg-background"
                      value={company.status || "unclaimed"}
                      onChange={(e) => onUpdateStatus(company.id, e.target.value)}
                    >
                      <option value="unclaimed">Unclaimed</option>
                      <option value="verified">Verified</option>
                      <option value="certified">Certified</option>
                    </select>
                    <CompanyStatusBadge status={company.status || "unclaimed"} />
                  </div>
                </TableCell>
                <TableCell>{company.review_count || 0}</TableCell>
                <TableCell>
                  {formatDate(company.last_verified)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditCompany(company)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <a href={`/vendors/${company.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </a>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No companies found matching your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
