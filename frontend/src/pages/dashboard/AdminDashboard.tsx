import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Edit,
  Plus,
  Trash2,
  User,
  Users,
  BookOpen,
  Briefcase,
  MessageCircle,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:8000/';

export default function AdminDashboard() {
  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingTrainings, setLoadingTrainings] = useState(true);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  // Error states
  const [statsError, setStatsError] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [companiesError, setCompaniesError] = useState(null);
  const [trainingsError, setTrainingsError] = useState(null);
  const [feedbacksError, setFeedbacksError] = useState(null);

  // State for dialogs
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewFeedbackDialogOpen, setIsViewFeedbackDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Training Programs state
  const [isAddTrainingDialogOpen, setIsAddTrainingDialogOpen] = useState(false);
  const [isEditTrainingDialogOpen, setIsEditTrainingDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);

  // Data states
  const [adminProfile, setAdminProfile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState([]);
  const universalId = localStorage.getItem('universal_id') || '';

  // Fetch data on component mount
  useEffect(() => {
    fetchStats();
    fetchAdminProfile();
    fetchCompanies();
    fetchTrainingPrograms();
    fetchFeedbacks();
  }, []);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    setLoadingStats(true);
    setStatsError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/admin/stats`);
      const apiData = response.data;
      const transformedStats = [
        {
          title: 'Total Students',
          value: apiData.total_students || 0,
          icon: <User className="h-8 w-8 text-blue-500" />,
          change: '0%',
          period: 'from last year'
        },
        {
          title: 'Registered Companies',
          value: apiData.total_companies || 0,
          icon: <Briefcase className="h-8 w-8 text-purple-500" />,
          change: '0%',
          period: 'from last year'
        },
        {
          title: 'Active Training Programs',
          value: apiData.active_training_programs || 0,
          icon: <BookOpen className="h-8 w-8 text-green-500" />,
          change: '0%',
          period: 'from last year'
        },
        {
          title: 'Placements (2024)',
          value: apiData.total_placements_this_year || 0,
          icon: <Users className="h-8 w-8 text-orange-500" />,
          change: '0%',
          period: 'from previous batch'
        }
      ];
      setStats(transformedStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStatsError('Failed to load dashboard statistics');
      setStats([
        { title: 'Total Students', value: 0, icon: <User className="h-8 w-8 text-blue-500" />, change: '0%', period: 'from last year' },
        { title: 'Registered Companies', value: 0, icon: <Briefcase className="h-8 w-8 text-purple-500" />, change: '0%', period: 'from last year' },
        { title: 'Active Training Programs', value: 0, icon: <BookOpen className="h-8 w-8 text-green-500" />, change: '0%', period: 'from last year' },
        { title: 'Placements (2024)', value: 0, icon: <Users className="h-8 w-8 text-orange-500" />, change: '0%', period: 'from previous batch' }
      ]);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch admin profile
  const fetchAdminProfile = async () => {
    setLoadingProfile(true);
    setProfileError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/admin/profile`);
      const profileData = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
      setAdminProfile(profileData || {
        Admin_Name: 'Admin User',
        Admin_ID: 'N/A',
        Email: 'N/A',
        Phone: 'N/A',
        Role: 'N/A'
      });
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setProfileError('Failed to load admin profile');
      setAdminProfile({
        Admin_Name: 'Admin User',
        Admin_ID: 'N/A',
        Email: 'N/A',
        Phone: 'N/A',
        Role: 'N/A'
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch companies
  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    setCompaniesError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/admin/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompaniesError('Failed to load companies');
      setCompanies([]);
    } finally {
      setLoadingCompanies(false);
    }
  };

  // Fetch training programs
  const fetchTrainingPrograms = async () => {
    setLoadingTrainings(true);
    setTrainingsError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/admin/training_programs`);
      setTrainingPrograms(response.data);
    } catch (error) {
      console.error('Error fetching training programs:', error);
      setTrainingsError('Failed to load training programs');
      setTrainingPrograms([]);
    } finally {
      setLoadingTrainings(false);
    }
  };

  // Fetch student feedbacks
  const fetchFeedbacks = async () => {
    setLoadingFeedbacks(true);
    setFeedbacksError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/admin/feedback`);
      // Transform the feedback data to include a status field
      const transformedFeedbacks = response.data.map(feedback => ({
        ...feedback,
        status: feedback.status || 'Unread' // Default to 'Unread' if status is not provided
      }));
      setFeedbacks(transformedFeedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setFeedbacksError('Failed to load student feedbacks');
      setFeedbacks([]);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  // Company handlers
  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      await axios.delete(`${API_BASE_URL}/companies/${companyId}`);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company');
    }
  };

  const handleSaveCompany = async () => {
    if (!selectedCompany) return;
    try {
      await axios.put(`${API_BASE_URL}/companies/${selectedCompany.id}`, selectedCompany);
      fetchCompanies();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Failed to update company');
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const newCompanyName = formData.get('companyName')?.toString();
    if (!newCompanyName) return;

    try {
      await axios.post(`${API_BASE_URL}/companies`, { name: newCompanyName });
      fetchCompanies();
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding company:', error);
      alert('Failed to add company');
    }
  };

  // Training Program handlers
  const handleEditTraining = (training) => {
    setSelectedTraining(training);
    setIsEditTrainingDialogOpen(true);
  };

  const handleDeleteTraining = async (trainingId) => {
    try {
      await axios.delete(`${API_BASE_URL}/training-programs/${trainingId}`);
      fetchTrainingPrograms();
    } catch (error) {
      console.error('Error deleting training program:', error);
      alert('Failed to delete training program');
    }
  };

  const handleSaveTraining = async () => {
    if (!selectedTraining) return;
    try {
      await axios.put(`${API_BASE_URL}/training-programs/${selectedTraining.id}`, selectedTraining);
      fetchTrainingPrograms();
      setIsEditTrainingDialogOpen(false);
    } catch (error) {
      console.error('Error updating training program:', error);
      alert('Failed to update training program');
    }
  };

  const handleAddTraining = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const newTraining = {
      universal_id: formData.get('universalId')?.toString() || universalId,
      trainingName: formData.get('trainingName')?.toString() || '',
      trainingDescription: formData.get('trainingDescription')?.toString() || '',
      duration: parseInt(formData.get('duration')?.toString() || '0'),
      trainerId: parseInt(formData.get('trainerName')?.toString() || '0'),
      startDate: formData.get('startDate')?.toString() || '',
      endDate: formData.get('endDate')?.toString() || '',
      mode: formData.get('mode')?.toString() || 'Online',
      certificationProvided: formData.get('certificationProvided') === 'on',
      cost: parseFloat(formData.get('cost')?.toString() || '0'),
    };

    try {
      await axios.post(`http://127.0.0.1:8000/training/create-program`, newTraining);
      fetchTrainingPrograms();
      setIsAddTrainingDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding training program:', error);
      alert('Failed to add training program');
    }
  };

  // Feedback handlers
  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setIsViewFeedbackDialogOpen(true);
  };

  const handleUpdateFeedbackStatus = async (status) => {
    if (!selectedFeedback) return;
    try {
      await axios.put(`${API_BASE_URL}/feedbacks/${selectedFeedback.id}`, {
        ...selectedFeedback,
        status
      });
      fetchFeedbacks();
      setIsViewFeedbackDialogOpen(false);
    } catch (error) {
      console.error('Error updating feedback status:', error);
      alert('Failed to update feedback status');
    }
  };

  // Update admin profile
  const handleUpdateProfile = async () => {
    try {
      await axios.put(`${API_BASE_URL}/admin/profile`, adminProfile);
      fetchAdminProfile();
      setIsEditProfileDialogOpen(false);
    } catch (error) {
      console.error('Error updating admin profile:', error);
      alert('Failed to update profile');
    }
  };

  // Get status color for feedback
  const getStatusColor = (status) => {
    switch (status) {
      case 'Unread':
        return 'text-red-500';
      case 'In Progress':
        return 'text-yellow-500';
      case 'Resolved':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // No data found components
  const NoDataMessage = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-500 text-lg">{message || 'No Data Found'}</p>
    </div>
  );

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsError ? (
            <div className="col-span-full">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{statsError}</AlertDescription>
              </Alert>
            </div>
          ) : loadingStats ? (
            <div className="col-span-full">
              <LoadingSpinner />
            </div>
          ) : stats.length > 0 ? (
            stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</h3>
                      <p className="text-sm text-green-600 mt-1">
                        {stat.change} <span className="text-gray-400">{stat.period}</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-gray-50">
                      {stat.icon || <Calendar className="h-8 w-8 text-gray-500" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <NoDataMessage message="No statistics available" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Admin Profile */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              ) : loadingProfile ? (
                <LoadingSpinner />
              ) : adminProfile ? (
                <>
                  <div><h3 className="text-gray-500">Name</h3><p>{adminProfile.Admin_Name}</p></div>
                  <div><h3 className="text-gray-500">Admin ID</h3><p>{adminProfile.Admin_ID}</p></div>
                  <div><h3 className="text-gray-500">Email</h3><p>{adminProfile.Email}</p></div>
                  <div><h3 className="text-gray-500">Phone</h3><p>{adminProfile.Phone}</p></div>
                  <div><h3 className="text-gray-500">Role</h3><p>{adminProfile.Role}</p></div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setIsEditProfileDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                </>
              ) : (
                <NoDataMessage message="Admin profile not found" />
              )}
            </CardContent>
          </Card>

          {/* Companies, Training Programs and Feedback Management Tabs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <Tabs defaultValue="companies" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="companies">Companies</TabsTrigger>
                  <TabsTrigger value="training">Training Programs</TabsTrigger>
                  <TabsTrigger value="feedback">Student Feedback</TabsTrigger>
                </TabsList>

                {/* Companies Tab Content */}
                <TabsContent value="companies">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle>Companies</CardTitle>
                      <CardDescription>Manage registered companies</CardDescription>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Company
                    </Button>
                  </div>

                  {companiesError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{companiesError}</AlertDescription>
                    </Alert>
                  ) : loadingCompanies ? (
                    <LoadingSpinner />
                  ) : companies.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 border-b">
                            <th className="py-3 px-2">Company ID</th>
                            <th className="py-3 px-2">Company Name</th>
                            <th className="py-3 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {companies.map((company) => (
                            <tr key={company.id} className="border-b">
                              <td className="py-3 px-2">{company.id}</td>
                              <td className="py-3 px-2 font-medium">{company.name}</td>
                              <td className="py-3 px-2">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleEditCompany(company)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDeleteCompany(company.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <NoDataMessage message="No companies found" />
                  )}
                </TabsContent>

                {/* Training Programs Tab Content */}
                <TabsContent value="training">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle>Training Programs</CardTitle>
                      <CardDescription>Manage available training programs</CardDescription>
                    </div>
                    <Button onClick={() => setIsAddTrainingDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Training
                    </Button>
                  </div>

                  {trainingsError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{trainingsError}</AlertDescription>
                    </Alert>
                  ) : loadingTrainings ? (
                    <LoadingSpinner />
                  ) : trainingPrograms.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 border-b">
                            <th className="py-3 px-2">ID</th>
                            <th className="py-3 px-2">Training Name</th>
                            <th className="py-3 px-2">Trainer</th>
                            <th className="py-3 px-2">Duration</th>
                            <th className="py-3 px-2">Mode</th>
                            <th className="py-3 px-2">Cost</th>
                            <th className="py-3 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trainingPrograms.map((program) => (
                            <tr key={program.id} className="border-b">
                              <td className="py-3 px-2">{program.Training_ID}</td>
                              <td className="py-3 px-2 font-medium">{program.Training_Name}</td>
                              <td className="py-3 px-2">{program.Trainer_Name}</td>
                              <td className="py-3 px-2">{program.Duration} days</td>
                              <td className="py-3 px-2">{program.Mode}</td>
                              <td className="py-3 px-2">{formatCurrency(program.Cost)}</td>
                              <td className="py-3 px-2">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleEditTraining(program)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDeleteTraining(program.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <NoDataMessage message="No training programs found" />
                  )}
                </TabsContent>

                {/* Student Feedback Tab Content */}
                <TabsContent value="feedback">
                  <div className="mb-4">
                    <CardTitle>Student Feedback</CardTitle>
                    <CardDescription>Review and manage feedback from students</CardDescription>
                  </div>

                  {feedbacksError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{feedbacksError}</AlertDescription>
                    </Alert>
                  ) : loadingFeedbacks ? (
                    <LoadingSpinner />
                  ) : feedbacks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 border-b">
                            <th className="py-3 px-2">ID</th>
                            <th className="py-3 px-2">Student</th>
                            <th className="py-3 px-2">Training Program</th>
                            <th className="py-3 px-2">Rating</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feedbacks.map((feedback) => (
                            <tr key={feedback.id} className="border-b">
                              <td className="py-3 px-2">{feedback.Feedback_ID}</td>
                              <td className="py-3 px-2">{feedback.Student_Name}</td>
                              <td className="py-3 px-2">{feedback.Training_Name}</td>
                              <td className="py-3 px-2">{feedback.Rating}/5</td>
                              <td className={`py-3 px-2 font-medium ${getStatusColor(feedback.Comments)}`}>
                                {feedback.Comments}
                              </td>
                              <td className="py-3 px-2">
                                <Button variant="outline" size="sm" onClick={() => handleViewFeedback(feedback)}>
                                  <MessageCircle className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <NoDataMessage message="No student feedback found" />
                  )}
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  value={adminProfile?.Email || ''}
                  onChange={(e) => setAdminProfile(prev => prev ? { ...prev, Email: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Input
                  id="phone"
                  value={adminProfile?.Phone || ''}
                  onChange={(e) => setAdminProfile(prev => prev ? { ...prev, Phone: e.target.value } : null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditProfileDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Company Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Company</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="companyId" className="text-sm font-medium">Company ID</label>
                <Input id="companyId" value={selectedCompany?.id || ''} disabled />
              </div>
              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium">Company Name</label>
                <Input
                  id="companyName"
                  value={selectedCompany?.name || ''}
                  onChange={(e) => setSelectedCompany(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveCompany}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Company Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Company</DialogTitle></DialogHeader>
            <form onSubmit={handleAddCompany}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium">Company Name</label>
                  <Input id="companyName" name="companyName" placeholder="Enter company name" required />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Company</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Training Program Dialog */}
        <Dialog open={isAddTrainingDialogOpen} onOpenChange={setIsAddTrainingDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add New Training Program</DialogTitle></DialogHeader>
            <form onSubmit={handleAddTraining}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="trainingName" className="text-sm font-medium">Training Name</label>
                  <Input id="trainingName" name="trainingName" placeholder="Enter training program name" required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="trainingDescription" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="trainingDescription"
                    name="trainingDescription"
                    placeholder="Enter training program description"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium">Duration (days)</label>
                    <Input id="duration" name="duration" type="number" min="1" placeholder="Days" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="trainerName" className="text-sm font-medium">Trainer ID</label>
                    <Input id="trainerName" name="trainerName" placeholder="Enter trainer's name" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                    <Input id="startDate" name="startDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                    <Input id="endDate" name="endDate" type="date" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="mode" className="text-sm font-medium">Mode</label>
                    <Select name="mode" defaultValue="Online">
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Offline">Offline</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cost" className="text-sm font-medium">Cost</label>
                    <Input id="cost" name="cost" type="number" min="0" step="0.01" placeholder="Enter cost" required />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="certificationProvided" name="certificationProvided" />
                  <label htmlFor="certificationProvided" className="text-sm font-medium">
                    Certification Provided
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddTrainingDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Training Program</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit985 Training Program Dialog */}
        <Dialog open={isEditTrainingDialogOpen} onOpenChange={setIsEditTrainingDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit Training Program</DialogTitle></DialogHeader>
            <form onSubmit={handleSaveTraining}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="trainingId" className="text-sm font-medium">Training ID</label>
                  <Input id="trainingId" value={selectedTraining?.id || ''} disabled />
                </div>

                <div className="space-y-2">
                  <label htmlFor="trainingName" className="text-sm font-medium">Training Name</label>
                  <Input
                    id="trainingName"
                    value={selectedTraining?.name || ''}
                    onChange={(e) => setSelectedTraining(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="trainingDescription" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="trainingDescription"
                    value={selectedTraining?.description || ''}
                    onChange={(e) => setSelectedTraining(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium">Duration (days)</label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={selectedTraining?.duration || ''}
                      onChange={(e) => setSelectedTraining(prev => prev ? { ...prev, duration: parseInt(e.target.value) } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="trainerName" className="text-sm font-medium">Trainer Name</label>
                    <Input
                      id="trainerName"
                      value={selectedTraining?.trainerName || ''}
                      onChange={(e) => setSelectedTraining(prev => prev ? { ...prev, trainerName: e.target.value } : null)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                    <Input
                      id="startDate"
                      type="date"
                      value={selectedTraining?.startDate || ''}
                      onChange={(e) => setSelectedTraining(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                    <Input
                      id="endDate"
                      type="date"
                      value={selectedTraining?.endDate || ''}
                      onChange={(e) => setSelectedTraining(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="mode" className="text-sm font-medium">Mode</label>
                    <Select value={selectedTraining?.mode || 'Online'} onValueChange={(value) => setSelectedTraining(prev => prev ? { ...prev, mode: value } : null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Offline">Offline</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cost" className="text-sm font-medium">Cost</label>
                    <Input
                      id="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={selectedTraining?.cost || ''}
                      onChange={(e) => setSelectedTraining(prev => prev ? { ...prev, cost: parseFloat(e.target.value) } : null)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certificationProvided"
                    checked={selectedTraining?.certificationProvided || false}
                    onCheckedChange={(checked) => setSelectedTraining(prev => prev ? { ...prev, certificationProvided: checked } : null)}
                  />
                  <label htmlFor="certificationProvided" className="text-sm font-medium">
                    Certification Provided
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditTrainingDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Feedback Dialog */}
        <Dialog open={isViewFeedbackDialogOpen} onOpenChange={setIsViewFeedbackDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Feedback Details</DialogTitle></DialogHeader>
            {selectedFeedback ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Student Name</label>
                  <p>{selectedFeedback.studentName}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Training Program</label>
                  <p>{selectedFeedback.trainingProgram}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <p>{selectedFeedback.rating}/5</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <p className={`font-medium ${getStatusColor(selectedFeedback.status)}`}>{selectedFeedback.status}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comments</label>
                  <Textarea
                    value={selectedFeedback.comments}
                    readOnly
                    rows={3}
                    disabled
                  />
                </div>
              </div>
            ) : (
              <NoDataMessage message="No feedback details available" />
            )}
            {selectedFeedback && (
              <DialogFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setIsViewFeedbackDialogOpen(false)}>Close</Button>
                {selectedFeedback.status !== 'Resolved' && (
                  <Button onClick={() => handleUpdateFeedbackStatus('Resolved')} variant="default" className="bg-green-500 hover:bg-green-600">Mark as Resolved</Button>
                )}
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}