
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CombinedListingForm } from '@/components/vendor/CombinedListingForm';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreateListingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  
  const handleSuccessfulSubmission = () => {
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {submitted ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center mt-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Thanks for submitting your listing!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're reviewing your information. You'll be notified once it's approved and your profile is live.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Go to My Dashboard
          </Button>
        </div>
      ) : (
        <>
          <section className="mb-10">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 p-8 rounded-lg shadow-md">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Get Discovered on SolarGrade</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                List your company for free and start building trust with thousands of verified solar professionals.
              </p>
              
              <ul className="grid md:grid-cols-2 gap-4 mt-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <span>Show up in vendor search results</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <span>Collect verified reviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <span>Display your SolarGrade letter rating</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  <span>Respond to feedback and manage your reputation</span>
                </li>
              </ul>
              
              <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-blue-500" />
                  <h3 className="font-semibold">Trusted by industry leaders</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Used by 100+ solar professionals to build and manage their business reputation.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">
              {user ? 'Add Your Company' : 'Create Your Account & Company Listing'}
            </h2>
            
            <CombinedListingForm onSuccess={handleSuccessfulSubmission} />
          </section>
          
          <section className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <details className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                <summary className="font-medium cursor-pointer">
                  What happens after I submit?
                </summary>
                <div className="mt-2 text-gray-600 dark:text-gray-300 pl-4">
                  <p>After you submit your company listing, our team will review the information to ensure accuracy. 
                  This typically takes 1-2 business days. Once approved, your profile will be live on SolarGrade and 
                  you'll receive access to manage your company profile and interact with reviews.</p>
                </div>
              </details>
              
              <details className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                <summary className="font-medium cursor-pointer">
                  How do I claim an existing company?
                </summary>
                <div className="mt-2 text-gray-600 dark:text-gray-300 pl-4">
                  <p>If your company is already listed on SolarGrade, you can claim ownership by finding your 
                  company in search results, viewing the profile, and clicking the "Claim this company" button. 
                  You'll need to verify your association with the company.</p>
                </div>
              </details>
              
              <details className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                <summary className="font-medium cursor-pointer">
                  Is there a cost to list my company?
                </summary>
                <div className="mt-2 text-gray-600 dark:text-gray-300 pl-4">
                  <p>Basic listings are completely free. Premium features like enhanced profile customization, 
                  priority in search results, and detailed analytics are available with paid plans.</p>
                </div>
              </details>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default CreateListingPage;
