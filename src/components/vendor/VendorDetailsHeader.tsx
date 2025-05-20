
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, Calendar, CheckCircle, Medal, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Company } from '@/types';
import { getBadgeColorForGrade } from '@/components/reviews/reviewUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { COMPANY_STATUS, getStatusDisplayName } from '@/types/company';

interface VendorDetailsHeaderProps {
  company: Company;
  avgRating: number;
  reviewCount: number;
  letterGrade: string;
}

const VendorDetailsHeader: React.FC<VendorDetailsHeaderProps> = ({ 
  company, 
  avgRating, 
  reviewCount,
  letterGrade
}) => {
  // Function to determine badge color based on grade
  const getBadgeColor = (grade: string) => {
    if (grade.startsWith('A')) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (grade.startsWith('B')) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  // Get status display information
  const renderStatusBadge = () => {
    if (!company.status || company.status === COMPANY_STATUS.UNCLAIMED) {
      return null;
    }

    const isCertified = company.status === COMPANY_STATUS.CERTIFIED;
    const StatusIcon = isCertified ? Medal : CheckCircle;
    const badgeClass = isCertified 
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    const tooltipText = isCertified 
      ? "This company is recognized for consistent quality and positive feedback." 
      : "This company's profile has been claimed and verified by SolarGrade.";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`${badgeClass} text-xs px-2 py-1 rounded-full flex items-center`}>
              <StatusIcon className="h-3.5 w-3.5 mr-1" />
              <span>{getStatusDisplayName(company.status)}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-shrink-0">
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
          <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{company.name}</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    className={`text-base px-3 py-1 rounded-full ${getBadgeColor(letterGrade)}`}
                    variant="outline"
                  >
                    <span>SolarGrade: {letterGrade}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is the company's calculated SolarGrade letter rating based on verified reviews.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {renderStatusBadge()}
          </div>
          
          <div className="mb-3">
            <span className="text-gray-600 dark:text-gray-300">
              <Link to="#reviews" className="hover:underline">
                {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </Link>
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
