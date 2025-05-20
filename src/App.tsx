
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { useTheme } from '@/context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import RankingsPage from './pages/RankingsPage';

const App: React.FC = () => {
  const { theme } = useTheme();
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
          element: <div>Home Page</div>,
        },
        {
          path: 'login',
          element: <div>Login Page</div>,
        },
        {
          path: 'register',
          element: <div>Register Page</div>,
        },
        {
          path: 'pricing',
          element: <div>Pricing Page</div>,
        },
        {
          path: 'terms',
          element: <div>Terms of Service</div>,
        },
        {
          path: 'privacy',
          element: <div>Privacy Policy</div>,
        },
        {
          path: 'contact',
          element: <div>Contact Page</div>,
        },
        {
          path: 'reviews',
          element: <div>Reviews Page</div>,
        },
        {
          path: 'vendors',
          element: <div>Companies Page</div>,
        },
        {
          path: 'vendors/:companyId',
          element: <div>Company Details Page</div>,
        },
      ],
    },
    {
      path: '/account',
      element: <div>Account Layout</div>,
      children: [
        {
          path: 'profile',
          element: <div>Profile Page</div>,
        },
        {
          path: 'reviews/new/:companyId',
          element: <div>Create Review Page</div>,
        },
      ],
    },
    {
      path: '/admin',
      element: <div>Admin Layout</div>,
      children: [
        {
          path: 'dashboard',
          element: <div>Admin Dashboard</div>,
        },
        {
          path: 'users',
          element: <div>Admin Users</div>,
        },
        {
          path: 'companies',
          element: <div>Admin Companies</div>,
        },
        {
          path: 'claims',
          element: <div>Admin Claims</div>,
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
      element: <div>Not Found</div>,
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
