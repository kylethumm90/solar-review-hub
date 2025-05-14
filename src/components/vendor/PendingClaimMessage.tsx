
import React from 'react';

const PendingClaimMessage: React.FC = () => {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4">
      <p className="text-yellow-800 dark:text-yellow-300">
        You already have a pending claim for this vendor. Our team is reviewing your request and will respond within 1-2 business days.
      </p>
    </div>
  );
};

export default PendingClaimMessage;
