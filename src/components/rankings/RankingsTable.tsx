
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getBadgeColorForGrade } from '@/utils/reviewUtils';

interface RankingsTableProps {
  rankings: any[];
  sortOption: string;
}

const RankingsTable = ({ rankings, sortOption }: RankingsTableProps) => {
  if (rankings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          No rankings found matching your filters.
        </p>
      </div>
    );
  }

  // Function to format company type for display
  const formatCompanyType = (type: string | null): string => {
    if (!type) return "Not specified";
    return type
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Function to get state names from codes
  const getStateNames = (stateCodes: string[]): string[] => {
    return stateCodes || [];
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[60px] text-center">Rank</TableHead>
              <TableHead className="w-[200px]">Company</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead className="w-[80px] text-center">Grade</TableHead>
              <TableHead className="w-[80px] text-center">Reviews</TableHead>
              <TableHead className="w-[80px] text-center">Installs</TableHead>
              <TableHead className="w-[180px]">Regions</TableHead>
              <TableHead className="w-[120px]">Last Verified</TableHead>
              <TableHead className="w-[100px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((company, index) => {
              const isTopFive = index < 5;
              const rankNumber = index + 1;
              
              return (
                <TableRow 
                  key={company.id}
                  className={`${isTopFive ? 'font-medium bg-muted/20' : ''}`}
                >
                  <TableCell className="text-center">
                    {isTopFive ? (
                      <div className="flex flex-col items-center">
                        <span className={`
                          rounded-full w-8 h-8 flex items-center justify-center
                          ${rankNumber === 1 ? 'bg-yellow-100 text-yellow-700' : 
                            rankNumber === 2 ? 'bg-gray-100 text-gray-700' : 
                            rankNumber === 3 ? 'bg-amber-100 text-amber-700' : 
                            'bg-purple-100 text-purple-700'}
                        `}>
                          {rankNumber}
                        </span>
                        {rankNumber === 1 && (
                          <Trophy className="h-4 w-4 text-yellow-500 mt-1" />
                        )}
                      </div>
                    ) : (
                      <span>{rankNumber}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/vendors/${company.id}`} className="text-primary hover:underline font-medium flex items-center gap-1">
                      {company.logo_url && (
                        <img 
                          src={company.logo_url} 
                          alt={company.name} 
                          className="h-5 w-5 rounded-full object-cover mr-1"
                        />
                      )}
                      {company.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {formatCompanyType(company.type)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="outline" 
                      className={`${getBadgeColorForGrade(company.grade)}`}
                    >
                      {company.grade}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {company.review_count || 0}
                  </TableCell>
                  <TableCell className="text-center">
                    {company.install_count || 'n/a'}
                  </TableCell>
                  <TableCell>
                    {company.operating_states?.length > 0 ? (
                      <div className="text-sm">
                        {company.operating_states.length > 3 
                          ? `${company.operating_states.slice(0, 3).join(', ')}...` 
                          : getStateNames(company.operating_states).join(', ')}
                        {company.operating_states.length > 10 && ' (National)'}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Not specified</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {company.last_verified ? formatDate(company.last_verified) : 'Not verified'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/vendors/${company.id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RankingsTable;
