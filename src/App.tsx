
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import ReviewPage from './pages/ReviewPage';
import ProfilePage from './pages/ProfilePage';
import PricingPage from './pages/PricingPage';
import AdminLayout from './layouts/AdminLayout';
import Admin from './pages/Admin';
import UsersPage from './pages/admin/UsersPage';
import CompaniesPage from './pages/admin/CompaniesPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import ClaimsPage from './pages/admin/ClaimsPage';
import SettingsPage from './pages/admin/SettingsPage';
import PermissionsPage from './pages/admin/PermissionsPage';
import { Toaster } from 'sonner';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import NotFound from './pages/NotFound';
import { useToast } from '@/components/ui/use-toast';

// Import the LogsPage
import LogsPage from './pages/admin/LogsPage';

const App = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user && window.location.pathname !== '/') {
      // toast({
      //   title: "You must be logged in to view this page.",
      //   description: "Redirecting to landing page...",
      //   action: <ToastAction altText="Goto schedule">Schedule</ToastAction>,
      // })
    }
  }, [user, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          
          {/* Public routes that require authentication */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/companies/:companyId"
            element={user ? <CompanyDetailsPage /> : <Navigate to="/" />}
          />
          <Route
            path="/review/:companyId"
            element={user ? <ReviewPage /> : <Navigate to="/" />}
          />
           <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/" />}
          />
          <Route
            path="/pricing"
            element={user ? <PricingPage /> : <Navigate to="/" />}
          />

          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/companies" element={<CompaniesPage />} />
            <Route path="/admin/reviews" element={<ReviewsPage />} />
            <Route path="/admin/claims" element={<ClaimsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/permissions" element={<PermissionsPage />} />
            <Route path="/admin/logs" element={<LogsPage />} />
          </Route>

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
};

export default App;
