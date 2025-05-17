
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CheckEmail = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-4 sm:p-8 bg-white shadow-md rounded-md dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-primary/10 p-6">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400 text-center">
            We've sent a confirmation email to your inbox. Please click the link in the email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
            Didn't receive an email? Check your spam folder or try again.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Back to Login</Link>
            </Button>
            <Button className="w-full">
              <Link to="/">Go to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckEmail;
