
import React from 'react';

interface VendorFilterPillProps {
  icon: string;
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const VendorFilterPill: React.FC<VendorFilterPillProps> = ({
  icon,
  label,
  count,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
        isActive 
          ? 'bg-primary text-white' 
          : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
      }`}
      aria-pressed={isActive}
    >
      <span className="mr-1">{icon}</span> {label} ({count})
    </button>
  );
};

export default VendorFilterPill;
