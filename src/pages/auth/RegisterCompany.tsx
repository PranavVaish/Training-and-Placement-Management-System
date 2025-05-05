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

export default function RegisterCompany() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyId: '',
    industryType: '',
    website: '',
    location: '',
    contactPerson: '',
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
      // API endpoint for company registration
      const response = await fetch('http://localhost:8000/api/companies/register', {
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
        description: "Your company has been successfully registered.",
      });
      
      // Store token if provided by API
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      
      // Navigate to dashboard
      navigate('/dashboard/company');
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
            <CardTitle className="text-2xl font-bold">Company Registration</CardTitle>
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
                  <Label htmlFor="name">Company Name</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter company name" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Company Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="company@example.com" 
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
                    placeholder="Enter company phone number" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyId">Company ID/Registration Number</Label>
                  <Input 
                    id="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    placeholder="Enter company registration ID" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industryType">Industry Type</Label>
                  <Select
                    value={formData.industryType}
                    onValueChange={(value) => handleSelectChange('industryType', value)}
                  >
                    <SelectTrigger id="industryType">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input 
                    id="website" 
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person Name</Label>
                  <Input 
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Name of representative" 
                    required 
                  />
                </div>
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
                {isLoading ? 'Registering...' : 'Register as Company'}
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