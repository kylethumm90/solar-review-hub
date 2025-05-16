
import { useState, useEffect } from 'react';
import { ClaimRequest } from '@/components/admin/claims/types';
import { fetchClaimRequests, updateClaimStatus } from '@/services/ClaimService';

export const useClaimRequests = () => {
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>("pending");
  const pageSize = 10;

  const loadClaimRequests = async (page: number, status: string | null = null) => {
    setLoading(true);
    try {
      const { claims: claimsData, totalPages: pages } = await fetchClaimRequests(page, pageSize, status);
      setClaims(claimsData);
      setTotalPages(pages);
    } catch (error) {
      // Error is already handled in the service
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaimRequests(currentPage, activeFilter);
  }, [currentPage, activeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (status: string | null) => {
    setActiveFilter(status);
    setCurrentPage(1);
  };

  const handleActionComplete = () => {
    loadClaimRequests(currentPage, activeFilter);
  };

  return {
    claims,
    loading,
    currentPage,
    totalPages,
    activeFilter,
    handlePageChange,
    handleFilterChange,
    handleActionComplete
  };
};
