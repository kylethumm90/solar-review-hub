
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Review, Claim } from '@/types';
import { Calendar, Star, File, Building } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { user } = useAuth();

  // Use React Query for data fetching to prevent unnecessary re-renders
  const fetchReviews = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        company:companies(id, name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  };

  const fetchClaims = async () => {
    if (!user) return [];
    
    const { data: claimsData, error } = await supabase
      .from('claims')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // If claims fetch succeeded, get company names in a separate query
    const claimsWithCompanies = [];
    
    for (const claim of claimsData || []) {
      if (claim.company_id) {
        // Fetch company for this claim
        const { data: companyData } = await supabase
          .from('companies')
          .select('id, name')
          .eq('id', claim.company_id)
          .single();
          
        claimsWithCompanies.push({
          ...claim,
          company: companyData
        });
      } else {
        claimsWithCompanies.push(claim);
      }
    }
    
    return claimsWithCompanies;
  };

  // Use React Query hooks for data fetching
  const { 
    data: reviews = [], 
    isLoading: isReviewsLoading 
  } = useQuery({
    queryKey: ['dashboard-reviews', user?.id],
    queryFn: fetchReviews,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (err) => {
      console.error('Error fetching reviews:', err);
      toast('Error loading reviews', {
        description: "Please try again later"
      });
    }
  });

  const { 
    data: claims = [], 
    isLoading: isClaimsLoading 
  } = useQuery({
    queryKey: ['dashboard-claims', user?.id],
    queryFn: fetchClaims,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (err) => {
      console.error('Error fetching claims:', err);
      toast('Error loading claims', {
        description: "Please try again later"
      });
    }
  });

  const isLoading = isReviewsLoading || isClaimsLoading;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Welcome back, {user?.user_metadata?.full_name}
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your data...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Reviews</h3>
                  </div>
                  <p className="text-2xl font-bold">{reviews.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {reviews.length === 1 ? 'Review' : 'Reviews'} submitted
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Building className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Claims</h3>
                  </div>
                  <p className="text-2xl font-bold">{claims.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {claims.length === 1 ? 'Claim' : 'Claims'} submitted
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Member Since</h3>
                  </div>
                  <p className="text-lg font-medium">
                    {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Recent Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Reviews</h2>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard/reviews">View All</Link>
                </Button>
              </div>
              
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {review.company?.name || 'Unknown Company'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>
                            {(
                              (review.rating_communication +
                              review.rating_install_quality +
                              review.rating_payment_reliability +
                              review.rating_timeliness +
                              review.rating_post_install_support) / 5
                            ).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {review.text_feedback}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <File className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">You haven't submitted any reviews yet.</p>
                  <Button asChild className="mt-4">
                    <Link to="/vendors">Browse Vendors</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium">{user?.user_metadata?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                  <p className="font-medium capitalize">{user?.user_metadata?.role || 'User'}</p>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/profile">Edit Profile</Link>
                </Button>
              </div>
            </div>
            
            {/* Claims Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Claim Requests</h2>
              
              {claims.length > 0 ? (
                <div className="space-y-4">
                  {claims.slice(0, 3).map((claim) => (
                    <div key={claim.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <h3 className="font-medium">
                        {claim.company?.name || 'Unknown Company'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {formatDate(claim.created_at)}
                      </p>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${claim.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                          claim.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : 
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}`}>
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </div>
                    </div>
                  ))}
                  {claims.length > 3 && (
                    <Button asChild variant="link" className="w-full">
                      <Link to="/dashboard/claims">View All Claims</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Building className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No company claims submitted</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link to="/vendors">Claim Your Company</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
