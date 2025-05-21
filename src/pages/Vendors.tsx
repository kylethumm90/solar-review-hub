import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { scoreToGrade } from '@/utils/reviewUtils';
import VendorCard from '@/components/VendorCard';

const VendorsPage = () => {
  const [vendors, setVendors] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const navigate = useNavigate();
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
    async function fetchVendors() {
      setIsLoading(true);
      
      try {
        const { data: vendorsData, error } = await supabase
          .from('companies')
          .select(`
            *,
            reviews(*)
          `);
        
        if (error) throw error;
        
        const processedVendors = vendorsData.map(vendor => {
          // Check if vendor has reviews
          const hasReviews = vendor.reviews && vendor.reviews.length > 0;
          
          // Calculate average rating (simpler method without using review_answers)
          let avgRating = 0;
          
          if (hasReviews) {
            // Use the stored average_score for each review when available
            const reviewScores = vendor.reviews.map((review: any) => {
              return review.average_score || 0;
            });
            
            // Calculate overall average
            avgRating = reviewScores.reduce((sum: number, score: number) => sum + score, 0) / reviewScores.length;
          }
          
          // Convert score to letter grade
          const grade = hasReviews ? scoreToGrade(avgRating) : 'NR';
          
          // Return a new object that matches the Company type structure
          return {
            id: vendor.id,
            name: vendor.name,
            description: vendor.description,
            website: vendor.website,
            logo_url: vendor.logo_url,
            type: vendor.type,
            is_verified: vendor.is_verified,
            status: vendor.status,
            grade: grade,
            last_verified: vendor.last_verified,
            created_at: vendor.created_at,
            avg_rating: avgRating,
            review_count: vendor.reviews ? vendor.reviews.length : 0
          } as Company;
        });

        setVendors(processedVendors);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVendors();
  }, []);

  // Filter vendors based on search term and type
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || vendor.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Get count of vendors by type for the filter pills
  const getVendorCountByType = (type: string) => {
    if (type === 'all') return vendors.length;
    return vendors.filter(vendor => vendor.type === type).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Solar Vendor Directory</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find and review the best vendors in the solar industry
          </p>
        </div>
        
        {/* Add New Vendor Button - Only visible for logged in users */}
        {user && (
          <Button 
            onClick={() => navigate('/vendors/new')} 
            className="flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add New Vendor
          </Button>
        )}
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-8 sticky top-0 z-10">
        <div className="flex flex-col space-y-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Pills */}
          <div className="flex overflow-x-auto gap-2 pb-1">
            {companyTypes.map(type => {
              const count = getVendorCountByType(type.value);
              const isActive = selectedType === type.value;
              
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                    isActive 
                    ? 'bg-primary text-white' 
                    : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="mr-1">{type.icon}</span> {type.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading vendors...</p>
          </div>
        </div>
      ) : filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              id={vendor.id}
              name={vendor.name}
              description={vendor.description}
              logoUrl={vendor.logo_url}
              website={vendor.website}
              grade={vendor.grade}
              type={vendor.type}
              rating={vendor.avg_rating || 0}
              isVerified={vendor.is_verified}
              reviewCount={vendor.review_count}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            No vendors found matching your criteria.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
            }}>
              Clear Filters
            </Button>
            
            {user && (
              <Button 
                onClick={() => navigate('/vendors/new')} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add a new vendor
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
