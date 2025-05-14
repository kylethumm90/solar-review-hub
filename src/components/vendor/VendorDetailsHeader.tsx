
import React from 'react';
import { Star, Shield, Globe, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Company } from '@/types';

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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center">
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
          <div className="flex items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mr-3">{company.name}</h1>
            {company.is_verified && (
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                <span>Verified</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500 mr-2">
              {Array(5).fill(0).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(avgRating)
                      ? 'fill-yellow-500'
                      : 'fill-gray-200 dark:fill-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-300">
              {avgRating.toFixed(1)} ({reviewCount} reviews)
            </span>
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
