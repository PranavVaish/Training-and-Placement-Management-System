
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Edit, Plus, FileText, Users, Briefcase } from 'lucide-react';

export default function CompanyDashboard() {
  // Mock data for company profile
  const companyProfile = {
    name: 'Tech Innovations Inc.',
    id: 'CMP12345',
    email: 'hr@techinnovations.com',
    phone: '(123) 456-7890',
    industryType: 'Technology',
    website: 'www.techinnovations.com',
    location: 'New York, USA',
    contactPerson: 'Jane Wilson'
  };
  
  // Mock data for job listings
  const jobListings = [
    {
      id: 'JOB123',
      title: 'Software Developer Intern',
      type: 'Internship',
      location: 'New York',
      department: 'Engineering',
      postedDate: '2025-03-10',
      applications: 15,
      status: 'Active',
      deadline: '2025-04-10'
    },
    {
      id: 'JOB456',
      title: 'Frontend Developer',
      type: 'Full-time',
      location: 'Remote',
      department: 'Engineering',
      postedDate: '2025-03-12',
      applications: 24,
      status: 'Active',
      deadline: '2025-04-15'
    },
    {
      id: 'JOB789',
      title: 'Data Analyst',
      type: 'Full-time',
      location: 'New York',
      department: 'Data Science',
      postedDate: '2025-03-15',
      applications: 18,
      status: 'Active',
      deadline: '2025-04-20'
    },
  ];
  
  // Mock data for hiring history
  const hiringHistory = [
    {
      id: 'HIR001',
      jobId: 'JOB001',
      position: 'UX Designer',
      hireDate: '2025-01-15',
      candidate: 'Michael Brown',
      department: 'Design',
      status: 'Onboarded'
    },
    {
      id: 'HIR002',
      jobId: 'JOB002',
      position: 'Backend Developer',
      hireDate: '2025-02-10',
      candidate: 'Sarah Johnson',
      department: 'Engineering',
      status: 'Onboarded'
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Company Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Company Profile</CardTitle>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-500">Company Name</h3>
                <p>{companyProfile.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Company ID</h3>
                <p>{companyProfile.id}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Email</h3>
                <p>{companyProfile.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Phone</h3>
                <p>{companyProfile.phone}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Industry</h3>
                <p>{companyProfile.industryType}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Website</h3>
                <p>{companyProfile.website}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Location</h3>
                <p>{companyProfile.location}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Contact Person</h3>
                <p>{companyProfile.contactPerson}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Job Listings Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Job Listings</CardTitle>
                  <CardDescription>Manage your active job postings</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Create New Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="py-3 px-2">Job Title</th>
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2">Posted Date</th>
                      <th className="py-3 px-2">Applications</th>
                      <th className="py-3 px-2">Deadline</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobListings.map((job) => (
                      <tr key={job.id} className="border-b">
                        <td className="py-3 px-2 font-medium">{job.title}</td>
                        <td className="py-3 px-2">{job.type}</td>
                        <td className="py-3 px-2">{job.postedDate}</td>
                        <td className="py-3 px-2">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.applications}
                          </span>
                        </td>
                        <td className="py-3 px-2">{job.deadline}</td>
                        <td className="py-3 px-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Hiring History */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hiring History</CardTitle>
                  <CardDescription>Overview of your past hiring activities</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="py-3 px-2">Hire ID</th>
                      <th className="py-3 px-2">Position</th>
                      <th className="py-3 px-2">Department</th>
                      <th className="py-3 px-2">Candidate</th>
                      <th className="py-3 px-2">Hire Date</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hiringHistory.map((hire) => (
                      <tr key={hire.id} className="border-b">
                        <td className="py-3 px-2">{hire.id}</td>
                        <td className="py-3 px-2 font-medium">{hire.position}</td>
                        <td className="py-3 px-2">{hire.department}</td>
                        <td className="py-3 px-2">{hire.candidate}</td>
                        <td className="py-3 px-2">{hire.hireDate}</td>
                        <td className="py-3 px-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {hire.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
