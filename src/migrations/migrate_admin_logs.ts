
import { supabase } from '@/integrations/supabase/client';

/**
 * Migration function to enforce the allowed action types for admin_logs table
 * This should be run once to set up the constraints
 */
export const migrateAdminLogsConstraints = async () => {
  try {
    // First, let's create an enum type for allowed action types
    const { error: createEnumError } = await supabase.rpc('execute_sql', {
      sql: `
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

    if (createEnumError) {
      throw new Error(`Failed to create admin_action_type enum: ${createEnumError.message}`);
    }

    // Then, update the column to use the enum type
    const { error: alterTableError } = await supabase.rpc('execute_sql', {
      sql: `
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
