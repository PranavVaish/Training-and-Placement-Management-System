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
import { Search } from 'lucide-react';

const jobs = [
  {
    id: 'JOB001',
    title: 'Software Developer Intern',
    company: 'Tech Innovations Inc.',
    location: 'New York, USA',
    type: 'Internship',
    salary: '$20-$25/hr',
    deadline: '2025-05-15',
    description: 'Looking for a passionate software developer intern to join our team.',
    vacancies: 5,
    eligibility: 'Computer Science students with CGPA above 7.5',
  },
  {
    id: 'JOB002',
    title: 'Frontend Developer',
    company: 'Global Systems Ltd.',
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
    company: 'Data Insights Co.',
    location: 'San Francisco, USA',
    type: 'Part-time',
    salary: '$50-$60/hr',
    deadline: '2025-06-01',
    description: 'Seeking a data analyst to help us make data-driven decisions.',
    vacancies: 2,
    eligibility: 'Experience with SQL and data visualization tools',
  },
  // ... more jobs ...
  {
    id: 'JOB004',
    title: 'Project Manager',
    company: 'Business Solutions Group',
    location: 'Chicago, USA',
    type: 'Contract',
    salary: '$90,000-$120,000/year',
    deadline: '2025-06-15',
    description: 'Looking for an experienced project manager to lead our projects.',
    vacancies: 1,
    eligibility: 'PMP certification preferred, 5+ years experience in project management',
  },
  {
    id: 'JOB005',
    title: 'UX/UI Designer',
    company: 'Creative Minds Agency',
    location: 'Los Angeles, USA',
    type: 'Full-time',
    salary: '$70,000-$90,000/year',
    deadline: '2025-07-01',
    description: 'We are looking for a talented UX/UI designer to create user-friendly interfaces.',
    vacancies: 2,
    eligibility: 'Portfolio required, experience with Figma or Adobe XD preferred',
  },
  {
    id: 'JOB006',
    title: 'Backend Developer',
    company: 'Tech Innovations Inc.',
    location: 'New York, USA',
    type: 'Full-time',
    salary: '$80,000-$100,000/year',
    deadline: '2025-05-15',
    description: 'Looking for a passionate backend developer to join our team.',
    vacancies: 5,
    eligibility: 'Computer Science students with CGPA above 7.5',
  },
  {
    id: 'JOB007',
    title: 'Data Scientist',
    company: 'Data Insights Co.',
    location: 'San Francisco, USA',
    type: 'Part-time',
    salary: '$50-$60/hr',
    deadline: '2025-06-01',
    description: 'Seeking a data scientist to help us make data-driven decisions.',
    vacancies: 2,
    eligibility: 'Experience with SQL and data visualization tools',
  },
  {
    id: 'JOB008',
    title: 'Business Analyst',
    company: 'Business Solutions Group',
    location: 'Chicago, USA',
    type: 'Contract',
    salary: '$90,000-$120,000/year',
    deadline: '2025-06-15',
    description: 'Looking for an experienced business analyst to lead our projects.',
    vacancies: 1,
    eligibility: 'PMP certification preferred, 5+ years experience in project management',
  },
  {
    id: 'JOB009',
    title: 'Graphic Designer',
    company: 'Creative Minds Agency',
    location: 'Los Angeles, USA',
    type: 'Full-time',
    salary: '$70,000-$90,000/year',
    deadline: '2025-07-01',
    description: 'We are looking for a talented graphic designer to create user-friendly interfaces.',
    vacancies: 2,
    eligibility: 'Portfolio required, experience with Figma or Adobe XD preferred',
  },
  {
    id: 'JOB010',
    title: 'Marketing Specialist',
    company: 'Marketing Gurus Inc.',
    location: 'Miami, USA',
    type: 'Internship',
    salary: '$15-$20/hr',
    deadline: '2025-08-01',
    description: 'Looking for a marketing specialist intern to join our team.',
    vacancies: 5,
    eligibility: 'Marketing students with CGPA above 7.5',
  },
  {
    id: 'JOB011',
    title: 'Sales Executive',
    company: 'Sales Pros Ltd.',
    location: 'Boston, USA',
    type: 'Full-time',
    salary: '$60,000-$80,000/year',
    deadline: '2025-09-01',
    description: 'We are looking for a skilled sales executive with experience in B2B sales.',
    vacancies: 3,
    eligibility: 'Business or related field graduates, 1-2 years experience',
  },
  {
    id: 'JOB012',
    title: 'Content Writer',
    company: 'Content Creators Co.',
    location: 'Remote',
    type: 'Part-time',
    salary: '$25-$30/hr',
    deadline: '2025-10-01',
    description: 'Seeking a content writer to help us create engaging content.',
    vacancies: 2,
    eligibility: 'Experience with SEO and content marketing preferred',
  },
  {
    id: 'JOB013',
    title: 'Digital Marketing Manager',
    company: 'Marketing Gurus Inc.',
    location: 'Miami, USA',
    type: 'Full-time',
    salary: '$70,000-$90,000/year',
    deadline: '2025-08-01',
    description: 'Looking for a digital marketing manager to lead our marketing efforts.',
    vacancies: 5,
    eligibility: 'Marketing students with CGPA above 7.5',
  },
  {
    id: 'JOB014',
    title: 'HR Coordinator',
    company: 'HR Solutions Ltd.',
    location: 'Seattle, USA',
    type: 'Contract',
    salary: '$50,000-$70,000/year',
    deadline: '2025-11-01',
    description: 'We are looking for an HR coordinator to help us manage our HR processes.',
    vacancies: 3,
    eligibility: 'HR or related field graduates, 1-2 years experience',
  },
  {
    id: 'JOB015',
    title: 'Customer Support Specialist',
    company: 'Support Services Co.',
    location: 'Austin, USA',
    type: 'Part-time',
    salary: '$20-$25/hr',
    deadline: '2025-12-01',
    description: 'Seeking a customer support specialist to help us provide excellent service.',
    vacancies: 2,
    eligibility: 'Experience with customer service preferred',
  }
];
export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [featuredJob, setFeaturedJob] = useState(jobs[0]); // default featured job
  const [appliedJobs, setAppliedJobs] = useState<{ [studentId: string]: string[] }>({});


  const filteredJobs = jobs.filter(job => {
    const matchesSearchTerm = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJobType = selectedJobType === 'all' || job.type.toLowerCase() === selectedJobType;
    return matchesSearchTerm && matchesJobType;
  });

  const handleApply = (e: React.FormEvent<HTMLFormElement>, jobId: string) => {
    e.preventDefault();
    const studentId = (e.currentTarget.elements.namedItem('studentId') as HTMLInputElement).value.trim();

    if (!studentId) {
      alert('Student ID is required.');
      return;
    }

    if (appliedJobs[studentId]?.includes(jobId)) {
      alert('You have already applied for this job.');
      return;
    }

    setAppliedJobs(prev => ({
      ...prev,
      [studentId]: [...(prev[studentId] || []), jobId],
    }));

    alert('Application submitted successfully!');
    setShowApplyForm(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Search & Filter */}
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
            
            <Select onValueChange={(value) => setSelectedJobType(value)}>
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
          </div>
        </div>
        
        {/* Job Table */}
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
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setFeaturedJob(job)}
                    >
                      <td className="py-4 px-4 text-sm">{job.id}</td>
                      <td className="py-4 px-4 font-medium">{job.title}</td>
                      <td className="py-4 px-4">{job.company}</td>
                      <td className="py-4 px-4">{job.location}</td>
                      <td className="py-4 px-4">{job.type}</td>
                      <td className="py-4 px-4">{job.salary}</td>
                      <td className="py-4 px-4">{job.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Featured Job */}
        <div className="mt-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">Selected Job</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-grow space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{featuredJob.title}</h3>
                    <p className="text-gray-600">{featuredJob.company} · {featuredJob.location}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Job Description</h4>
                    <p className="text-gray-700">{featuredJob.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Eligibility</h4>
                    <p className="text-gray-700">{featuredJob.eligibility}</p>
                  </div>
                </div>
                <div className="w-full md:w-64 space-y-4">
                  <Card className="bg-gray-50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type</span>
                        <span className="font-medium">{featuredJob.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Salary</span>
                        <span className="font-medium">{featuredJob.salary}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Deadline</span>
                        <span className="font-medium">{featuredJob.deadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vacancies</span>
                        <span className="font-medium">{featuredJob.vacancies}</span>
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
                        <h3 className="text-xl font-bold mb-4">Apply for {featuredJob.title}</h3>
                        <form onSubmit={(e) => handleApply(e, featuredJob.id)}>
                          <div className="mb-4">
                            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                              Student ID
                            </label>
                            <Input
                              id="studentId"
                              name="studentId"
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
                            <Button type="button" variant="outline" onClick={() => setShowApplyForm(false)}>
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
