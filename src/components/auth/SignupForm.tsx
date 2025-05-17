
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onComplete?: () => void;
  redirectTo?: string;
}

const SignupForm = ({ onComplete, redirectTo = '/dashboard' }: SignupFormProps) => {
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithProvider } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: SignupValues) {
    setLoading(true);
    try {
      const { data, error } = await signUp(values.email, values.password, values.fullName);
      
      if (error) {
        toast.error(error.message || 'Failed to create account');
        return;
      }
      
      toast.success('Account created successfully!');
      
      // If email confirmation is required, redirect to check-email page
      // This is determined by checking if the user is not immediately confirmed
      if (data && !data.session) {
        navigate('/check-email');
      } else if (onComplete) {
        onComplete();
      } else {
        navigate(redirectTo);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Starting Google sign-in');
      await signInWithProvider('google');
      // Note: No need to handle redirection here since OAuth will redirect back to the app
      // and the onAuthStateChange listener in AuthContext will handle the session
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your full name" 
                      className="pl-10" 
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      placeholder="Enter your email address" 
                      className="pl-10"
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password"
                      placeholder="Create a password" 
                      className="pl-10"
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password"
                      placeholder="Confirm your password" 
                      className="pl-10"
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          <path fill="none" d="M1 1h22v22H1z" />
        </svg>
        {loading ? 'Connecting...' : 'Continue with Google'}
      </button>
    </div>
  );
};

export default SignupForm;
