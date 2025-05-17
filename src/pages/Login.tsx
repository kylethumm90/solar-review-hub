import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { signIn, signUp, user } = useAuth();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      toast.success('Account created! Check your email to confirm your registration.');
      // If email confirmation is disabled, we can redirect directly
      // Otherwise, we would show a message to check email
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

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
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full mt-4">
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="signupPassword">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full mt-4">
                  {loading ? 'Signing up...' : 'Create Account'}
                </Button>
              </form>
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
