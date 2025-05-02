import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { Edit, FileText, Clock, Check, X } from 'lucide-react';

export default function StudentDashboard() {
  // State for profile editing dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  // Mock data for student profile
  const [studentProfile, setStudentProfile] = useState({
    name: 'John Smith',
    id: 'ST12345',
    email: 'john.smith@example.com',
    phone: '(123) 456-7890',
    department: 'Computer Science',
    cgpa: '8.5',
    graduationYear: '2025'
  });
  
  // Mock data for job applications
  const jobApplications = [
    {
      applicationId: 'APP001',
      jobId: 'JOB123',
      company: 'Tech Innovations Inc.',
      position: 'Software Developer Intern',
      applicationDate: '2025-03-10',
      status: 'Pending',
      interviewSchedule: 'Not scheduled'
    },
    {
      applicationId: 'APP002',
      jobId: 'JOB456',
      company: 'Global Systems Ltd.',
      position: 'Frontend Developer',
      applicationDate: '2025-03-12',
      status: 'Shortlisted',
      interviewSchedule: '2025-03-25, 10:00 AM'
    },
    {
      applicationId: 'APP003',
      jobId: 'JOB789',
      company: 'DataCorp Solutions',
      position: 'Data Analyst',
      applicationDate: '2025-03-15',
      status: 'Rejected',
      interviewSchedule: 'N/A'
    },
  ];
  
  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler for opening the edit dialog
  const handleEditProfile = () => {
    setEditedProfile({...studentProfile});
    setIsEditDialogOpen(true);
  };
  
  // Handler for saving profile changes
  const handleSaveProfile = () => {
    if (editedProfile) {
      setStudentProfile(editedProfile);
      setIsEditDialogOpen(false);
    }
  };
  
  // Handler for input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button variant="outline" size="sm" onClick={handleEditProfile}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-500">Name</h3>
                <p>{studentProfile.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Student ID</h3>
                <p>{studentProfile.id}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Email</h3>
                <p>{studentProfile.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Phone</h3>
                <p>{studentProfile.phone}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Department</h3>
                <p>{studentProfile.department}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">CGPA</h3>
                <p>{studentProfile.cgpa}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Graduation Year</h3>
                <p>{studentProfile.graduationYear}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Applications Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Job Applications</CardTitle>
                <Button asChild>
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="active">Active Applications</TabsTrigger>
                  <TabsTrigger value="history">Application History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="mt-4">
                  {jobApplications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 border-b">
                            <th className="py-3 px-2">Position</th>
                            <th className="py-3 px-2">Company</th>
                            <th className="py-3 px-2">Date Applied</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2">Interview</th>
                            <th className="py-3 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobApplications.map((application) => (
                            <tr key={application.applicationId} className="border-b">
                              <td className="py-3 px-2 font-medium">{application.position}</td>
                              <td className="py-3 px-2">{application.company}</td>
                              <td className="py-3 px-2">{application.applicationDate}</td>
                              <td className="py-3 px-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(application.status)}`}>
                                  {application.status}
                                </span>
                              </td>
                              <td className="py-3 px-2">{application.interviewSchedule}</td>
                              <td className="py-3 px-2">
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No active applications. Start applying for jobs now!
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="text-center py-8 text-gray-500">
                    Your application history will appear here.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Training Enrollments */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Training Enrollments</CardTitle>
                <Button asChild>
                  <Link to="/training">Browse Programs</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="py-3 px-2">Program</th>
                      <th className="py-3 px-2">Enrollment ID</th>
                      <th className="py-3 px-2">Duration</th>
                      <th className="py-3 px-2">Start Date</th>
                      <th className="py-3 px-2">Completion Status</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Web Development Fundamentals</td>
                      <td className="py-3 px-2">ENR001</td>
                      <td className="py-3 px-2">8 weeks</td>
                      <td className="py-3 px-2">2025-04-01</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-yellow-500 mr-1" /> In Progress
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Button variant="outline" size="sm">
                          Access Course
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Data Science Essentials</td>
                      <td className="py-3 px-2">ENR002</td>
                      <td className="py-3 px-2">4 weeks</td>
                      <td className="py-3 px-2">2025-02-15</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-1" /> Completed
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Button variant="outline" size="sm">
                          Certificate
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Edit Profile Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input 
                  id="name" 
                  value={editedProfile?.name || ''} 
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="id" className="text-sm font-medium">Student ID</label>
                <Input 
                  id="id" 
                  value={editedProfile?.id || ''} 
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  value={editedProfile?.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Input 
                  id="phone" 
                  value={editedProfile?.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">Department</label>
                <Input 
                  id="department" 
                  value={editedProfile?.department || ''} 
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="cgpa" className="text-sm font-medium">CGPA</label>
                <Input 
                  id="cgpa" 
                  value={editedProfile?.cgpa || ''} 
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="graduationYear" className="text-sm font-medium">Graduation Year</label>
                <Input 
                  id="graduationYear" 
                  value={editedProfile?.graduationYear || ''} 
                  disabled
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}