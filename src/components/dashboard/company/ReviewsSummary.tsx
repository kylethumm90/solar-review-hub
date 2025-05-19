
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ReviewsSummaryProps {
  reviewCount: number;
}

const ReviewsSummary = ({ reviewCount }: ReviewsSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
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
