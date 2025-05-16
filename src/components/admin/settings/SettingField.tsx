
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PlatformSetting } from "@/hooks/useAdminSettings";

interface SettingFieldProps {
  setting: PlatformSetting;
  onUpdate: (id: string, value: any) => Promise<void>;
}

export function SettingField({ setting, onUpdate }: SettingFieldProps) {
  const [value, setValue] = useState<any>(setting.value);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleSave = async () => {
    setIsUpdating(true);
    await onUpdate(setting.id, value);
    setIsUpdating(false);
  };
  
  const hasChanges = value !== setting.value;
  
  // Render different input types based on setting type
  const renderInput = () => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch 
            checked={Boolean(value)} 
            onCheckedChange={(checked) => setValue(checked)}
          />
        );
      case 'number':
        return (
          <Input 
            type="number" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            className="max-w-xs"
          />
        );
      case 'string':
      default:
        return (
          <Input 
            type="text" 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            className="max-w-xs"
          />
        );
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b">
      <div className="mb-2 md:mb-0">
        <h4 className="font-medium">{setting.label || setting.key}</h4>
      </div>
      <div className="flex items-center space-x-4">
        {renderInput()}
        {hasChanges && (
          <Button 
            onClick={handleSave} 
            disabled={isUpdating}
            size="sm"
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
