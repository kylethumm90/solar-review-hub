
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Shield, ExternalLink, AlertCircle } from 'lucide-react';

const DashboardMyCompany = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [claim, setClaim] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchClaimAndCompany = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Check if user has any approved claims
        const { data: claimData, error: claimError } = await supabase
          .from('claims')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'approved')
          .single();
          
        if (claimError) {
          if (claimError.code === 'PGRST116') {
            // No claim found (single item not found)
            toast.error('You do not have any approved company claims');
            navigate('/dashboard');
            return;
          }
          throw claimError;
        }
        
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', claimData.company_id)
          .single();
          
        if (companyError) {
          throw companyError;
        }
        
        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('company_id', claimData.company_id)
          .order('created_at', { ascending: false });
          
        if (reviewsError) {
          throw reviewsError;
        }
        
        setClaim(claimData);
        setCompany(companyData);
        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Error fetching claim and company:', error);
        toast.error('Could not load company information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClaimAndCompany();
  }, [user, navigate]);
  
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>You must be logged in to access this page</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (loading) {
    return <LoadingSpinner message="Loading company dashboard..." />;
  }
  
  if (!claim || !company) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>No Access</CardTitle>
            <CardDescription>You do not have access to any company dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              To get access to a company dashboard, you need to claim a company profile and have your claim approved by our team.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link to="/vendors">Browse Companies</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground">Company Dashboard</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="mr-4" variant="outline">
            <Link to={`/vendors/${company.id}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Profile
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium">Want to stand out from competitors?</h3>
            <p className="text-sm">
              Get your company verified to build trust and attract more customers. 
              <Link to="/pricing" className="text-blue-600 hover:underline ml-1">Learn about verification</Link>
            </p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${company.is_verified ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span>{company.is_verified ? 'Verified' : 'Unverified'}</span>
                </div>
                {company.is_verified && (
                  <p className="text-xs text-muted-foreground">
                    Last verified: {new Date(company.last_verified).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                {!company.is_verified && (
                  <Button asChild size="sm">
                    <Link to="/pricing">Get Verified</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{reviews.length}</p>
                <p className="text-sm text-muted-foreground">Total reviews received</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm">
                  <Link to="#reviews">View All Reviews</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{claim.full_name}</p>
                <p className="text-sm text-muted-foreground">{claim.job_title}</p>
                <p className="text-sm text-muted-foreground">{claim.company_email}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Edit Information</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>Manage your company's public information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Company Name</h3>
                  <p>{company.name}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-1">Description</h3>
                  <p>{company.description || 'No description provided'}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-1">Website</h3>
                  <p>{company.website || 'No website provided'}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-1">Type</h3>
                  <p>{company.type}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Edit Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>Reviews from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{review.review_title || 'Review'}</h3>
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.round(review.average_score || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`} 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-sm">{(review.average_score || 0).toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{review.text_feedback}</p>
                      <p className="text-xs text-muted-foreground">
                        Posted on {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardMyCompany;
