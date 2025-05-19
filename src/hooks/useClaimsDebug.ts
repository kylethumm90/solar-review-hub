
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useRoleSync } from './useRoleSync';

export function useClaimsDebug() {
  const [debugMode, setDebugMode] = useState(false);
  const { user } = useAuth();
  const { syncUserRoleToDatabase } = useRoleSync();
  
  // Verify all claims without filtering for debugging
  const fetchAllClaims = async () => {
    try {
      console.log("[ClaimsDebug] Performing DIRECT DB CHECK to bypass any filters");
      
      // Make sure to synchronize user role if in debug mode
      if (debugMode && user) {
        await syncUserRoleToDatabase(user);
      }
      
      const { data, error } = await supabase
        .from('claims')
        .select(`
          id,
          user_id,
          company_id,
          status,
          full_name,
          job_title,
          company_email,
          created_at,
          company:companies(id, name, type, is_verified, logo_url)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('[ClaimsDebug] Error in direct DB check:', error);
        return;
      }
      
      console.log('[ClaimsDebug] Direct DB check - All claims:', data);
      console.log('[ClaimsDebug] Direct DB check - Pending claims:', data?.filter(c => c.status === 'pending'));
      
      return data;
    } catch (err) {
      console.error('[ClaimsDebug] Error in direct DB check:', err);
    }
  };
  
  // Run a direct DB check on mount and sync user role
  useEffect(() => {
    if (user && debugMode) {
      // Sync user role on component mount
      syncUserRoleToDatabase(user).then(() => {
        // After sync, fetch all claims
        fetchAllClaims();
      });
    }
  }, [user, debugMode]);
  
  return {
    debugMode,
    setDebugMode,
    fetchAllClaims
  };
}
