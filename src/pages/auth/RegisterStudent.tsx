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

export default function RegisterStudent() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    cgpa: '',
    graduationYear: '',
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
      // API endpoint for student registration
      const response = await fetch('http://127.0.0.1:8000/students/register/', {
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
        description: "You have successfully registered as a student.",
      });

      // Store token if provided by API
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }

      // Navigate to dashboard
      navigate('/dashboard/student');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from(
    { length: 6 },
    (_, i) => (currentYear + i).toString()
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
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
                    placeholder="your.email@example.com"
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
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="Enter your student ID"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange('department', value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer_science">Computer Science</SelectItem>
                      <SelectItem value="electrical">Electrical Engineering</SelectItem>
                      <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                      <SelectItem value="civil">Civil Engineering</SelectItem>
                      <SelectItem value="business">Business Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA</Label>
                  <Input
                    id="cgpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={formData.cgpa}
                    onChange={handleChange}
                    placeholder="Enter your CGPA"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select
                    value={formData.graduationYear}
                    onValueChange={(value) => handleSelectChange('graduationYear', value)}
                  >
                    <SelectTrigger id="graduationYear">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {graduationYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
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
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-portal-DEFAULT bg-portal-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register as Student'}
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
