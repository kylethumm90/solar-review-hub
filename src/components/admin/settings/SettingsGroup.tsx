
import { PlatformSetting } from "@/hooks/useAdminSettings";
import { SettingField } from "@/components/admin/settings/SettingField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsGroupProps {
  category: string;
  settings: PlatformSetting[];
  onUpdateSetting: (id: string, value: any) => Promise<void>;
}

// Helper function to format category names
const formatCategoryName = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export function SettingsGroup({ category, settings, onUpdateSetting }: SettingsGroupProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{formatCategoryName(category)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {settings.map((setting) => (
            <SettingField 
              key={setting.id} 
              setting={setting} 
              onUpdate={onUpdateSetting} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
