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
  Edit, Plus, Users, Calendar, ClipboardList
} from 'lucide-react';

export default function CompanyDashboard() {
  const [companyProfile, setCompanyProfile] = useState({
    name: 'Tech Innovations Inc.',
    id: 'CMP12345',
    email: 'hr@techinnovations.com',
    phone: '(123) 456-7890',
    industryType: 'Technology',
    website: 'www.techinnovations.com',
    location: 'New York, USA',
    contactPerson: 'Jane Wilson'
  });

  const [jobListings, setJobListings] = useState([
    {
      id: 'JOB123',
      title: 'Software Developer Intern',
      type: 'Internship',
      location: 'New York',
      department: 'Engineering',
      postedDate: '2025-03-10',
      vacancy: 15,
      status: 'Active',
      deadline: '2025-05-01',
      salary: '$2,000/month',
      description: 'Assist in developing and maintaining software vacancy under the guidance of senior developers.',
      eligiblity: 'Currently pursuing a degree in Computer Science or related field.'
    },
    {
      id: 'JOB456',
      title: 'Frontend Developer',
      type: 'Full-time',
      location: 'Remote',
      department: 'Engineering',
      postedDate: '2025-03-12',
      vacancy: 24,
      status: 'Active',
      deadline: '2025-06-01',
      salary: '$80,000/year',
      description: 'Develop and maintain user-facing features for web vacancy using modern frontend technologies.',
      eligiblity: '2+ years of experience in frontend development and proficiency in React.js.'
    },
    {
      id: 'JOB789',
      title: 'Data Analyst',
      type: 'Full-time',
      location: 'New York',
      department: 'Data Science',
      postedDate: '2025-03-15',
      vacancy: 18,
      status: 'Active',
      deadline: '2025-04-20',
      salary: '$70,000/year',
      description: 'Analyze data to provide actionable insights and support decision-making processes.',
      eligiblity: 'Bachelors degree in Statistics, Mathematics, or related field and experience with data visualization tools.'
    },
  ]);

  const [hiringHistory] = useState([
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
  ]);

  // New state for interview schedules
  const [interviewSchedules, setInterviewSchedules] = useState([
    {
      interview_id: 'INT001',
      application_id: 'APP001',
      candidate_name: 'Alex Rodriguez',
      job_title: 'Frontend Developer',
      date: '2025-05-10',
      time: '10:00 AM',
      mode: 'Video Call',
      interviewer_name: 'David Williams',
      status: 'Scheduled'
    },
    {
      interview_id: 'INT002',
      application_id: 'APP002',
      candidate_name: 'Jamie Lee',
      job_title: 'Software Developer Intern',
      date: '2025-05-12',
      time: '2:30 PM',
      mode: 'In-person',
      interviewer_name: 'Sarah Thompson',
      status: 'Scheduled'
    }
  ]);

  const [activeTab, setActiveTab] = useState('listings');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const [editProfile, setEditProfile] = useState({ ...companyProfile });

  const [newJob, setNewJob] = useState({
    id: '',
    title: '',
    type: '',
    location: '',
    department: '',
    postedDate: new Date().toISOString().split('T')[0],
    vacancy: 0,
    status: 'Active',
    deadline: '',
    salary: '',
    description: '',
    eligiblity: ''
  });

  // New state for scheduling interviews
  const [newInterview, setNewInterview] = useState({
    interview_id: '',
    application_id: '',
    candidate_name: '',
    job_title: '',
    date: '',
    time: '',
    mode: '',
    interviewer_name: '',
    status: 'Scheduled'
  });

  // Sample applications data
  const [applications] = useState([
    {
      application_id: 'APP003',
      candidate_name: 'Taylor Jordan',
      job_title: 'Data Analyst',
      job_id: 'JOB789',
      applied_date: '2025-04-25',
      status: 'Under Review'
    },
    {
      application_id: 'APP004',
      candidate_name: 'Morgan Casey',
      job_title: 'Frontend Developer',
      job_id: 'JOB456',
      applied_date: '2025-04-22',
      status: 'Under Review'
    },
    {
      application_id: 'APP005',
      candidate_name: 'Riley Quinn',
      job_title: 'Software Developer Intern',
      job_id: 'JOB123',
      applied_date: '2025-04-20',
      status: 'Under Review'
    }
  ]);

  // Auto-filter out expired job listings
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setJobListings(prev =>
      prev.filter(job => job.deadline >= today)
    );
  }, []);

  const handleProfileSave = () => {
    setCompanyProfile({ ...editProfile });
    setShowEditModal(false);
  };

  const handleJobCreate = () => {
    const newJobWithId = {
      ...newJob,
      id: 'JOB' + Math.floor(Math.random() * 10000)
    };
    setJobListings(prev => [...prev, newJobWithId]);
    setNewJob({
      id: '',
      title: '',
      type: '',
      location: '',
      department: '',
      postedDate: new Date().toISOString().split('T')[0],
      vacancy: 0,
      status: 'Active',
      deadline: '',
      salary: '',
      description: '',
      eligiblity: ''
    });
    setShowJobModal(false);
  };

  const handleScheduleInterview = () => {
    const interviewWithId = {
      ...newInterview,
      interview_id: 'INT' + Math.floor(Math.random() * 10000)
    };
    setInterviewSchedules(prev => [...prev, interviewWithId]);
    setNewInterview({
      interview_id: '',
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
                <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(companyProfile).map(([key, value]) => (
                key !== 'id' && (
                  <div key={key}>
                    <h3 className="font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                    <p>{value}</p>
                  </div>
                )
              ))}
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
                  {activeTab === 'listings' ? (
                    <Button onClick={() => setShowJobModal(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Create New Job
                    </Button>
                  ) : null}
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
                        <th className="py-3 px-2">Eligiblity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobListings.map((job) => {
                        const isDeadlinePassed = new Date(job.deadline) < new Date();
                        return (
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
                            <td className="py-3 px-2">{job.eligiblity}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Interview Schedule Content
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Pending Applications</h3>
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
                          {applications.map((app) => (
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
                  </div>

                  <h3 className="text-lg font-medium mb-3">Scheduled Interviews</h3>
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
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Company Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {['name', 'email', 'phone', 'website', 'contactPerson'].map(field => (
                <Input
                  key={field}
                  value={editProfile[field]}
                  onChange={(e) => setEditProfile({ ...editProfile, [field]: e.target.value })}
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                />
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleProfileSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Job Modal */}
        <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {['title', 'location', 'type', 'salary', 'deadline'].map(field => (
                <Input
                  key={field}
                  value={newJob[field]}
                  onChange={(e) => setNewJob({ ...newJob, [field]: e.target.value })}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleJobCreate}>Post Job</Button>
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
                    type="text"
                    value={newInterview.time}
                    onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                    placeholder="e.g. 10:00 AM"
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
              <Button onClick={handleScheduleInterview}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}