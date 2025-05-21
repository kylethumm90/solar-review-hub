
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import CompanyClaimForm from '@/components/claim/CompanyClaimForm';
import { FAQ } from '@/components/claim/FAQ';
import { Step } from '@/components/claim/Step';
import { Button } from '@/components/ui/button';

const ClaimCompanyPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSuccess = () => {
    setFormSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Claim Your Company | SolarGrade</title>
        <meta name="description" content="Claim or create your company listing on SolarGrade - the trusted platform for solar industry ratings and reviews." />
      </Helmet>

      <div className="w-full bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
        {formSubmitted ? (
          <ConfirmationSection />
        ) : (
          <main className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <section className="max-w-5xl mx-auto text-center py-10 md:py-16">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Be Seen. Be Rated. Be Trusted.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                SolarGrade is where the industry goes to research and rate solar companies.
              </p>
              <Button 
                variant="default" 
                size="lg" 
                className="mt-6"
                onClick={() => document.getElementById('claim-form-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started – It's Free
              </Button>

              {/* Trust Indicators */}
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 text-sm text-muted-foreground max-w-4xl mx-auto">
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Used by 500+ solar pros
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Transparent third-party grading
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  EPCs, Sales Orgs, Vendors, Software
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free to claim your listing
                </li>
              </ul>
            </section>

            {/* Form Section */}
            <section id="claim-form-section" className="max-w-4xl mx-auto mt-8 md:mt-16">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-semibold mb-4">What You Get With a Free Profile</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Show up in SolarGrade search results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Display your official SolarGrade letter rating</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Collect and respond to verified reviews</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Appear in industry Power Rankings</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-medium mb-4">How It Works</h3>
                    <div className="space-y-4">
                      <Step 
                        number={1} 
                        title="Claim or Create" 
                        description="Tell us about your company." 
                      />
                      <Step 
                        number={2} 
                        title="Get Verified" 
                        description="We confirm your role and listing." 
                      />
                      <Step 
                        number={3} 
                        title="Build Trust" 
                        description="Collect reviews, earn your grade." 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-purple-50 dark:bg-gray-800 p-6 rounded-lg">
                    <blockquote className="text-lg italic text-muted-foreground">
                      "It's like a Better Business Bureau for solar. We claimed our profile and immediately gained visibility."
                    </blockquote>
                    <p className="text-sm font-semibold mt-2">— Verified Sales Org</p>
                  </div>
                </div>
                
                <div className="lg:col-span-3">
                  <CompanyClaimForm onSuccess={handleFormSuccess} />
                </div>
              </div>
            </section>
            
            {/* FAQ Section */}
            <section className="max-w-3xl mx-auto mt-16 mb-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <FAQ
                  question="Is this really free?"
                  answer="Yes. Creating and managing a basic profile is completely free."
                />
                <FAQ
                  question="What happens after I submit?"
                  answer="We verify your identity and activate your listing. This usually takes 1-2 business days."
                />
                <FAQ
                  question="Can I respond to reviews?"
                  answer="Yes, after your profile is verified, you'll have full access to respond to any reviews your company receives."
                />
                <FAQ
                  question="Who can see my company profile?"
                  answer="Your profile is public and can be viewed by anyone in the solar industry looking for trusted partners."
                />
                <FAQ
                  question="How is the grade calculated?"
                  answer="Your SolarGrade rating is based on verified reviews from industry professionals who have worked with your company."
                />
              </div>
            </section>
          </main>
        )}
      </div>
    </>
  );
};

const ConfirmationSection = () => {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">You're In!</h2>
        <p className="mt-2 text-muted-foreground">
          We'll review your submission and notify you once you're verified.
        </p>
        <Button className="mt-6" asChild>
          <a href="/dashboard">Go to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default ClaimCompanyPage;
