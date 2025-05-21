
import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditCompanyModal from "@/components/admin/companies/EditCompanyModal";
import CompaniesTable from "@/components/admin/companies/CompaniesTable";
import CompanyFilters from "@/components/admin/companies/CompanyFilters";
import { useCompaniesAdmin } from "@/hooks/useCompaniesAdmin";

const CompaniesPage = () => {
  const {
    filters,
    setFilters,
    companies,
    isLoading,
    error,
    companyTypes,
    companyStatuses,
    grades,
    editingCompany,
    isModalOpen,
    setIsModalOpen,
    setEditingCompany,
    handleUpdateStatus,
    handleEditClick,
    handleEditSave,
    formatDate
  } = useCompaniesAdmin();

  if (error) {
    return <div className="p-6">Error loading companies: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Companies Management</h1>
      </div>

      {/* Search and Filters */}
      <CompanyFilters 
        filters={filters}
        setFilters={setFilters}
        companyTypes={companyTypes}
        companyStatuses={companyStatuses}
        grades={grades}
      />

      {/* Companies Table */}
      <CompaniesTable 
        companies={companies || null}
        isLoading={isLoading}
        onEditCompany={handleEditClick}
        onUpdateStatus={handleUpdateStatus}
        formatDate={formatDate}
      />
      
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
