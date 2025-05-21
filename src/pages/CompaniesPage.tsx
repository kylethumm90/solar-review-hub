
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Search, Filter, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { scoreToGrade } from '@/utils/reviewUtils';
import CompanyCard from '@/components/CompanyCard';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
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
    async function fetchCompanies() {
      setIsLoading(true);
      
      try {
        // Fetch all companies with their reviews and review_answers
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select(`
            *,
            reviews:reviews(
              id,
              average_score,
              review_answers:review_answers(
                id, 
                rating, 
                question_id,
                review_questions:review_questions(id, weight)
              )
            )
          `);

        if (companiesError) throw companiesError;

        console.log('Companies data from Supabase:', companiesData);

        // Process the companies data using the weighted rating system
        const processedCompanies = companiesData.map(company => {
          // Check if company has reviews
          const hasReviews = company.reviews && company.reviews.length > 0;
          
          // Calculate average rating using the weighted system
          let avgRating = 0;
          
          if (hasReviews) {
            // Calculate the average score for each review
            const reviewScores = company.reviews.map((review: any) => {
              // Safety check: ensure review exists
              if (!review) return 0;
              
              // Check if review has review_answers and it's an array
              const reviewAnswers = review.review_answers && Array.isArray(review.review_answers) 
                ? review.review_answers 
                : [];
              
              // If no answers, use the stored average_score
              if (!reviewAnswers || reviewAnswers.length === 0) {
                return review.average_score || 0;
              }
              
              // Calculate weighted average
              let totalWeight = 0;
              let weightedSum = 0;
              
              reviewAnswers.forEach((answer: any) => {
                if (!answer || typeof answer.rating !== 'number') return;
                
                const weight = answer.review_questions?.weight || 1;
                weightedSum += answer.rating * weight;
                totalWeight += weight;
              });
              
              return totalWeight > 0 ? weightedSum / totalWeight : (review.average_score || 0);
            });
            
            // Calculate overall average
            avgRating = reviewScores.reduce((sum: number, score: number) => sum + score, 0) / reviewScores.length;
          }
          
          // Convert score to letter grade
          const grade = hasReviews ? scoreToGrade(avgRating) : 'NR';
          
          console.log(`Company: ${company.name}, Rating: ${avgRating}, Grade: ${grade}`);
          
          return {
            ...company,
            avg_rating: avgRating,
            grade: grade,
            review_count: company.reviews ? company.reviews.length : 0
          };
        });

        // Cast the processed companies to match our Company[] type
        setCompanies(processedCompanies as Company[]);
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
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || company.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Get count of companies by type for the filter pills
  const getCompanyCountByType = (type: string) => {
    if (type === 'all') return companies.length;
    return companies.filter(company => company.type === type).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Solar Companies Directory</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find and review the best companies in the solar industry
          </p>
        </div>
        
        {/* Add New Company Button - Only visible for logged in users */}
        {user && (
          <Button 
            onClick={() => navigate('/companies/new')} 
            className="flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add New Company
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
              placeholder="Search companies..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Pills */}
          <div className="flex overflow-x-auto gap-2 pb-1">
            {companyTypes.map(type => {
              const count = getCompanyCountByType(type.value);
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
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading companies...</p>
          </div>
        </div>
      ) : filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              id={company.id}
              name={company.name}
              description={company.description}
              logoUrl={company.logo_url}
              website={company.website}
              grade={company.grade}
              type={company.type}
              rating={company.avg_rating || 0}
              isVerified={company.is_verified}
              status={company.status}
              reviewCount={company.review_count}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            No companies found matching your criteria.
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
                onClick={() => navigate('/companies/new')} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add a new company
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;
