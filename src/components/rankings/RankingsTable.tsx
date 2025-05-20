
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';
import { formatNumber, formatMonthYear } from '@/utils/formatUtils';
import { RankedCompany } from '@/types/rankings';
import RankChangeIndicator from './RankChangeIndicator';
import { formatCompanyType } from '@/types/company';
import { getBadgeColorForGrade } from '@/components/reviews/reviewUtils';

interface RankingsTableProps {
  companies: RankedCompany[];
  isLoading: boolean;
}

const RankingsTable: React.FC<RankingsTableProps> = ({ companies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          No companies found with the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">Rank</TableHead>
            <TableHead className="min-w-[200px]">Company</TableHead>
            <TableHead className="w-20 text-center">Grade</TableHead>
            <TableHead className="w-20 text-center">Reviews</TableHead>
            <TableHead className="w-20 text-center">Installs</TableHead>
            <TableHead className="w-24 text-center">Movement</TableHead>
            <TableHead className="w-32">Type</TableHead>
            <TableHead className="w-32">Verified On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company, index) => (
            <TableRow key={company.id}>
              <TableCell className="text-center font-bold">{index + 1}</TableCell>
              <TableCell>
                <Link to={`/vendors/${company.id}`} className="flex items-center hover:underline">
                  {company.logo_url ? (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={company.logo_url} alt={company.name} />
                      <AvatarFallback>
                        <Building className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>
                        <Building className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="font-medium">{company.name}</span>
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant="outline" 
                  className={`${getBadgeColorForGrade(company.grade || 'N/A')}`}
                >
                  {company.grade || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{company.review_count}</TableCell>
              <TableCell className="text-center">{formatNumber(company.install_count)}</TableCell>
              <TableCell className="text-center">
                <RankChangeIndicator 
                  change={company.rank_change || 0} 
                  isNew={company.is_new} 
                />
              </TableCell>
              <TableCell>{formatCompanyType(company.type)}</TableCell>
              <TableCell>{formatMonthYear(company.last_verified)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RankingsTable;
