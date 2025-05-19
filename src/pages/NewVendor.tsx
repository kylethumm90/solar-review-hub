
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddVendorForm from '@/components/vendor/AddVendorForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const NewVendor = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1 mb-4" 
          onClick={() => navigate('/vendors')}
        >
          <ChevronLeft size={16} />
          Back to Companies Directory
        </Button>
        
        <h1 className="text-3xl font-bold">Add New Company</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Submit a new company to the Solar Companies Directory
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <AddVendorForm />
      </div>
    </div>
  );
};

export default NewVendor;
