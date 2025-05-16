
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ReviewsTable from "@/components/admin/reviews/ReviewsTable";
import ReviewFilterTabs from "@/components/admin/reviews/ReviewFilterTabs";
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
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Review Moderation Queue</h1>
      </div>
      
      <div className="bg-muted/20 p-4 rounded-md mb-4">
        <h2 className="font-medium mb-2">About Review Moderation</h2>
        <p className="text-sm text-muted-foreground">
          Reviews submitted by users are initially set to "pending" and must be approved before they appear publicly. 
          Ensure all reviews meet community guidelines before approval.
        </p>
      </div>
      
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
    </div>
  );
};

export default ReviewsPage;
