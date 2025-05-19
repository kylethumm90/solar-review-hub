
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompanyHeader from '@/components/dashboard/company/CompanyHeader';
import CompanyDashboard from '@/components/dashboard/company/CompanyDashboard';
import CompanyProfile from '@/components/dashboard/company/CompanyProfile';
import ReviewsList from '@/components/dashboard/company/ReviewsList';

const DashboardMyCompany = () => {
  const { user, isAdmin } = useAuth();
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
        // For admin users, we'll fetch the first available company if they don't have claims
        const isUserAdmin = isAdmin();
        
        // Check if user has any approved claims
        const { data: claimData, error: claimError } = await supabase
          .from('claims')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'approved')
          .single();
          
        if (claimError) {
          console.log('Claim error:', claimError);
          
          // If the user is an admin but has no claims, fetch the first company
          if (isUserAdmin) {
            console.log('Admin user without claims - fetching first company');
            
            // Fetch first company for admin
            const { data: companiesData, error: companiesError } = await supabase
              .from('companies')
              .select('*')
              .limit(1);
              
            if (companiesError || !companiesData || companiesData.length === 0) {
              throw new Error('No companies found');
            }
            
            // Create a placeholder claim for admin
            const adminClaim = {
              id: 'admin-placeholder',
              user_id: user.id,
              company_id: companiesData[0].id,
              full_name: user?.user_metadata?.full_name || 'Admin User',
              job_title: 'Administrator',
              company_email: user.email,
              status: 'approved',
              created_at: new Date().toISOString()
            };
            
            setClaim(adminClaim);
            setCompany(companiesData[0]);
            
            // Fetch reviews for this company
            const { data: reviewsData, error: reviewsError } = await supabase
              .from('reviews')
              .select('*')
              .eq('company_id', companiesData[0].id)
              .order('created_at', { ascending: false });
              
            if (!reviewsError) {
              setReviews(reviewsData || []);
            }
            
            setLoading(false);
            return;
          } else {
            // Not an admin and no claims
            if (claimError.code === 'PGRST116') {
              // No claim found (single item not found)
              toast.error('You do not have any approved company claims');
              navigate('/dashboard');
              return;
            }
            throw claimError;
          }
        }
        
        // Regular user with approved claim - fetch their company details
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
  }, [user, navigate, isAdmin]);
  
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
      <CompanyHeader 
        companyName={company.name} 
        companyId={company.id}
      />
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <CompanyDashboard 
            company={company}
            claim={claim}
            reviewsCount={reviews.length}
          />
        </TabsContent>
        
        <TabsContent value="profile">
          <CompanyProfile company={company} />
        </TabsContent>
        
        <TabsContent value="reviews">
          <ReviewsList reviews={reviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardMyCompany;
