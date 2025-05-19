
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Company } from '@/types';
import { scoreToGrade } from '@/utils/reviewUtils';

interface VendorDetailsHeaderProps {
  company: Company;
  avgRating: number;
  reviewCount: number;
}

const VendorDetailsHeader: React.FC<VendorDetailsHeaderProps> = ({ 
  company, 
  avgRating, 
  reviewCount 
}) => {
  const letterGrade = scoreToGrade(avgRating);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          {company.logo_url ? (
            <img 
              src={company.logo_url} 
              alt={`${company.name} logo`}
              className="w-24 h-24 object-contain rounded-lg border dark:border-gray-700"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
              <span className="text-3xl text-gray-400">{company.name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col mb-3">
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mr-3">{company.name}</h1>
              {company.is_verified && (
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                  <span>Verified</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center mb-3">
              <Badge className="text-base bg-blue-500 hover:bg-blue-600 px-3 py-1" variant="default">
                Grade: {letterGrade}
              </Badge>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                <Link to="#reviews" className="hover:underline">
                  {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </Link>
                <span className="text-sm ml-2 text-gray-500">({avgRating.toFixed(1)})</span>
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {company.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            {company.website && (
              <a 
                href={company.website} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:underline"
              >
                <Globe className="h-4 w-4 mr-1" />
                <span>Website</span>
              </a>
            )}
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last verified: {new Date(company.last_verified || company.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsHeader;
