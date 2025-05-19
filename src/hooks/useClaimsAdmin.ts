
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useClaimsFetcher } from './useClaimsFetcher';
import { useClaimActions } from './useClaimActions';
import { useClaimsDebug } from './useClaimsDebug';
import { useRoleSync } from './useRoleSync';

export function useClaimsAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const { syncUserRoleToDatabase } = useRoleSync();
  const { debugMode, setDebugMode, fetchAllClaims } = useClaimsDebug();
  
  const {
    claimsData,
    filteredClaims: claims,
    isLoading,
    refetch
  } = useClaimsFetcher(activeTab, searchQuery, debugMode);
  
  const { handleClaimAction } = useClaimActions(refetch);
  
  // Log tab changes to help debug filtering issues
  useEffect(() => {
    console.log(`[ClaimsAdmin] Active tab changed to: ${activeTab}`);
  }, [activeTab]);
  
  // Log search queries to track filtering behavior
  useEffect(() => {
    if (searchQuery) {
      console.log(`[ClaimsAdmin] Search query updated: "${searchQuery}"`);
    }
  }, [searchQuery]);
  
  // Sync user role on component mount
  useEffect(() => {
    if (user) {
      syncUserRoleToDatabase(user).then(() => {
        // After sync, fetch all claims
        fetchAllClaims();
      });
    }
  }, [user]);
  
  return {
    claims,
    rawClaimsData: claimsData,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleClaimAction,
    debugMode,
    setDebugMode,
    refetchAllClaims: fetchAllClaims
  };
}
