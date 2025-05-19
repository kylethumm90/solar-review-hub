
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useHasApprovedClaim = () => {
  const { user, isAdmin } = useAuth();
  const [hasApprovedClaim, setHasApprovedClaim] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkForApprovedClaims = async () => {
      if (!user) {
        setHasApprovedClaim(false);
        setLoading(false);
        return;
      }

      // Check if user is admin first
      const userIsAdmin = isAdmin?.() || user?.user_metadata?.role === 'admin';
      if (userIsAdmin) {
        console.log('User is admin - granting company access');
        setHasApprovedClaim(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('claims')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'approved')
          .limit(1);

        if (error) {
          console.error('Error checking for approved claims:', error);
          setHasApprovedClaim(false);
        } else {
          setHasApprovedClaim(data && data.length > 0);
        }
      } catch (error) {
        console.error('Error in checkForApprovedClaims:', error);
        setHasApprovedClaim(false);
      } finally {
        setLoading(false);
      }
    };

    checkForApprovedClaims();
  }, [user, isAdmin]);

  return { hasApprovedClaim, loading };
};
