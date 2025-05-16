
import React from 'react';
import { useParams } from 'react-router-dom';

const ReviewPage = () => {
  const { companyId } = useParams<{ companyId: string }>();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Write a Review</h1>
      <p className="text-gray-600">Company ID: {companyId}</p>
    </div>
  );
};

export default ReviewPage;
