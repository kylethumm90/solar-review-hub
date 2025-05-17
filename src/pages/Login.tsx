
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { toast } from 'sonner';

const Login = () => {
  const [activeTab, setActiveTab] = React.useState<'login' | 'signup'>('login');
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Check for auth-related error parameters in the URL
  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      console.error('Auth error:', error, errorDescription);
      toast.error(errorDescription || `Authentication error: ${error}`);
    }
  }, [searchParams]);

  // Check if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      console.log('User already logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  // Check URL params for signup
  useEffect(() => {
    if (searchParams.get('signup') === 'true') {
      setActiveTab('signup');
    }
  }, [searchParams]);

  // Prevent rendering the login page if we're in a callback route
  if (location.pathname.includes('/auth/callback')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Processing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-4 sm:p-8 bg-white shadow-md rounded-md dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Enter your details to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal text-primary" 
                  onClick={() => setActiveTab('signup')}
                >
                  Sign up
                </Button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal text-primary" 
                  onClick={() => setActiveTab('login')}
                >
                  Log in
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
