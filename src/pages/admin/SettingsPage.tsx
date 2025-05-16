
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { SettingsGroup } from "@/components/admin/settings/SettingsGroup";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SettingsPage() {
  const { 
    settingsByCategory, 
    isLoading, 
    error, 
    updateSetting 
  } = useAdminSettings();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error loading settings</h3>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
          Please check your connection and try again.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Platform Settings</h1>
      </div>
      
      <div className="space-y-6">
        {Object.entries(settingsByCategory).map(([category, settings]) => (
          <SettingsGroup 
            key={category}
            category={category}
            settings={settings}
            onUpdateSetting={updateSetting}
          />
        ))}
      </div>
    </div>
  );
}
