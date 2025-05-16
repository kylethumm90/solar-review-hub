
import { supabase } from '@/integrations/supabase/client';

/**
 * Migration function to enforce the allowed action types for admin_logs table
 * This should be run once to set up the constraints
 */
export const migrateAdminLogsConstraints = async () => {
  try {
    // First, let's create an enum type for allowed action types
    // We need to use raw SQL since this is a complex database operation
    const { error: createEnumError } = await supabase
      .rpc('create_admin_action_type_enum', {}, {
        count: 'exact'
      });

    if (createEnumError) {
      console.error("Failed to create enum via RPC, trying with raw SQL");
      // If RPC failed (likely because it doesn't exist yet), use raw query as fallback
      const { error: rawSqlError } = await supabase.from('admin_logs')
        .select('id', { count: 'exact', head: true })
        .filter('id', 'neq', '00000000-0000-0000-0000-000000000000')
        .limit(1)
        .then(async () => {
          // After a successful query to verify table access, run raw SQL
          return await supabase.rpc('exec_sql', {
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
          });
        });

      if (rawSqlError) {
        throw new Error(`Failed to create admin_action_type enum: ${rawSqlError.message}`);
      }
    }

    // Then, update the column to use the enum type
    const { error: alterTableError } = await supabase.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE admin_logs
        ALTER COLUMN action_type TYPE admin_action_type 
        USING action_type::admin_action_type;
      `
    });

    if (alterTableError) {
      throw new Error(`Failed to update action_type column: ${alterTableError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error };
  }
}
