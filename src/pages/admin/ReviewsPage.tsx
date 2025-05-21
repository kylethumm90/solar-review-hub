
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewsTable from "@/components/admin/reviews/ReviewsTable";
import ReviewFilterTabs from "@/components/admin/reviews/ReviewFilterTabs";
import AnonymousReviewVerification from "@/components/admin/reviews/AnonymousReviewVerification";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { Review } from "@/types"; // Make sure we're using the correct Review type

const ReviewsPage = () => {
  const {
    reviews,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleReviewAction
  } = useAdminReviews();
  
  const [currentView, setCurrentView] = useState<'all' | 'anonymous'>('all');
  
  // Ensure reviews have reviewer_id to match the Review type
  const typedReviews: Review[] = reviews.map(review => ({
    ...review,
    reviewer_id: review.user_id || 'unknown'
  })) as Review[];
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Review Moderation Queue</h1>
      </div>
      
      <div className="bg-muted/20 p-4 rounded-md mb-4">
        <h2 className="font-medium mb-2">About Review Moderation</h2>
        <p className="text-sm text-muted-foreground">
          Reviews submitted by users are initially set to "pending" and must be approved before they appear publicly. 
          Anonymous reviews require verification of supporting documentation.
        </p>
      </div>
      
      <Tabs value={currentView === 'all' ? 'all' : 'anonymous'} onValueChange={(val) => setCurrentView(val as 'all' | 'anonymous')}>
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="anonymous">Anonymous Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
            <ReviewFilterTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            
            <TabsContent value={activeTab} className="space-y-4">
              <ReviewsTable 
                reviews={typedReviews} 
                isLoading={isLoading}
                onApprove={(reviewId) => handleReviewAction(reviewId, 'approve')}
                onReject={(reviewId) => handleReviewAction(reviewId, 'reject')}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="anonymous">
          <div className="mt-6">
            <AnonymousReviewVerification />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsPage;
