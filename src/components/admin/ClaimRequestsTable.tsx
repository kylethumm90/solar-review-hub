
import { useClaimRequests } from '@/hooks/useClaimRequests';
import ClaimFilterTabs from './claims/ClaimFilterTabs';
import ClaimsTableView from './claims/ClaimsTableView';
import TableStateDisplay from './common/TableStateDisplay';
import TablePagination from './common/TablePagination';

const ClaimRequestsTable = () => {
  const {
    claims,
    loading,
    currentPage,
    totalPages,
    activeFilter,
    handlePageChange,
    handleFilterChange,
    handleActionComplete
  } = useClaimRequests();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Claim Requests</h3>
      
      <ClaimFilterTabs 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
      />
      
      <TableStateDisplay 
        loading={loading} 
        isEmpty={claims.length === 0}
        emptyMessage={activeFilter 
          ? `No ${activeFilter} claim requests found.` 
          : "No claim requests found."} 
      />
      
      {!loading && claims.length > 0 && (
        <>
          <ClaimsTableView 
            claims={claims} 
            onActionComplete={handleActionComplete} 
          />

          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ClaimRequestsTable;
