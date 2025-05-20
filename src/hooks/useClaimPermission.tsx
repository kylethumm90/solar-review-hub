
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const useClaimPermission = (companyId: string, companyType?: string) => {
  const { user } = useAuth();
  
  // TODO: Re-enable operating_states once we add proper null guards and controlled default values
  // Since we're temporarily disabling operating_states, always return false for showStatesField
  const showStatesField = false;
  
  /*
  const [showStatesField, setShowStatesField] = useState(false);
  
  // Check if company type is EPC or Sales Org to determine if states field should be shown
  const isEligibleType = companyType === 'epc' || companyType === 'sales_org';
  
  useEffect(() => {
    const checkClaim = async () => {
      if (!user || !isEligibleType) {
        setShowStatesField(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('claims')
        .select('status')
        .eq('company_id', companyId)
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();
        
      if (data && !error) {
        setShowStatesField(true);
      } else {
        setShowStatesField(false);
      }
    };
    
    checkClaim();
  }, [user, companyId, isEligibleType]);
  */
  
  return {
    showStatesField
  };
};
