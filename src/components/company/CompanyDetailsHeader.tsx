
import { Badge } from '@/components/ui/badge';
import { getBadgeColorForGrade } from '@/components/reviews/reviewUtils';
import { BadgeCheck, Globe } from 'lucide-react';

interface CompanyDetailsHeaderProps {
  company: any;
  avgRating: number;
  reviewCount: number;
  letterGrade: string;
}

const CompanyDetailsHeader: React.FC<CompanyDetailsHeaderProps> = ({ 
  company, 
  avgRating, 
  reviewCount, 
  letterGrade 
}) => {
  // Format company type for display
  const formatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Company Logo */}
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
          {company.logo_url ? (
            <img 
              src={company.logo_url} 
              alt={`${company.name} logo`}
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <span className="text-4xl">🏢</span>
          )}
        </div>
        
        {/* Company Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                {company.name}
                {company.is_verified && (
                  <Badge className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 dark:bg-green-900 dark:text-green-100">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {formatType(company.type)}
              </p>
              
              {company.website && (
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-primary/80 flex items-center gap-1 mt-2"
                >
                  <Globe size={16} />
                  <span>{company.website}</span>
                </a>
              )}
            </div>
            
            {/* Grade/Rating Info */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  <Badge 
                    variant="outline" 
                    className={`${getBadgeColorForGrade(letterGrade)} text-xl font-bold px-3 py-1`}
                  >
                    {letterGrade}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Grade</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {reviewCount}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {reviewCount === 1 ? 'Review' : 'Reviews'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {avgRating ? avgRating.toFixed(1) : 'N/A'}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Avg. Score</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-gray-700 dark:text-gray-300">{company.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsHeader;
