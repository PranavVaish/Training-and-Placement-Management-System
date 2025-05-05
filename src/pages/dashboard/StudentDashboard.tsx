import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { Edit, FileText, Clock, Check, Calendar, Briefcase } from 'lucide-react';
import axios from 'axios'; // Make sure axios is installed

// API base URL - you might want to set this in an environment variable
const API_BASE_URL = 'http://localhost:8000/api'; // Update this to your FastAPI server URL

export default function StudentDashboard() {
  // State for profile editing dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [activeApplicationTab, setActiveApplicationTab] = useState('jobListings');
  
  // States for data from API
  const [studentProfile, setStudentProfile] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [trainingEnrollments, setTrainingEnrollments] = useState([]);
  
  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(true);
  
  // Error states
  const [profileError, setProfileError] = useState(null);
  const [applicationsError, setApplicationsError] = useState(null);
  const [interviewsError, setInterviewsError] = useState(null);
  const [enrollmentsError, setEnrollmentsError] = useState(null);

  // Fetch student profile data
  useEffect(() => {
    const fetchStudentProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/student/profile`);
        setStudentProfile(response.data);
        setProfileError(null);
      } catch (error) {
        console.error('Error fetching student profile:', error);
        setProfileError('Failed to load profile data');
        setStudentProfile(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchStudentProfile();
  }, []);

  // Fetch job applications
  useEffect(() => {
    const fetchJobApplications = async () => {
      setIsLoadingApplications(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/student/applications`);
        setJobApplications(response.data);
        setApplicationsError(null);
      } catch (error) {
        console.error('Error fetching job applications:', error);
        setApplicationsError('Failed to load application data');
        setJobApplications([]);
      } finally {
        setIsLoadingApplications(false);
      }
    };

    fetchJobApplications();
  }, []);

  // Fetch scheduled interviews
  useEffect(() => {
    const fetchScheduledInterviews = async () => {
      setIsLoadingInterviews(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/student/interviews`);
        setScheduledInterviews(response.data);
        setInterviewsError(null);
      } catch (error) {
        console.error('Error fetching scheduled interviews:', error);
        setInterviewsError('Failed to load interview data');
        setScheduledInterviews([]);
      } finally {
        setIsLoadingInterviews(false);
      }
    };

    fetchScheduledInterviews();
  }, []);

  // Fetch training enrollments
  useEffect(() => {
    const fetchTrainingEnrollments = async () => {
      setIsLoadingEnrollments(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/student/enrollments`);
        setTrainingEnrollments(response.data);
        setEnrollmentsError(null);
      } catch (error) {
        console.error('Error fetching training enrollments:', error);
        setEnrollmentsError('Failed to load enrollment data');
        setTrainingEnrollments([]);
      } finally {
        setIsLoadingEnrollments(false);
      }
    };

    fetchTrainingEnrollments();
  }, []);

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-teal-100 text-teal-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler for opening the edit dialog
  const handleEditProfile = () => {
    setEditedProfile({ ...studentProfile });
    setIsEditDialogOpen(true);
  };

  // Handler for saving profile changes
  const handleSaveProfile = async () => {
    if (editedProfile) {
      try {
        await axios.put(`${API_BASE_URL}/student/profile`, editedProfile);
        setStudentProfile(editedProfile);
        setIsEditDialogOpen(false);
      } catch (error) {
        console.error('Error updating profile:', error);
        // You could add error handling here, like showing a toast notification
      }
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

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  // Error message component
  const ErrorMessage = ({ message }) => (
    <div className="text-center py-8 text-red-500">
      {message || 'An error occurred. Please try again later.'}
    </div>
  );

  // No data message component
  const NoDataMessage = ({ message }) => (
    <div className="text-center py-8 text-gray-500">
      {message}
    </div>
  );

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
                {studentProfile && (
                  <Button variant="outline" size="sm" onClick={handleEditProfile}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingProfile ? (
                <LoadingSpinner />
              ) : profileError ? (
                <ErrorMessage message={profileError} />
              ) : !studentProfile ? (
                <NoDataMessage message="No profile data found." />
              ) : (
                <>
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
                </>
              )}
            </CardContent>
          </Card>

          {/* Applications Card with Tabs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Job Applications</CardTitle>
                <Button asChild>
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
              </div>
              
              {/* Toggle buttons for Job Listings and Interview Schedule */}
              <div className="flex border-b mt-4">
                <button
                  className={`pb-2 px-4 font-medium flex items-center ${activeApplicationTab === 'jobListings' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-500'}`}
                  onClick={() => setActiveApplicationTab('jobListings')}
                >
                  <Briefcase className="h-4 w-4 mr-2" /> Job Listings
                </button>
                <button
                  className={`pb-2 px-4 font-medium flex items-center ${activeApplicationTab === 'interviewSchedule' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-500'}`}
                  onClick={() => setActiveApplicationTab('interviewSchedule')}
                >
                  <Calendar className="h-4 w-4 mr-2" /> Interview Schedule
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {activeApplicationTab === 'jobListings' ? (
                // Job Listings Content
                <div className="mt-4">
                  <h2 className="text-xl font-semibold mb-4">Active Applications</h2>
                  {isLoadingApplications ? (
                    <LoadingSpinner />
                  ) : applicationsError ? (
                    <ErrorMessage message={applicationsError} />
                  ) : jobApplications.length === 0 ? (
                    <NoDataMessage message="No active applications. Start applying for jobs now!" />
                  ) : (
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
                  )}
                </div>
              ) : (
                // Interview Schedule Content
                <div className="mt-4">
                  <h2 className="text-xl font-semibold mb-4">Interview Schedule</h2>
                  {isLoadingInterviews ? (
                    <LoadingSpinner />
                  ) : interviewsError ? (
                    <ErrorMessage message={interviewsError} />
                  ) : scheduledInterviews.length === 0 ? (
                    <NoDataMessage message="No interviews scheduled at the moment." />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 border-b">
                            <th className="py-3 px-2">Company</th>
                            <th className="py-3 px-2">Position</th>
                            <th className="py-3 px-2">Date</th>
                            <th className="py-3 px-2">Time</th>
                            <th className="py-3 px-2">Mode</th>
                            <th className="py-3 px-2">Interviewer</th>
                            <th className="py-3 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduledInterviews.map((interview) => (
                            <tr key={interview.interviewId} className="border-b">
                              <td className="py-3 px-2 font-medium">{interview.company}</td>
                              <td className="py-3 px-2">{interview.position}</td>
                              <td className="py-3 px-2">{interview.date}</td>
                              <td className="py-3 px-2">{interview.time}</td>
                              <td className="py-3 px-2">{interview.mode}</td>
                              <td className="py-3 px-2">{interview.interviewer}</td>
                              <td className="py-3 px-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(interview.status)}`}>
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
              {isLoadingEnrollments ? (
                <LoadingSpinner />
              ) : enrollmentsError ? (
                <ErrorMessage message={enrollmentsError} />
              ) : trainingEnrollments.length === 0 ? (
                <NoDataMessage message="No training enrollments found. Explore available programs to enroll." />
              ) : (
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
                      {trainingEnrollments.map((enrollment) => (
                        <tr key={enrollment.enrollmentId} className="border-b">
                          <td className="py-3 px-2 font-medium">{enrollment.programName}</td>
                          <td className="py-3 px-2">{enrollment.enrollmentId}</td>
                          <td className="py-3 px-2">{enrollment.duration}</td>
                          <td className="py-3 px-2">{enrollment.startDate}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center">
                              {enrollment.status.toLowerCase() === 'completed' ? (
                                <Check className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                              )}
                              {enrollment.status}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Button variant="outline" size="sm">
                              {enrollment.status.toLowerCase() === 'completed' ? 'Certificate' : 'Access Course'}
                            </Button>
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

        {/* Edit Profile Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            {editedProfile && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    value={editedProfile.name || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="id" className="text-sm font-medium">Student ID</label>
                  <Input
                    id="id"
                    value={editedProfile.id || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    value={editedProfile.email || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input
                    id="phone"
                    value={editedProfile.phone || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">Department</label>
                  <Input
                    id="department"
                    value={editedProfile.department || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cgpa" className="text-sm font-medium">CGPA</label>
                  <Input
                    id="cgpa"
                    value={editedProfile.cgpa || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="graduationYear" className="text-sm font-medium">Graduation Year</label>
                  <Input
                    id="graduationYear"
                    value={editedProfile.graduationYear || ''}
                    disabled
                  />
                </div>
              </div>
            )}
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