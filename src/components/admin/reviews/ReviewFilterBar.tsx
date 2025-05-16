
import React from 'react';

type ReviewFilterBarProps = {
  activeFilter: string | null;
  onFilterChange: (status: string | null) => void;
};

const ReviewFilterBar = ({ activeFilter, onFilterChange }: ReviewFilterBarProps) => {
  return (
    <div className="flex space-x-2 mb-4">
      <button 
        onClick={() => onFilterChange(null)}
        className={`px-3 py-1 rounded text-sm ${activeFilter === null ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
      >
        All
      </button>
      <button 
        onClick={() => onFilterChange('pending')}
        className={`px-3 py-1 rounded text-sm ${activeFilter === 'pending' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
      >
        Pending
      </button>
      <button 
        onClick={() => onFilterChange('approved')}
        className={`px-3 py-1 rounded text-sm ${activeFilter === 'approved' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
      >
        Approved
      </button>
      <button 
        onClick={() => onFilterChange('rejected')}
        className={`px-3 py-1 rounded text-sm ${activeFilter === 'rejected' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
      >
        Rejected
      </button>
    </div>
  );
};

export default ReviewFilterBar;
