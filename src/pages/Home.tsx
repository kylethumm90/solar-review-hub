import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Search, Star, Shield, Building } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Find and Rate the Best Solar Vendors
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            SolarGrade helps solar professionals find reliable vendors, share experiences, 
            and improve standards across the solar industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/vendors">
                <Search className="mr-2 h-5 w-5" />
                Browse Vendors
              </Link>
            </Button>
            {!user ? (
              <Button asChild variant="outline" size="lg">
                <Link to="/login?signup">Sign Up Free</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Use SolarGrade
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Transparent Reviews
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get honest feedback about solar vendors from real industry professionals who have worked with them.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Verified Companies
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We verify vendor information to ensure you're connecting with legitimate businesses.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <div className="bg-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Claim Your Company
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Company representatives can claim their business listing to respond to reviews and update information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to find the best solar vendors?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of solar professionals who use SolarGrade to make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/vendors">Start Exploring Now</Link>
            </Button>
            {!user && (
              <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white">
                <Link to="/login?signup">Sign Up or Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
