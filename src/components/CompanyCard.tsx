
import { Link } from 'react-router-dom';
import { Building, ExternalLink, BadgeCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Badge } from './ui/badge';
import { getBadgeColorForGrade } from './reviews/reviewUtils';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface CompanyCardProps {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  grade?: string;
  type: string;
  rating?: number;
  isVerified: boolean;
  status?: string;
  reviewCount?: number;
}

const CompanyCard = ({
  id,
  name,
  description,
  logoUrl,
  website,
  grade = 'NR',
  type,
  rating = 0,
  isVerified,
  status,
  reviewCount = 0,
}: CompanyCardProps) => {
  // Format the company type for display
  const formatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:translate-y-[-2px]">
      <CardContent className="p-6">
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
                  <Badge className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 dark:bg-green-900 dark:text-green-100">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatType(type)}</p>
            </div>
          </div>
          
          <div className="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-2xl font-bold text-primary">
                    <Badge 
                      variant="outline" 
                      className={getBadgeColorForGrade(grade)}
                    >
                      {grade === 'NR' ? 'Not Rated' : grade}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {grade === 'NR' ? 
                    'This company has not received any verified reviews yet' : 
                    `Grade: ${grade} based on ${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-xs text-gray-500 dark:text-gray-400">Grade</div>
          </div>
        </div>
        
        <div className="mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {reviewCount > 0 ? `${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}` : 'No reviews yet'}
          </span>
        </div>
        
        <HoverCard>
          <HoverCardTrigger asChild>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 cursor-default">
              {description}
            </p>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 text-sm">
            {description}
          </HoverCardContent>
        </HoverCard>
        
        <div className="flex justify-between items-center mt-4">
          <Button asChild variant="outline" size="sm">
            <Link to={`/companies/${id}`}>View Details</Link>
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
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
