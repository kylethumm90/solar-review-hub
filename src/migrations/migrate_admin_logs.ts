
import { supabase } from '@/integrations/supabase/client';

/**
 * Migration function to enforce the allowed action types for admin_logs table
 * This should be run once to set up the constraints
 */
export const migrateAdminLogsConstraints = async () => {
  try {
    // First, let's create an enum type for allowed action types using raw SQL
    // We cannot use rpc methods that don't exist in our type definitions
    const { error: createEnumError } = await supabase.from('admin_logs')
      .select('id', { count: 'exact', head: true })
      .filter('id', 'neq', '00000000-0000-0000-0000-000000000000')
      .limit(1)
      .then(async () => {
        // After a successful query to verify table access, run raw SQL
        // Use a plain fetch request since we don't have direct access to protected properties
        const SUPABASE_URL = "https://cmmposdobssorzcfduvl.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtbXBvc2RvYnNzb3J6Y2ZkdXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDk3OTMsImV4cCI6MjA2MjgyNTc5M30.cfPoWssxEEJy__11BTIPtinsqxeoOsLQ0sHoJ8ZAc80";
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({
            sql_query: `
              DO $$
              BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_action_type') THEN
                  CREATE TYPE admin_action_type AS ENUM (
                    'approve_vendor',
                    'deny_vendor',
                    'edit_vendor',
                    'delete_vendor',
                    'approve_review',
                    'reject_review',
                    'edit_review',
                    'approve_claim',
                    'reject_claim',
                    'promote_user',
                    'revoke_admin',
                    'change_user_role',
                    'edit_vendor_metadata',
                    'verify_company'
                  );
                END IF;
              END
              $$;
            `
          })
        });

        if (!response.ok) {
          const error = await response.json();
          return { error };
        }
        return { error: null };
      });

    if (createEnumError) {
      throw new Error(`Failed to create admin_action_type enum: ${JSON.stringify(createEnumError)}`);
    }

    // Then, update the column to use the enum type
    // Use a plain fetch request since we don't have direct access to protected properties
    const SUPABASE_URL = "https://cmmposdobssorzcfduvl.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtbXBvc2RvYnNzb3J6Y2ZkdXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDk3OTMsImV4cCI6MjA2MjgyNTc5M30.cfPoWssxEEJy__11BTIPtinsqxeoOsLQ0sHoJ8ZAc80";
    
    const alterResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        sql_query: `
          ALTER TABLE admin_logs
          ALTER COLUMN action_type TYPE admin_action_type 
          USING action_type::admin_action_type;
        `
      })
    });

    if (!alterResponse.ok) {
      const error = await alterResponse.json();
      throw new Error(`Failed to update action_type column: ${JSON.stringify(error)}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error };
  }
}
