
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { Building, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface VendorCardProps {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  grade?: string;
  type: string; // Updated to accept any string
  rating?: number;
  isVerified: boolean;
}

const VendorCard = ({
  id,
  name,
  description,
  logoUrl,
  website,
  grade = 'N/A',
  type,
  rating = 0,
  isVerified,
}: VendorCardProps) => {
  // Format the company type for display
  const formatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`${name} logo`} 
                className="h-12 w-12 object-contain rounded-md mr-4"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center mr-4">
                <Building className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                {name}
                {isVerified && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">
                    Verified
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatType(type)}</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{grade}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Grade</div>
          </div>
        </div>
        
        <div className="mb-4">
          <StarRating value={rating} readOnly size="sm" />
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            {rating.toFixed(1)} rating
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
          {description}
        </p>
        
        <div className="flex justify-between items-center mt-4">
          <Button asChild variant="outline" size="sm">
            <Link to={`/vendors/${id}`}>View Details</Link>
          </Button>
          
          {website && (
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 inline-flex items-center text-sm"
            >
              Visit Website <ExternalLink size={14} className="ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
