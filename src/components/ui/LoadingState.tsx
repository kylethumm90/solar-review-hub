
import React from 'react';

const LoadingState = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="container mx-auto py-12 flex justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
