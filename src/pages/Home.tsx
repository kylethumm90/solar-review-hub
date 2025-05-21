
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to SolarGrade</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          The trusted community for reviewing and finding top solar industry partners.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/vendors">Browse Companies</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/create-listing">List Your Company</Link>
          </Button>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Find Partners</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover vetted solar companies with verified reviews and ratings.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Share Experiences</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Help the community by reviewing companies you've worked with.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Grow Your Business</h3>
            <p className="text-gray-600 dark:text-gray-300">
              List your company and build your reputation with verified reviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
