
import React from 'react';

type ReviewFeedbackSectionProps = {
  feedback: string;
  details?: string | null;
};

const ReviewFeedbackSection = ({ feedback, details }: ReviewFeedbackSectionProps) => {
  return (
    <>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Feedback</h3>
        <p className="mt-1 whitespace-pre-line">{feedback}</p>
      </div>

      {details && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Additional Details</h3>
          <p className="mt-1 whitespace-pre-line">{details}</p>
        </div>
      )}
    </>
  );
};

export default ReviewFeedbackSection;
