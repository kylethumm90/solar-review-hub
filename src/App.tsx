
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import Home from './pages/Home';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import ReviewsPage from './pages/Reviews';
import Pricing from './pages/PricingPage';
import About from './pages/Index';
import Contact from './pages/Contact';
import Terms from './pages/TermsOfService';
import Privacy from './pages/PrivacyPolicy';
import Dashboard from './pages/Dashboard';
import CompanyDashboard from './pages/dashboard/DashboardMyCompany';
import DashboardProfilePage from './pages/dashboard/DashboardProfilePage';
import DashboardReviews from './pages/dashboard/DashboardReviews';
import DashboardClaims from './pages/dashboard/DashboardClaims';
import ProtectedRoute from './components/auth/LoginForm'; // Temporary replacement
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "sonner";
import Rankings from './pages/Rankings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes with PublicLayout */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendors/:id" element={<VendorDetails />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="rankings" element={<Rankings />} />
          </Route>
          
          {/* Protected routes with ProtectedLayout */}
          <Route path="/dashboard" element={<ProtectedLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<DashboardProfilePage />} />
            <Route path="reviews" element={<DashboardReviews />} />
            <Route path="claims" element={<DashboardClaims />} />
            <Route path="company/:companyId" element={<CompanyDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
