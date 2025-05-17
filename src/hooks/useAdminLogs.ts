import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLog } from '@/types/admin';

export default function useAdminLogs() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "logs", "test"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_logs")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(5); // ✅ TEMP LIMIT

      if (error) throw error;
      return data as AdminLog[];
    },
  });

  return {
    logs: data ?? [],
    isLoading,
    error,
    refetchLogs: refetch,
  };
}

