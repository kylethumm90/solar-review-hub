
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches all unique vendor types from the companies table
 */
export async function getUniqueVendorTypes(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('type')
      .order('type');
      
    if (error) {
      console.error("Error fetching vendor types:", error);
      return [];
    }

    // Filter out null types and get unique values
    return Array.from(new Set(data.filter(item => item.type).map(item => item.type)));
  } catch (e) {
    console.error("Exception fetching vendor types:", e);
    return [];
  }
}
