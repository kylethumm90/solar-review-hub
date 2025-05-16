
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SettingType = 'number' | 'boolean' | 'string';

export interface PlatformSetting {
  id: string;
  key: string;
  value: any;
  type: SettingType;
  label: string | null;
  category: string;
  updated_at: string;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .order("category");
      
      if (error) {
        toast.error("Failed to load settings");
        throw error;
      }
      
      return data as PlatformSetting[];
    },
  });
  
  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data]);
  
  // Group settings by category
  const settingsByCategory = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, PlatformSetting[]>);
  
  // Update a setting
  const updateSetting = async (id: string, value: any) => {
    try {
      // Convert value based on setting type
      const setting = settings.find(s => s.id === id);
      if (!setting) return;
      
      let parsedValue = value;
      if (setting.type === 'number') {
        parsedValue = Number(value);
      } else if (setting.type === 'boolean') {
        parsedValue = Boolean(value);
      }
      
      const { error } = await supabase
        .from("platform_settings")
        .update({ value: parsedValue })
        .eq("id", id);
      
      if (error) {
        toast.error("Failed to update setting");
        throw error;
      }
      
      // Update local state for immediate UI feedback
      setSettings(settings.map(s => 
        s.id === id ? { ...s, value: parsedValue } : s
      ));
      
      toast.success("Setting updated successfully");
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("An error occurred while updating the setting");
    }
  };
  
  return {
    settings,
    settingsByCategory,
    isLoading,
    error,
    refetch,
    updateSetting
  };
}
