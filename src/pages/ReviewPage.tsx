
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ReviewForm from '@/components/review/ReviewForm';
import { toast } from '@/hooks/use-toast';

const ReviewPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<{ name: string; type: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId) return;
      
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('name, type')
          .eq('id', companyId)
          .single();
          
        if (error) throw error;
        setCompany(data);
      } catch (error) {
        console.error('Error fetching company:', error);
        toast({
          title: 'Error',
          description: 'Could not load company details. Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyDetails();
  }, [companyId]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        </div>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Company Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">
          The company you're trying to review could not be found.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Write a Review</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Share your experience working with {company.name}
      </p>
      
      <ReviewForm 
        companyId={companyId || ''} 
        companyName={company.name} 
        companyType={company.type}
      />
    </div>
  );
};

export default ReviewPage;
