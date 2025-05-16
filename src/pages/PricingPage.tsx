
import React from 'react';

const PricingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Pricing</h1>
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">Basic</h2>
          <p className="text-gray-600 mb-4">For small businesses</p>
          <p className="text-2xl font-bold mb-4">$9.99/mo</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-2 border-primary">
          <h2 className="text-xl font-bold mb-2">Pro</h2>
          <p className="text-gray-600 mb-4">For growing businesses</p>
          <p className="text-2xl font-bold mb-4">$19.99/mo</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">Enterprise</h2>
          <p className="text-gray-600 mb-4">For large organizations</p>
          <p className="text-2xl font-bold mb-4">$49.99/mo</p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
