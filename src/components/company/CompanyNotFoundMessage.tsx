
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, PlusCircle } from 'lucide-react';

const CompanyNotFoundMessage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The company you're looking for doesn't exist or has been removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/companies" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> 
              Back to Companies
            </Link>
          </Button>
          <Button asChild>
            <Link to="/companies/new" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add a New Company
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyNotFoundMessage;
