
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user, isLoading } = useAuth();

  const initialMode = location.search === '?signup' ? false : true;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Only redirect if they were sent here from a protected route
  const from = (location.state as { from?: string })?.from;

  useEffect(() => {
    if (!isLoading && user && from) {
      navigate(from, { replace: true });
    }
  }, [user, isLoading, from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Logged in!');
        // You can optionally navigate to /dashboard here:
        // navigate('/dashboard');
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success('Account created! Please check your email.');
        // Optionally navigate to a /check-email page here
      }
    } catch (err: any) {
      const msg = err?.error?.message || err?.message || 'Unexpected error';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">Checking session...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        {isLoginMode ? 'Log In' : 'Create Account'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? isLoginMode
              ? 'Logging in...'
              : 'Creating account...'
            : isLoginMode
              ? 'Log In'
              : 'Sign Up'}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        {isLoginMode ? (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => setIsLoginMode(false)}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setIsLoginMode(true)}
              className="text-blue-600 hover:underline"
            >
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
