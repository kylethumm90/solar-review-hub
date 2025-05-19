
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DesktopSortControlsProps {
  reviewCount: number;
  loading: boolean;
  sortOption: string;
  onSortChange: (value: string) => void;
}

const DesktopSortControls: React.FC<DesktopSortControlsProps> = ({
  reviewCount,
  loading,
  sortOption,
  onSortChange
}) => {
  return (
    <div className="hidden md:flex justify-between items-center mb-6">
      <div className="text-sm text-gray-500">
        {loading ? 'Loading...' : `Showing ${reviewCount} reviews`}
      </div>
      <Select value={sortOption} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="grade-high">Highest Grade</SelectItem>
          <SelectItem value="installs">Most Installs</SelectItem>
          <SelectItem value="company">Vendor A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DesktopSortControls;
