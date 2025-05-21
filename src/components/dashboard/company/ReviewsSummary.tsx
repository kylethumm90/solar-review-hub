
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getBadgeColorForGrade } from "@/components/reviews/reviewUtils";

interface ReviewsSummaryProps {
  reviewCount: number;
  grade?: string;
}

const ReviewsSummary = ({ reviewCount, grade = 'NR' }: ReviewsSummaryProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reviews</CardTitle>
        {grade && (
          <Badge 
            variant="outline" 
            className={`${getBadgeColorForGrade(grade)}`}
          >
            {grade === 'NR' ? 'Not Rated' : grade}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{reviewCount}</p>
        <p className="text-sm text-muted-foreground">Total reviews received</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <Link to="#reviews">View All Reviews</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewsSummary;
