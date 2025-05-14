
import { createClient } from '@supabase/supabase-js';

// These values are provided by the Supabase integration
const supabaseUrl = "https://cmmposdobssorzcfduvl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtbXBvc2RvYnNzb3J6Y2ZkdXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDk3OTMsImV4cCI6MjA2MjgyNTc5M30.cfPoWssxEEJy__11BTIPtinsqxeoOsLQ0sHoJ8ZAc80";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
