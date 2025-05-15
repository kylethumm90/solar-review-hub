
import React from 'react';

type ReviewAnswerProps = {
  question: string;
  rating: number;
  notes?: string | null;
};

const ReviewAnswer = ({ question, rating, notes }: ReviewAnswerProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
      <p className="text-sm font-medium">{question}</p>
      <div className="flex items-center mt-2">
        <span className="text-sm font-bold mr-2">Rating: {rating}/5</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      {notes && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Notes: {notes}
        </p>
      )}
    </div>
  );
};

export default ReviewAnswer;
