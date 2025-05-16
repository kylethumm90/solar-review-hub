
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLog } from '@/types/admin';

export function useAdminLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionType, setActionType] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "logs", actionType, entityType],
    queryFn: async () => {
      let query = supabase
        .from("admin_logs")
        .select(`
          id,
          admin_user_id,
          action_type,
          target_entity,
          target_id,
          details,
          timestamp,
          admin:users(email, full_name)
        `)
        .order("timestamp", { ascending: false });
      
      // Apply filters
      if (actionType) {
        query = query.eq("action_type", actionType);
      }
      
      if (entityType) {
        query = query.eq("target_entity", entityType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as AdminLog[];
    },
  });

  // Filter logs based on search query
  const filteredLogs = data?.filter(log => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    
    return (
      log.action_type.toLowerCase().includes(searchTerm) ||
      log.target_entity.toLowerCase().includes(searchTerm) ||
      log.target_id.toLowerCase().includes(searchTerm) ||
      log.admin?.email?.toLowerCase().includes(searchTerm) ||
      log.admin?.full_name?.toLowerCase().includes(searchTerm) ||
      JSON.stringify(log.details).toLowerCase().includes(searchTerm)
    );
  }) || [];

  return {
    logs: filteredLogs,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    actionType,
    setActionType,
    entityType,
    setEntityType
  };
}

export default useAdminLogs;
