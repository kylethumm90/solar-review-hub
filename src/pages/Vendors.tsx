
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company, Review } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { calculateAverageRating, scoreToGrade } from '@/utils/reviewUtils';

// Import our new components
import VendorHeader from '@/components/vendors/VendorHeader';
import VendorFilters from '@/components/vendors/VendorFilters';
import VendorList from '@/components/vendors/VendorList';

const Vendors = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const { user } = useAuth();
  
  // Company types for filtering with counts
  const companyTypes = [
    { value: 'all', label: 'All Types', icon: '🏢' },
    { value: 'epc', label: 'EPC', icon: '🏗️' },
    { value: 'sales_org', label: 'Sales Organization', icon: '📞' },
    { value: 'lead_gen', label: 'Lead Generation', icon: '🎯' },
    { value: 'software', label: 'Software', icon: '💻' }
  ];

  useEffect(() => {
    async function fetchCompanies() {
      setIsLoading(true);
      
      try {
        // Fetch all companies and their reviews
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select(`
            *,
            reviews(*)
          `);

        if (companiesError) throw companiesError;

        // Process the companies data to add average rating and grade
        const processedCompanies = companiesData.map(company => {
          const reviews = company.reviews || [];
          
          // Add reviewer_id to each review to match the type definition
          const typedReviews = reviews.map(review => ({
            ...review,
            reviewer_id: review.user_id || 'unknown'
          })) as Review[];
          
          const avgRating = calculateAverageRating(typedReviews);
          const grade = scoreToGrade(avgRating);
          
          return {
            ...company,
            avg_rating: avgRating,
            grade: grade,
            review_count: typedReviews.length,
            reviews: typedReviews
          } as Company;
        });

        setCompanies(processedCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  // Filter companies based on search term and type
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || company.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <VendorHeader user={user} />
      
      <VendorFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        companies={companies}
        companyTypes={companyTypes}
      />
      
      <VendorList 
        isLoading={isLoading}
        filteredCompanies={filteredCompanies}
        searchTerm={searchTerm}
        selectedType={selectedType}
        setSearchTerm={setSearchTerm}
        setSelectedType={setSelectedType}
        user={user}
      />
    </div>
  );
};

export default Vendors;
