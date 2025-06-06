
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [activeTab, setActiveTab] = React.useState<'login' | 'signup' | 'forgot-password'>('login');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Check URL params for signup
  useEffect(() => {
    if (searchParams.get('signup') === 'true') {
      setActiveTab('signup');
    }
  }, [searchParams]);

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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup' | 'forgot-password')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal text-primary" 
                  onClick={() => setActiveTab('forgot-password')}
                >
                  Forgot your password?
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>

            <TabsContent value="forgot-password">
              <ForgotPasswordForm />
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal text-primary" 
                  onClick={() => setActiveTab('login')}
                >
                  Back to login
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {activeTab !== 'forgot-password' && (
            <>
              <div className="relative mt-6 mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <GoogleLoginButton />
            </>
          )}

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
            ) : activeTab === 'signup' ? (
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
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
