
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, MapPin, Calendar, Search, Filter } from 'lucide-react';

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  // Mock job listings
  const jobs = [
    {
      id: 'JOB001',
      title: 'Software Developer Intern',
      company: 'Tech Innovations Inc.',
      companyId: 'CMP001',
      location: 'New York, USA',
      type: 'Internship',
      salary: '$20-$25/hr',
      deadline: '2025-05-15',
      description: 'Looking for a passionate software developer intern to join our team. The ideal candidate should have knowledge of web technologies and be eager to learn.',
      vacancies: 5,
      eligibility: 'Computer Science students with CGPA above 7.5',
    },
    {
      id: 'JOB002',
      title: 'Frontend Developer',
      company: 'Global Systems Ltd.',
      companyId: 'CMP002',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80,000-$100,000/year',
      deadline: '2025-05-20',
      description: 'We are looking for a skilled frontend developer with experience in modern JavaScript frameworks like React.',
      vacancies: 3,
      eligibility: 'Computer Science or related field graduates, 1-2 years experience',
    },
    {
      id: 'JOB003',
      title: 'Data Analyst',
      company: 'DataCorp Solutions',
      companyId: 'CMP003',
      location: 'Boston, USA',
      type: 'Full-time',
      salary: '$75,000-$90,000/year',
      deadline: '2025-05-25',
      description: 'Join our data team to extract insights from complex datasets and help drive business decisions.',
      vacancies: 2,
      eligibility: 'Statistics, Mathematics, or Computer Science graduates with knowledge of SQL',
    },
    {
      id: 'JOB004',
      title: 'Product Manager',
      company: 'Innovate Inc.',
      companyId: 'CMP004',
      location: 'San Francisco, USA',
      type: 'Full-time',
      salary: '$110,000-$130,000/year',
      deadline: '2025-06-05',
      description: 'Looking for an experienced product manager to oversee the complete product lifecycle.',
      vacancies: 1,
      eligibility: 'MBA preferred, 3+ years in product management',
    },
    {
      id: 'JOB005',
      title: 'UX/UI Designer',
      company: 'Creative Solutions',
      companyId: 'CMP005',
      location: 'Chicago, USA',
      type: 'Full-time',
      salary: '$85,000-$105,000/year',
      deadline: '2025-06-10',
      description: 'Design intuitive and engaging user experiences for our digital products.',
      vacancies: 2,
      eligibility: 'Design background, portfolio showing UX/UI projects',
    },
  ];
  
  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Job Listings</h1>
            <p className="text-gray-600 mt-1">Find the perfect opportunity for your career</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search jobs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-[300px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="flex items-center">
                <Filter size={16} className="mr-2" /> Filter
              </Button>
            </div>
          </div>
        </div>
        
        {/* Job Listings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Available Positions</CardTitle>
            <CardDescription>
              Showing {filteredJobs.length} job listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="py-3 px-4">Job ID</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Salary</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm">{job.id}</td>
                      <td className="py-4 px-4 font-medium">
                        <div className="flex items-start">
                          <Briefcase className="h-5 w-5 mr-2 text-portal-DEFAULT mt-1 flex-shrink-0" />
                          <div>
                            {job.title}
                            <p className="text-sm text-gray-500 mt-1">
                              Vacancies: {job.vacancies}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{job.company}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {job.location}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          job.type === 'Internship' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {job.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">{job.salary}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {job.deadline}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="outline" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Detailed Job View (can be expanded when viewing a specific job) */}
        <div className="mt-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">Featured Job</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-grow space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{jobs[0].title}</h3>
                    <p className="text-gray-600">{jobs[0].company} · {jobs[0].location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Job Description</h4>
                    <p className="text-gray-700">{jobs[0].description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Eligibility</h4>
                    <p className="text-gray-700">{jobs[0].eligibility}</p>
                  </div>
                </div>
                
                <div className="w-full md:w-64 space-y-4">
                  <Card className="bg-gray-50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type</span>
                        <span className="font-medium">{jobs[0].type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Salary</span>
                        <span className="font-medium">{jobs[0].salary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Deadline</span>
                        <span className="font-medium">{jobs[0].deadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vacancies</span>
                        <span className="font-medium">{jobs[0].vacancies}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Button 
                    className="w-full bg-portal-DEFAULT bg-portal-dark"
                    onClick={() => setShowApplyForm(true)}
                  >
                    Apply Now
                  </Button>
                    {showApplyForm && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                      <h3 className="text-xl font-bold mb-4">Apply for {jobs[0].title}</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        alert('Application submitted successfully!');
                      }}>
                        <div className="mb-4">
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                          Student ID
                        </label>
                        <Input 
                          id="studentId" 
                          type="text" 
                          required 
                          placeholder="Enter your Student ID" 
                          className="mt-1 w-full"
                        />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <Input 
                          id="password" 
                          type="password" 
                          required 
                          placeholder="Enter your password" 
                          className="mt-1 w-full"
                        />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                          Upload Resume
                        </label>
                        <Input 
                          id="resume" 
                          type="file" 
                          required 
                          className="mt-1 w-full"
                        />
                        </div>
                        <div className="flex justify-end gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowApplyForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-portal-DEFAULT bg-portal-dark">
                          Submit Application
                        </Button>
                        </div>
                      </form>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
