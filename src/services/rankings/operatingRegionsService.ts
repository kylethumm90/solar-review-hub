
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the operating_states column exists in the companies table
 */
export async function checkOperatingStatesColumn(): Promise<boolean> {
  try {
    const result = await supabase
      .from('companies')
      .select('operating_states')
      .limit(1);
    
    // If there's an error mentioning the column, it doesn't exist
    if (result.error && result.error.message && 
        result.error.message.includes('operating_states')) {
      return false;
    }
    
    return true;
  } catch (e) {
    console.error("Error checking operating_states column:", e);
    return false;
  }
}

/**
 * Fetches all operating regions from the companies table
 */
export async function getOperatingRegions(): Promise<string[]> {
  try {
    // First check if the operating_states column exists
    const columnExists = await checkOperatingStatesColumn();
    
    if (!columnExists) {
      console.log("operating_states column does not exist in companies table");
      return [];
    }
    
    // If we get here, the column exists, so proceed with the query
    const { data, error } = await supabase
      .from('companies')
      .select('operating_states');
    
    if (error) {
      console.error("Error fetching operating regions:", error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Flatten all operating_states arrays and get unique values
    const allRegions: string[] = [];
    data.forEach(company => {
      if (company) {
        // Check if company object has operating_states property and it's an array
        if ('operating_states' in company && Array.isArray(company.operating_states)) {
          const states = company.operating_states;
          states.forEach(state => {
            if (state && !allRegions.includes(state)) {
              allRegions.push(state);
            }
          });
        }
      }
    });
    
    return allRegions.sort();
  } catch (e) {
    console.error("Exception fetching operating regions:", e);
    return [];
  }
}
