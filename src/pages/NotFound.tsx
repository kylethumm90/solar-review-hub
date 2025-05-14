
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/vendors">
            <Search className="mr-2 h-5 w-5" />
            Browse Vendors
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
