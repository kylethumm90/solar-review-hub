import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Reviews from './pages/Reviews';
import ReviewConfirmation from './pages/ReviewConfirmation';
import Home from './pages/Home';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import Claims from './pages/Claims';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import VerifyEmail from './pages/VerifyEmail';
import Admin from './pages/Admin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { VerifiedRepRoute } from './components/VerifiedRepRoute';
import { AdminRoute } from './components/AdminRoute';
import CompanyClaim from './pages/CompanyClaim';
import ReviewPage from './pages/ReviewPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:vendorId" element={<VendorDetails />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/company-claim" element={<CompanyClaim />} />
          <Route path="/review-page/:companyId" element={<ReviewPage />} />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />
          
          <Route path="/reviews/:vendorId" element={<Reviews />} />
          <Route path="/review-confirmation" element={<ReviewConfirmation />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
