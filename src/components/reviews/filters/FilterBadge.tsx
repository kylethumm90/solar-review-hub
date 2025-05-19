
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterBadgeProps {
  type: string;
  value: string;
  label: string;
  onRemove: (type: string, value: string) => void;
}

const FilterBadge = ({ type, value, label, onRemove }: FilterBadgeProps) => {
  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      {label}
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 ml-1"
        onClick={() => onRemove(type, value)}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
};

export default FilterBadge;
