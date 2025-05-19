
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Reviews from './pages/Reviews';
import ReviewConfirmation from './pages/ReviewConfirmation';
import Home from './pages/Home';
import Vendors from './pages/Vendors';
import VendorDetails from './pages/VendorDetails';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ReviewPage from './pages/ReviewPage';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:vendorId" element={<VendorDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/review-page/:companyId" element={<ReviewPage />} />
          <Route path="/reviews/:vendorId" element={<Reviews />} />
          <Route path="/review-confirmation" element={<ReviewConfirmation />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
