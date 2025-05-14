
import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (newValue: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const StarRating = ({ value = 0, onChange, readOnly = false, size = 'md', label }: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  
  // Determine size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  const sizeClass = sizeClasses[size];
  
  return (
    <div className="flex flex-col">
      {label && <span className="text-sm font-medium mb-1">{label}</span>}
      <div className="flex star-rating">
        {stars.map((star) => {
          const isActive = (readOnly ? value : hoverValue || value) >= star;
          return (
            <span
              key={star}
              onMouseEnter={() => !readOnly && setHoverValue(star)}
              onMouseLeave={() => !readOnly && setHoverValue(0)}
              onClick={() => !readOnly && onChange?.(star)}
              className={`cursor-${readOnly ? 'default' : 'pointer'} mr-1`}
            >
              <Star
                className={`${sizeClass} ${
                  isActive ? 'filled text-yellow-400' : 'text-gray-300'
                }`}
                fill={isActive ? 'currentColor' : 'none'}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;
