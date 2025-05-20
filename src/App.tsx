import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/pages/Home';
import Vendors from '@/pages/Vendors';
import VendorDetails from '@/pages/VendorDetails';
import ReviewsPage from '@/pages/ReviewsPage';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Dashboard from '@/pages/Dashboard';
import CompanyDashboard from '@/pages/CompanyDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from "sonner";
import Rankings from '@/pages/Rankings';

function App() {
  return (
    <Router>
      <Routes>
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
        </Route>
        <Route
          path="/dashboard"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route
          path="/company-dashboard/:companyId"
          element={
            <AuthProvider>
              <ProtectedRoute>
                <CompanyDashboard />
              </ProtectedRoute>
            </AuthProvider>
          }
        />
        <Route path="/rankings" element={<Rankings />} />
      </Routes>
    </Router>
  );
}

export default App;
