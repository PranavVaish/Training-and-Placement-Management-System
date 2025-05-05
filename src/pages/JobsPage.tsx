import { useState, useEffect } from 'react';
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
import { Search, Loader2 } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [featuredJob, setFeaturedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/job/');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      if (!data.jobs || !Array.isArray(data.jobs)) {
        throw new Error('Expected an object with a jobs array');
      }
      // Map API response to expected property names
      const mappedJobs = data.jobs.map(job => ({
        id: job.Job_ID,
        title: job.Title,
        company: job.Company_Name,
        location: job.Location_List?.join(', ') || 'N/A',
        type: job.Job_Type,
        salary: job.Salary ? `$${job.Salary.toLocaleString()}` : 'N/A',
        deadline: job.Application_Deadline,
        description: job.Job_Description,
        eligibility: job.Eligibility_Criteria_List?.join(', ') || 'N/A',
        vacancies: job.Vacancies,
      }));
      setJobs(mappedJobs);
      if (mappedJobs.length > 0) {
        setFeaturedJob(mappedJobs[0]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearchTerm =
      (job.title?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
      (job.company?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
      (job.location?.toLowerCase?.() || '').includes(searchTerm.toLowerCase());
    const matchesJobType = selectedJobType === 'all' || (job.type?.toLowerCase?.() === selectedJobType);
    return matchesSearchTerm && matchesJobType;
  });

  const handleApply = async (e, jobId) => {
    e.preventDefault();
    const studentId = e.currentTarget.elements.namedItem('studentId').value.trim();
    const password = e.currentTarget.elements.namedItem('password').value;
    const resumeFile = e.currentTarget.elements.namedItem('resume').files[0];

    if (!studentId) {
      alert('Student ID is required.');
      return;
    }

    if (appliedJobs[studentId]?.includes(jobId)) {
      alert('You have already applied for this job.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('studentId', studentId);
      formData.append('password', password);
      formData.append('resume', resumeFile);
      formData.append('jobId', jobId);

      const response = await fetch('http://127.0.0.1:8000/students/apply', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit application');
      }

      setAppliedJobs(prev => ({
        ...prev,
        [studentId]: [...(prev[studentId] || []), jobId],
      }));

      alert('Application submitted successfully!');
      setShowApplyForm(false);
    } catch (err) {
      console.error('Error submitting application:', err);
      alert(`Error: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-portal-dark" />
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-red-600">Error Loading Jobs</h2>
              <p className="text-red-500 mt-2">{error}</p>
              <Button className="mt-4" onClick={fetchJobs}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

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

        {jobs.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold text-gray-600">No Jobs Found</h2>
              <p className="text-gray-500 mt-2">There are currently no job listings available.</p>
              <Button className="mt-4" onClick={fetchJobs}>Refresh</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Available Positions</CardTitle>
                <CardDescription>Showing {filteredJobs.length} job listings</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredJobs.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No jobs match your search criteria
                  </div>
                ) : (
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
                            key={job.id || Math.random()}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => setFeaturedJob(job)}
                          >
                            <td className="py-4 px-4 text-sm">{job.id || 'N/A'}</td>
                            <td className="py-4 px-4 font-medium">{job.title || 'Untitled'}</td>
                            <td className="py-4 px-4">{job.company || 'Unknown'}</td>
                            <td className="py-4 px-4">{job.location || 'N/A'}</td>
                            <td className="py-4 px-4">{job.type || 'N/A'}</td>
                            <td className="py-4 px-4">{job.salary || 'N/A'}</td>
                            <td className="py-4 px-4">{job.deadline || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {featuredJob ? (
              <div className="mt-8 mb-16">
                <h2 className="text-2xl font-bold mb-4">Selected Job</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-grow space-y-4">
                        <div>
                          <h3 className="text-xl font-bold">{featuredJob.title || 'N/A'}</h3>
                          <p className="text-gray-600">
                            {featuredJob.company || 'N/A'} · {featuredJob.location || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Job Description</h4>
                          <p className="text-gray-700">{featuredJob.description || 'No description available'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Eligibility</h4>
                          <p className="text-gray-700">{featuredJob.eligibility || 'No eligibility info'}</p>
                        </div>
                      </div>
                      <div className="w-full md:w-64 space-y-4">
                        <Card className="bg-gray-50">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Type</span>
                              <span className="font-medium">{featuredJob.type || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Salary</span>
                              <span className="font-medium">{featuredJob.salary || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Deadline</span>
                              <span className="font-medium">{featuredJob.deadline || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Vacancies</span>
                              <span className="font-medium">{featuredJob.vacancies || 'N/A'}</span>
                            </div>
                          </CardContent>
                        </Card>
                        <Button
                          className="w-full bg-portal-DEFAULT bg-portal-dark"
                          onClick={() => setShowApplyForm(true)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="mt-8 mb-16">
                <h2 className="text-2xl font-bold mb-4">Selected Job</h2>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-500">No job selected</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}

        {showApplyForm && featuredJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Apply for {featuredJob.title || 'Job'}</h3>
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
    </MainLayout>
  );
}