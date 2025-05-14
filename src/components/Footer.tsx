
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3 mb-6">
            <h2 className="text-xl font-bold text-primary mb-4">SolarGrade</h2>
            <p className="text-gray-600 dark:text-gray-400">
              The trusted platform for solar industry vendor reviews and verification.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6">
            <h3 className="text-sm font-semibold uppercase text-gray-900 dark:text-gray-100 mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/vendors" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Find Vendors
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  My Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Solar News
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Industry Resources
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 mb-6">
            <h3 className="text-sm font-semibold uppercase text-gray-900 dark:text-gray-100 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} SolarGrade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
