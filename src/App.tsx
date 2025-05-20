import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { useTheme } from 'next-themes';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AccountLayout from './layouts/AccountLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import ReviewsPage from './pages/ReviewsPage';
import PricingPage from './pages/PricingPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminClaimsPage from './pages/admin/AdminClaimsPage';
import CreateReviewPage from './pages/CreateReviewPage';
import RankingsPage from './pages/RankingsPage';

const App: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple check to prevent SSR issues with next-themes
  if (!mounted) {
    return null;
  }

  const routes = [
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        {
          path: '',
          element: <HomePage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'register',
          element: <RegisterPage />,
        },
        {
          path: 'pricing',
          element: <PricingPage />,
        },
        {
          path: 'terms',
          element: <TermsOfServicePage />,
        },
        {
          path: 'privacy',
          element: <PrivacyPolicyPage />,
        },
        {
          path: 'contact',
          element: <ContactPage />,
        },
        {
          path: 'reviews',
          element: <ReviewsPage />,
        },
        {
          path: 'vendors',
          element: <CompaniesPage />,
        },
        {
          path: 'vendors/:companyId',
          element: <CompanyDetailsPage />,
        },
      ],
    },
    {
      path: '/account',
      element: <AccountLayout />,
      children: [
        {
          path: 'profile',
          element: <ProfilePage />,
        },
        {
          path: 'reviews/new/:companyId',
          element: <CreateReviewPage />,
        },
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        {
          path: 'dashboard',
          element: <AdminDashboardPage />,
        },
        {
          path: 'users',
          element: <AdminUsersPage />,
        },
        {
          path: 'companies',
          element: <AdminCompaniesPage />,
        },
        {
          path: 'claims',
          element: <AdminClaimsPage />,
        },
      ],
    },
    {
      path: '/rankings',
      element: <PublicLayout />,
      children: [
        {
          path: '',
          element: <RankingsPage />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ];

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Router>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              >
                {route.children &&
                  route.children.map((child, childIndex) => (
                    <Route
                      key={childIndex}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
              </Route>
            ))}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
