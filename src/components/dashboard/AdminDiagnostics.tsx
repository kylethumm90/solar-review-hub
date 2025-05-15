
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { diagnoseAuthIssues, grantAdminRole } from '@/utils/authDebug';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Shield, RefreshCw, Wrench } from 'lucide-react';

const AdminDiagnostics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  
  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const result = await diagnoseAuthIssues();
      setDiagnosticResult(result);
    } finally {
      setIsLoading(false);
    }
  };
  
  const forceAdminGrant = async () => {
    setIsLoading(true);
    try {
      const result = await grantAdminRole();
      setDiagnosticResult(result);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Admin Access Diagnostics
        </CardTitle>
        <CardDescription>
          Troubleshoot admin dashboard access issues
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {user?.user_metadata?.role !== 'admin' && (
          <Alert variant="warning" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Not an Admin</AlertTitle>
            <AlertDescription>
              Your user account doesn't have the admin role assigned in metadata.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Current Role:</p>
            <p className="text-lg font-bold capitalize">{user?.user_metadata?.role || 'User'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">User ID:</p>
            <p className="text-xs text-gray-500 break-all">{user?.id || 'Not logged in'}</p>
          </div>
          
          {diagnosticResult && (
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm mt-3 overflow-auto">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(diagnosticResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        <Button 
          onClick={runDiagnostics} 
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running diagnostics...
            </>
          ) : (
            <>
              <Wrench className="mr-2 h-4 w-4" />
              Run Auth Diagnostics
            </>
          )}
        </Button>
        
        <Button 
          onClick={forceAdminGrant} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Granting admin...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Force Grant Admin Role
            </>
          )}
        </Button>
        
        {user?.user_metadata?.role === 'admin' && (
          <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            <a 
              href="/admin" 
              className="text-primary hover:underline"
            >
              Go to Admin Dashboard
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AdminDiagnostics;
