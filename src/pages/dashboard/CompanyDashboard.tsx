import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Button
} from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
  Input
} from '@/components/ui/input';
import {
  Edit, Plus, Users, Calendar, ClipboardList, Loader2
} from 'lucide-react';

export default function CompanyDashboard() {
  // State for data
  const [companyProfile, setCompanyProfile] = useState(null);
  const [jobListings, setJobListings] = useState([]);
  const [hiringHistory, setHiringHistory] = useState([]);
  const [interviewSchedules, setInterviewSchedules] = useState([]);
  const [applications, setApplications] = useState([]);

  // State for UI
  const [activeTab, setActiveTab] = useState('listings');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  
  // Loading and error states
  const [loading, setLoading] = useState({
    profile: true,
    jobs: true,
    history: true,
    interviews: true,
    applications: true
  });
  const [error, setError] = useState({
    profile: null,
    jobs: null,
    history: null,
    interviews: null,
    applications: null
  });

  // Form states
  const [editProfile, setEditProfile] = useState({});
  const [newJob, setNewJob] = useState({
    title: '',
    type: '',
    location: '',
    department: '',
    vacancy: 0,
    status: 'Active',
    deadline: '',
    salary: '',
    description: '',
    eligibility: ''
  });
  const [newInterview, setNewInterview] = useState({
    application_id: '',
    candidate_name: '',
    job_title: '',
    date: '',
    time: '',
    mode: '',
    interviewer_name: '',
    status: 'Scheduled'
  });

  // API base URL - replace with your actual FastAPI endpoint
  const API_BASE_URL = 'http://localhost:8000/api';

  // Fetch company profile
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/company/profile`);
        if (!response.ok) {
          throw new Error('Failed to fetch company profile');
        }
        const data = await response.json();
        setCompanyProfile(data);
        setEditProfile(data);
      } catch (err) {
        console.error('Error fetching company profile:', err);
        setError(prev => ({ ...prev, profile: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };

    fetchCompanyProfile();
  }, []);

  // Fetch job listings
  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
          throw new Error('Failed to fetch job listings');
        }
        const data = await response.json();
        setJobListings(data);
      } catch (err) {
        console.error('Error fetching job listings:', err);
        setError(prev => ({ ...prev, jobs: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, jobs: false }));
      }
    };

    fetchJobListings();
  }, []);

  // Fetch hiring history
  useEffect(() => {
    const fetchHiringHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/hiring/history`);
        if (!response.ok) {
          throw new Error('Failed to fetch hiring history');
        }
        const data = await response.json();
        setHiringHistory(data);
      } catch (err) {
        console.error('Error fetching hiring history:', err);
        setError(prev => ({ ...prev, history: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, history: false }));
      }
    };

    fetchHiringHistory();
  }, []);

  // Fetch interview schedules
  useEffect(() => {
    const fetchInterviewSchedules = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/interviews`);
        if (!response.ok) {
          throw new Error('Failed to fetch interview schedules');
        }
        const data = await response.json();
        setInterviewSchedules(data);
      } catch (err) {
        console.error('Error fetching interview schedules:', err);
        setError(prev => ({ ...prev, interviews: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, interviews: false }));
      }
    };

    fetchInterviewSchedules();
  }, []);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/applications`);
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(prev => ({ ...prev, applications: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, applications: false }));
      }
    };

    fetchApplications();
  }, []);

  // Update company profile
  const handleProfileSave = async () => {
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      const response = await fetch(`${API_BASE_URL}/company/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProfile),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update company profile');
      }
      
      const updatedProfile = await response.json();
      setCompanyProfile(updatedProfile);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating company profile:', err);
      setError(prev => ({ ...prev, profile: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Create new job
  const handleJobCreate = async () => {
    try {
      setLoading(prev => ({ ...prev, jobs: true }));
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create job');
      }
      
      const createdJob = await response.json();
      setJobListings(prev => [...prev, createdJob]);
      setNewJob({
        title: '',
        type: '',
        location: '',
        department: '',
        vacancy: 0,
        status: 'Active',
        deadline: '',
        salary: '',
        description: '',
        eligibility: ''
      });
      setShowJobModal(false);
    } catch (err) {
      console.error('Error creating job:', err);
      setError(prev => ({ ...prev, jobs: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, jobs: false }));
    }
  };

  // Schedule interview
  const handleScheduleInterview = async () => {
    try {
      setLoading(prev => ({ ...prev, interviews: true }));
      const response = await fetch(`${API_BASE_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInterview),
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule interview');
      }
      
      const scheduledInterview = await response.json();
      setInterviewSchedules(prev => [...prev, scheduledInterview]);
      
      // Update the application status
      const appResponse = await fetch(`${API_BASE_URL}/applications/${newInterview.application_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Interview Scheduled' }),
      });
      
      if (!appResponse.ok) {
        console.warn('Failed to update application status');
      }
      
      // Refresh applications list
      const updatedApplicationsResponse = await fetch(`${API_BASE_URL}/applications`);
      if (updatedApplicationsResponse.ok) {
        const updatedApplications = await updatedApplicationsResponse.json();
        setApplications(updatedApplications);
      }
      
      setNewInterview({
        application_id: '',
        candidate_name: '',
        job_title: '',
        date: '',
        time: '',
        mode: '',
        interviewer_name: '',
        status: 'Scheduled'
      });
      setShowInterviewModal(false);
    } catch (err) {
      console.error('Error scheduling interview:', err);
      setError(prev => ({ ...prev, interviews: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, interviews: false }));
    }
  };

  const handleApplicationSelect = (application) => {
    setNewInterview({
      ...newInterview,
      application_id: application.application_id,
      candidate_name: application.candidate_name,
      job_title: application.job_title
    });
    setShowInterviewModal(true);
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  );

  // Empty state component
  const EmptyState = ({ message = "No Data Found" }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  );

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
                {!loading.profile && companyProfile && (
                  <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading.profile ? (
                <LoadingSpinner />
              ) : error.profile ? (
                <p className="text-red-500">Error: {error.profile}</p>
              ) : !companyProfile ? (
                <EmptyState message="No company profile data found" />
              ) : (
                Object.entries(companyProfile).map(([key, value]) => (
                  key !== 'id' && (
                    <div key={key}>
                      <h3 className="font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                      <p>{String(value)}</p>
                    </div>
                  )
                ))
              )}
            </CardContent>
          </Card>

          {/* Job Listings / Interview Schedule Tabs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recruitment Management</CardTitle>
                  <CardDescription>Manage job listings and interviews</CardDescription>
                </div>
                <div className="space-x-2">
                  {activeTab === 'listings' && !loading.jobs && (
                    <Button onClick={() => setShowJobModal(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Create New Job
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex border-b mt-4">
                <button
                  className={`pb-2 px-4 font-medium flex items-center ${activeTab === 'listings' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-500'}`}
                  onClick={() => setActiveTab('listings')}
                >
                  <ClipboardList className="h-4 w-4 mr-2" /> Job Listings
                </button>
                <button
                  className={`pb-2 px-4 font-medium flex items-center ${activeTab === 'interviews' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-500'}`}
                  onClick={() => setActiveTab('interviews')}
                >
                  <Calendar className="h-4 w-4 mr-2" /> Interview Schedule
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'listings' ? (
                // Job Listings Content
                loading.jobs ? (
                  <LoadingSpinner />
                ) : error.jobs ? (
                  <p className="text-red-500">Error: {error.jobs}</p>
                ) : jobListings.length === 0 ? (
                  <EmptyState message="No job listings found" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b">
                          <th className="py-3 px-2">Job Title</th>
                          <th className="py-3 px-2">Location</th>
                          <th className="py-3 px-2">Type</th>
                          <th className="py-3 px-2">Salary</th>
                          <th className="py-3 px-2">Vacancies</th>
                          <th className="py-3 px-2">Deadline</th>
                          <th className="py-3 px-2">Description</th>
                          <th className="py-3 px-2">Eligibility</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobListings.map((job) => (
                          <tr key={job.id} className="border-b">
                            <td className="py-3 px-2 font-medium">{job.title}</td>
                            <td className="py-3 px-2">{job.location}</td>
                            <td className="py-3 px-2">{job.type}</td>
                            <td className="py-3 px-2">{job.salary}</td>
                            <td className="py-3 px-2 flex items-center">
                              <Users className="h-4 w-4 mr-1" /> {job.vacancy}
                            </td>
                            <td className="py-3 px-2">{job.deadline}</td>
                            <td className="py-3 px-2">{job.description}</td>
                            <td className="py-3 px-2">{job.eligibility || job.eligiblity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                // Interview Schedule Content
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Pending Applications</h3>
                    {loading.applications ? (
                      <LoadingSpinner />
                    ) : error.applications ? (
                      <p className="text-red-500">Error: {error.applications}</p>
                    ) : applications.length === 0 ? (
                      <EmptyState message="No pending applications found" />
                    ) : (
                      <div className="overflow-x-auto border rounded-md">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                              <th className="py-3 px-4">Application ID</th>
                              <th className="py-3 px-4">Candidate</th>
                              <th className="py-3 px-4">Position</th>
                              <th className="py-3 px-4">Applied Date</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {applications.filter(app => app.status === "Under Review").map((app) => (
                              <tr key={app.application_id} className="border-b">
                                <td className="py-3 px-4">{app.application_id}</td>
                                <td className="py-3 px-4 font-medium">{app.candidate_name}</td>
                                <td className="py-3 px-4">{app.job_title}</td>
                                <td className="py-3 px-4">{app.applied_date}</td>
                                <td className="py-3 px-4">
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {app.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <Button 
                                    size="sm"
                                    onClick={() => handleApplicationSelect(app)}
                                  >
                                    Schedule Interview
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-medium mb-3">Scheduled Interviews</h3>
                  {loading.interviews ? (
                    <LoadingSpinner />
                  ) : error.interviews ? (
                    <p className="text-red-500">Error: {error.interviews}</p>
                  ) : interviewSchedules.length === 0 ? (
                    <EmptyState message="No interviews scheduled" />
                  ) : (
                    <div className="overflow-x-auto border rounded-md">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                            <th className="py-3 px-4">Interview ID</th>
                            <th className="py-3 px-4">Candidate</th>
                            <th className="py-3 px-4">Position</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Time</th>
                            <th className="py-3 px-4">Mode</th>
                            <th className="py-3 px-4">Interviewer</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {interviewSchedules.map((interview) => (
                            <tr key={interview.interview_id} className="border-b">
                              <td className="py-3 px-4">{interview.interview_id}</td>
                              <td className="py-3 px-4 font-medium">{interview.candidate_name}</td>
                              <td className="py-3 px-4">{interview.job_title}</td>
                              <td className="py-3 px-4">{interview.date}</td>
                              <td className="py-3 px-4">{interview.time}</td>
                              <td className="py-3 px-4">{interview.mode}</td>
                              <td className="py-3 px-4">{interview.interviewer_name}</td>
                              <td className="py-3 px-4">
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  {interview.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hiring History */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div>
                <CardTitle>Hiring History</CardTitle>
                <CardDescription>Overview of your past hiring activities</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {loading.history ? (
                <LoadingSpinner />
              ) : error.history ? (
                <p className="text-red-500">Error: {error.history}</p>
              ) : hiringHistory.length === 0 ? (
                <EmptyState message="No hiring history found" />
              ) : (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Modal */}
        {companyProfile && (
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Company Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {['name', 'email', 'phone', 'website', 'contactPerson', 'industryType', 'location'].map(field => (
                  <div key={field}>
                    <label className="text-sm font-medium block mb-1 capitalize">
                      {field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <Input
                      value={editProfile[field] || ''}
                      onChange={(e) => setEditProfile({ ...editProfile, [field]: e.target.value })}
                      placeholder={field.replace(/([A-Z])/g, ' $1')}
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleProfileSave} 
                  disabled={loading.profile}
                >
                  {loading.profile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* New Job Modal */}
        <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {[
                { name: 'title', label: 'Job Title', type: 'text' },
                { name: 'type', label: 'Employment Type', type: 'text' },
                { name: 'location', label: 'Location', type: 'text' },
                { name: 'department', label: 'Department', type: 'text' },
                { name: 'vacancy', label: 'Number of Vacancies', type: 'number' },
                { name: 'deadline', label: 'Application Deadline', type: 'date' },
                { name: 'salary', label: 'Salary', type: 'text' },
                { name: 'description', label: 'Job Description', type: 'text' },
                { name: 'eligibility', label: 'Eligibility Requirements', type: 'text' }
              ].map(field => (
                <div key={field.name}>
                  <label className="text-sm font-medium block mb-1">{field.label}</label>
                  <Input
                    type={field.type}
                    value={newJob[field.name]}
                    onChange={(e) => setNewJob({ 
                      ...newJob, 
                      [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value 
                    })}
                    placeholder={field.label}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button 
                onClick={handleJobCreate}
                disabled={loading.jobs}
              >
                {loading.jobs ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : 'Post Job'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Interview Modal */}
        <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Candidate: {newInterview.candidate_name}</p>
                <p className="text-sm font-medium mb-1">Position: {newInterview.job_title}</p>
                <p className="text-sm font-medium mb-1">Application ID: {newInterview.application_id}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Date</label>
                  <Input
                    type="date"
                    value={newInterview.date}
                    onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Time</label>
                  <Input
                    type="time"
                    value={newInterview.time}
                    onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Mode</label>
                  <Input
                    value={newInterview.mode}
                    onChange={(e) => setNewInterview({ ...newInterview, mode: e.target.value })}
                    placeholder="e.g. Video Call, In-person, Phone"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Interviewer</label>
                  <Input
                    value={newInterview.interviewer_name}
                    onChange={(e) => setNewInterview({ ...newInterview, interviewer_name: e.target.value })}
                    placeholder="Interviewer's name"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleScheduleInterview}
                disabled={loading.interviews}
              >
                {loading.interviews ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : 'Schedule'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}