import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Company } from "@/types";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import EditCompanyModal from "@/components/admin/companies/EditCompanyModal";

type CompanyFilter = {
  name: string;
  type: string | null;
  status: string | null;
  grade: string | null;
};

// Define an interface that matches the actual data returned from Supabase
interface CompanyWithReviewCount extends Omit<Company, 'reviews'> {
  reviews?: { count: number }[];
  review_count?: number;
}

const CompaniesPage = () => {
  const [filters, setFilters] = useState<CompanyFilter>({
    name: "",
    type: null,
    status: null,
    grade: null,
  });
  
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all company types for the filter dropdown
  const companyTypes = ["epc", "sales_org", "lead_gen", "software", "other"];
  const companyStatuses = ["unclaimed", "verified", "certified"];
  const grades = ["A", "B", "C", "D", "F"];

  const { data: companies, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "companies", filters],
    queryFn: async () => {
      // Build the query based on filters
      let query = supabase.from("companies").select(`
        *,
        reviews:reviews(count)
      `);

      // Apply filters
      if (filters.name) {
        query = query.ilike("name", `%${filters.name}%`);
      }
      
      if (filters.type) {
        query = query.eq("type", filters.type);
      }
      
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      
      if (filters.grade) {
        query = query.eq("grade", filters.grade);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Process the data to extract review counts and transform to Company type
      return (data as CompanyWithReviewCount[]).map((company) => {
        let reviewCount = 0;
        if (company.reviews && Array.isArray(company.reviews)) {
          reviewCount = company.reviews.length > 0 ? company.reviews[0].count : 0;
        }

        // Create a proper Company object with the review_count property
        const processedCompany: Company = {
          id: company.id,
          name: company.name,
          description: company.description,
          website: company.website,
          logo_url: company.logo_url,
          type: company.type,
          is_verified: company.is_verified,
          status: company.status,
          grade: company.grade,
          last_verified: company.last_verified,
          created_at: company.created_at,
          review_count: reviewCount,
          // We don't have the full Review[] objects here, so we just set it to undefined
          reviews: undefined
        };

        return processedCompany;
      });
    },
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const updateObj: any = { 
        status: status,
        last_verified: new Date().toISOString()
      };
      
      // For backward compatibility, also update is_verified
      if (status === 'verified' || status === 'certified') {
        updateObj.is_verified = true;
      } else {
        updateObj.is_verified = false;
      }
      
      const { error } = await supabase
        .from("companies")
        .update(updateObj)
        .eq("id", id);

      if (error) {
        toast.error(`Failed to update status: ${error.message}`);
        throw error;
      }

      toast.success(`Company status updated successfully`);
      refetch();
    } catch (err) {
      console.error("Error updating company status:", err);
    }
  };

  const handleEditClick = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleEditSave = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
    refetch();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'certified':
        return <Badge className="bg-green-500 text-white">Certified</Badge>;
      case 'verified':
        return <Badge className="bg-blue-500 text-white">Verified</Badge>;
      default:
        return <Badge className="bg-gray-300 text-gray-700">Unclaimed</Badge>;
    }
  };

  if (error) {
    return <div className="p-6">Error loading companies: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Companies Management</h1>
      </div>

      {/* Search and Filters */}
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

      {/* Companies Table */}
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
                        onChange={(e) => handleUpdateStatus(company.id, e.target.value)}
                      >
                        <option value="unclaimed">Unclaimed</option>
                        <option value="verified">Verified</option>
                        <option value="certified">Certified</option>
                      </select>
                      {getStatusBadge(company.status || "unclaimed")}
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
                        onClick={() => handleEditClick(company)}
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
      
      {/* Edit Modal */}
      {editingCompany && (
        <EditCompanyModal
          company={editingCompany}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCompany(null);
          }}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default CompaniesPage;
