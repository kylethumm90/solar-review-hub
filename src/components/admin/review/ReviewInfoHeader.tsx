
import React from 'react';

type ReviewInfoHeaderProps = {
  companyName: string | undefined;
  reviewerName: string | undefined;
  score: number | null | undefined;
  title: string | null | undefined;
};

const ReviewInfoHeader = ({
  companyName,
  reviewerName,
  score,
  title
}: ReviewInfoHeaderProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Company</h3>
        <p className="mt-1">{companyName || 'Unknown'}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Reviewer</h3>
        <p className="mt-1">{reviewerName || 'Unknown'}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
        <p className="mt-1">{score?.toFixed(1) || 'N/A'}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Title</h3>
        <p className="mt-1">{title || 'Untitled'}</p>
      </div>
    </div>
  );
};

export default ReviewInfoHeader;
