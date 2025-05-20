
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LogsFilterBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  actionTypeFilter: string | null;
  setActionTypeFilter: (type: string | null) => void;
  actionTypes: string[];
  onRefresh: () => void;
};

export default function LogsFilterBar({
  searchTerm,
  setSearchTerm,
  actionTypeFilter,
  setActionTypeFilter,
  actionTypes,
  onRefresh
}: LogsFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <Select
        value={actionTypeFilter || 'all'}
        onValueChange={(value) => setActionTypeFilter(value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All actions</SelectItem>
          {actionTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        title="Refresh logs"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
