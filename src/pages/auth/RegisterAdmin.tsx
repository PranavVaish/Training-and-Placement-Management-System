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
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MainLayout from '@/components/layout/MainLayout';

export default function RegisterAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    adminId: '',
    role: '',
    password: ''
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  
  // Handle select changes
  const handleSelectChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // API endpoint for admin registration
      const response = await fetch('http://localhost:8000/api/admins/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      // Success case
      toast({
        title: "Registration Successful",
        description: "You have successfully registered as an admin.",
      });
      
      // Store token if provided by API
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      
      // Navigate to dashboard
      navigate('/dashboard/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
          </CardHeader>
          
          {error && (
            <div className="px-6 mb-4">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminId">Admin ID</Label>
                  <Input 
                    id="adminId" 
                    value={formData.adminId}
                    onChange={handleChange}
                    placeholder="Enter admin ID" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Admin Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    {/* Add other roles as needed */}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-portal-DEFAULT bg-portal-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register as Admin'}
              </Button>
              
              <p className="text-sm text-center text-gray-500">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-portal-DEFAULT hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
