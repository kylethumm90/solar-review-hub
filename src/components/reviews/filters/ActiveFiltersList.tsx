
import FilterBadge from './FilterBadge';

interface ActiveFilter {
  type: string;
  value: string;
  label: string;
}

interface ActiveFiltersListProps {
  filters: ActiveFilter[];
  onRemoveFilter: (type: string, value: string) => void;
}

const ActiveFiltersList = ({ filters, onRemoveFilter }: ActiveFiltersListProps) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {filters.map((filter, i) => (
        <FilterBadge
          key={`${filter.type}-${i}`}
          type={filter.type}
          value={filter.value}
          label={filter.label}
          onRemove={onRemoveFilter}
        />
      ))}
    </div>
  );
};

export default ActiveFiltersList;
