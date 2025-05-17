
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
  const { signIn, signUp, user } = useAuth();

  const from = (location.state as { from?: string })?.from || '/';
  const initialMode = location.search === '?signup' ? false : true;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Safe redirect once auth is loaded
  useEffect(() => {
