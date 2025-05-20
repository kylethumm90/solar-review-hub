
import React from 'react';
import { ArrowUp, ArrowDown, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface RankChangeIndicatorProps {
  change: number | null;
  isNew?: boolean;
}

const RankChangeIndicator: React.FC<RankChangeIndicatorProps> = ({ change, isNew = false }) => {
  if (isNew) {
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        🆕 New
      </Badge>
    );
  }

  if (change === null || change === undefined) {
    return <span>—</span>;
  }

  if (change > 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center">
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              +{change}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Moved up {change} {change === 1 ? 'position' : 'positions'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (change < 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center">
            <span className="text-red-600 dark:text-red-400 flex items-center">
              <ArrowDown className="h-4 w-4 mr-1" />
              {change}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Moved down {Math.abs(change)} {Math.abs(change) === 1 ? 'position' : 'positions'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex items-center">
          <span className="text-gray-600 dark:text-gray-400 flex items-center">
            <Circle className="h-4 w-4 mr-1" />
            0
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>No change in ranking</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RankChangeIndicator;
