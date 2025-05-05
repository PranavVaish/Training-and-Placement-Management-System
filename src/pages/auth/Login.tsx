
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast'; // If you have toast notifications

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast(); // For showing notifications
  
  // Form state
  const [role, setRole] = useState<string>('student');
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create payload for FastAPI
      const payload = {
        role,
        user_id: userId,
        password
      };

      // Send request to FastAPI backend
      const response = await fetch('http://your-fastapi-backend/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include', // Include cookies if you're using cookie-based auth
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Handle successful login
      if (data.access_token) {
        // Store token in localStorage or secure cookie
        localStorage.setItem('token', data.access_token);
        
        // If the API returns user role, use that instead of form role
        const userRole = data.role || role;
        
        // Show success notification
        toast({
          title: 'Login successful',
          description: 'Redirecting to dashboard...',
        });
        
        // Redirect based on role
        switch(userRole) {
          case 'student':
            navigate('/dashboard/student');
            break;
          case 'company':
            navigate('/dashboard/company');
            break;
          case 'admin':
            navigate('/dashboard/admin');
            break;
          default:
            navigate('/dashboard/student');
        }
      }
    } catch (error) {
      // Handle login error
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select
                  value={role}
                  onValueChange={setRole}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userId">ID</Label>
                <Input 
                  id="userId" 
                  type="number" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-portal-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              
              <p className="text-sm text-center text-gray-500">
                Don't have an account? Register as{' '}
                <Link to="/auth/register/student" className="text-portal-DEFAULT hover:underline">Student</Link>,{' '}
                <Link to="/auth/register/company" className="text-portal-DEFAULT hover:underline">Company</Link>, or{' '}
                <Link to="/auth/register/admin" className="text-portal-DEFAULT hover:underline">Admin</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
