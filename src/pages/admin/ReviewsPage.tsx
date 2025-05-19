
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewsTable from "@/components/admin/reviews/ReviewsTable";
import ReviewFilterTabs from "@/components/admin/reviews/ReviewFilterTabs";
import AnonymousReviewVerification from "@/components/admin/reviews/AnonymousReviewVerification";
import { useAdminReviews } from "@/hooks/useAdminReviews";

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
      
      <div className="flex mb-4">
        <TabsList>
          <TabsTrigger 
            value="all" 
            onClick={() => setCurrentView('all')}
            className={currentView === 'all' ? 'bg-primary text-primary-foreground' : ''}
          >
            All Reviews
          </TabsTrigger>
          <TabsTrigger 
            value="anonymous" 
            onClick={() => setCurrentView('anonymous')}
            className={currentView === 'anonymous' ? 'bg-primary text-primary-foreground' : ''}
          >
            Anonymous Reviews
          </TabsTrigger>
        </TabsList>
      </div>
      
      {currentView === 'all' ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ReviewFilterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <TabsContent value={activeTab} className="space-y-4">
            <ReviewsTable 
              reviews={reviews} 
              isLoading={isLoading}
              onApprove={(reviewId) => handleReviewAction(reviewId, 'approve')}
              onReject={(reviewId) => handleReviewAction(reviewId, 'reject')}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <AnonymousReviewVerification />
      )}
    </div>
  );
};

export default ReviewsPage;
