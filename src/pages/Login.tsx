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

  const from = (location.state as { from?: string })?.from;

  // ✅ Only redirect if we were sent here from a protected page
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
        // Optional: navigate('/dashboard')
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success('Account created! Please check your email.');
        // Optional: navigate('/check-email')
      }
    } catch (err: any) {
      const msg =
        err?.error?.message ||
        err?.message ||
        'Unexpected error';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">Checking session...</div>;
  }
