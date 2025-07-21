import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Calendar, Clock, User, Search, Award, UserRound, Phone, Mail, Briefcase, Bookmark, Star, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';

// API base URL - replace with your actual FastAPI endpoint
const API_BASE_URL = 'http://127.0.0.1:8000';

export default function TrainingPage() {
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Data states
  const [programs, setPrograms] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  // Loading states
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingTrainers, setLoadingTrainers] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  // Error states
  const [programsError, setProgramsError] = useState(null);
  const [trainersError, setTrainersError] = useState(null);
  const [enrollmentsError, setEnrollmentsError] = useState(null);

  // Forms
  const trainerForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      trainerId: '',
      expertise: '',
      organization: ''
    }
  });

  const feedbackForm = useForm({
    defaultValues: {
      studentId: '',
      trainingId: '',
      trainerId: '',
      rating: '',
      comments: ''
    }
  });

  const enrollForm = useForm({
    defaultValues: {
      studentId: '',
      name: '',
      email: '',
      department: '',
      paymentMethod: 'credit'
    }
  });

  // Fetch training programs data
  const fetchPrograms = async () => {
    try {
      setLoadingPrograms(true);
      setProgramsError(null);
      const response = await axios.get(`${API_BASE_URL}/training/programs`);

      // Map server response to expected frontend format
      const mappedPrograms = response.data.map((program, index) => ({
        id: program.Training_ID || index + 1, // Use server-provided ID or fallback
        name: program.Training_Name,
        description: program.Training_Description,
        duration: `${program.Duration} hours`,
        startDate: program.Start_Date,
        endDate: program.End_Date || 'N/A',
        mode: program.Mode,
        cost: `$${program.Training_Cost.toFixed(2)}`,
        trainerName: program.Trainer_Name,
        certification: program.Certification_Provided
      }));

      setPrograms(mappedPrograms);
    } catch (error) {
      setProgramsError(error.response?.data?.detail || 'Failed to fetch training programs');
    } finally {
      setLoadingPrograms(false);
    }
  };

  // Fetch trainers data
  const fetchTrainers = async () => {
    try {
      setLoadingTrainers(true);
      setTrainersError(null);
      const response = await axios.get(`${API_BASE_URL}/training/trainers`);

      // Map the fetched data to match the expected format
      const mappedTrainers = response.data.trainers.map(trainer => ({
        id: trainer.Trainer_ID,
        name: trainer.Name,
        organization: trainer.Organisation,
        email: trainer.Email,
        phone: trainer.Phone_No,
        expertise: trainer.Expertise,
      }));

      setTrainers(mappedTrainers);
    } catch (error) {
      setTrainersError(error.response?.data?.detail || 'Failed to fetch trainers');
    } finally {
      setLoadingTrainers(false);
    }
  };

  // Fetch enrollments data
  const fetchEnrollments = async () => {
    try {
      setLoadingEnrollments(true);
      setEnrollmentsError(null);
      const studentId = 'ST12345'; // Replace with dynamic student ID from auth context
      const response = await axios.get(`${API_BASE_URL}/enrollments`, {
        params: { studentId }
      });
      setEnrollments(response.data);
    } catch (error) {
      setEnrollmentsError(error.response?.data?.detail || 'Failed to fetch enrollments');
    } finally {
      setLoadingEnrollments(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPrograms();
    fetchTrainers();
    fetchEnrollments();
  }, []);

  // Filter programs based on search term
  const filteredPrograms = programs.filter(program =>
    program.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for trainer form submission
  const handleTrainerSubmit = async (data) => {
    try {
      setSubmitting(true);
      await axios.post(`${API_BASE_URL}/training/register`, data);
      toast.success('Trainer registration submitted successfully!');
      trainerForm.reset();
      fetchTrainers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to register trainer');
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for training registration
  const handleTrainingRegistration = (program) => {
    setSelectedProgram(program);
  };

  // Handler for enrollment submission
  const handleEnrollSubmit = async (data) => {
    if (!selectedProgram) {
      toast.error('No program selected for enrollment');
      return;
    }

    try {
      setSubmitting(true);
      const enrollmentData = {
        studentId: data.studentId,
        studentName: data.name,
        studentEmail: data.email,
        department: data.department,
        trainingId: selectedProgram.id,
        paymentMethod: data.paymentMethod
      };

      await axios.post(`${API_BASE_URL}/students/enroll`, enrollmentData);
      toast.success(`Successfully enrolled in ${selectedProgram.name}!`);
      setSelectedProgram(null);
      enrollForm.reset();
      fetchEnrollments();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to enroll in training');
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for feedback submission
  const handleFeedbackSubmit = async (data) => {
    try {
      setSubmitting(true);
      await axios.post(`${API_BASE_URL}/feedback`, data);
      toast.success('Feedback submitted successfully!');
      feedbackForm.reset();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for trainer removal
  const handleTrainerRemoval = async (trainerId, adminId, adminPassword) => {
    try {
      setSubmitting(true);
      await axios.delete(`${API_BASE_URL}/trainers/${trainerId}`, {
        data: { adminId, adminPassword }
      });
      toast.success('Trainer removed successfully!');
      fetchTrainers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid admin credentials');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
      <p className="text-gray-500 text-center">Loading data...</p>
    </div>
  );

  // Empty state component
  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
      <p className="text-gray-500 text-center text-lg mb-2">{message || 'No Data Found'}</p>
      <p className="text-gray-400 text-center text-sm">Try refreshing or check back later.</p>
    </div>
  );

  // Error state component
  const ErrorState = ({ error, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-8 border border-red-200 bg-red-50 rounded-lg">
      <p className="text-red-500 text-center mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline" className="border-red-300">
        Retry
      </Button>
    </div>
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Training Programs</h1>
            <p className="text-gray-600 mt-1">Enhance your skills with our professional training courses</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-[300px]"
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-dark-orange text-white">
                  <UserRound className="mr-2 h-4 w-4" />
                  Register as Trainer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Trainer Registration</DialogTitle>
                  <DialogDescription>
                    Register as a trainer to conduct training programs on our platform.
                  </DialogDescription>
                </DialogHeader>
                <Form {...trainerForm}>
                  <form onSubmit={trainerForm.handleSubmit(handleTrainerSubmit)} className="space-y-4">
                    <FormField
                      control={trainerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. John Doe" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={trainerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="e.g. johndoe@example.com" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={trainerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. (123) 456-7890" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={trainerForm.control}
                      name="trainerId"
                      render={({ field

                      }) => (
                        <FormItem>
                          <FormLabel>Trainer ID</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. TR123" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={trainerForm.control}
                      name="expertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area of Expertise</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Web Development, Machine Learning" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={trainerForm.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Tech University" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" className="bg-dark-charcoal text-white" disabled={submitting}>
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Register'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="programs" className="w-auto">
          <TabsList className="mb-8 grid w-auto grid-cols-3 sm:grid-cols-3 max-w-md mx-auto justify-center">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="programs">
            {loadingPrograms ? (
              <LoadingState />
            ) : programsError ? (
              <ErrorState error={programsError} onRetry={fetchPrograms} />
            ) : programs.length === 0 ? (
              <EmptyState message="No training programs available at the moment." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((program) => (
                    <Card key={program.id} className="overflow-hidden">
                      <div className="h-3 bg-portal-DEFAULT" />
                      <CardHeader>
                        <CardTitle className="flex items-start gap-2">
                          <BookOpen className="h-5 w-5 text-portal-DEFAULT mt-1 flex-shrink-0" />
                          <div>{program.name}</div>
                        </CardTitle>
                        <CardDescription>{program.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Duration: {program.duration}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {program.startDate} to {program.endDate}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Trainer: {program.trainerName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Mode: {program.mode}</span>
                          <span className="font-semibold">{program.cost}</span>
                        </div>
                        {program.certification && (
                          <div className="flex items-center text-sm text-green-600">
                            <Award className="h-4 w-4 mr-2" />
                            <span>Certification Available</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Dialog open={selectedProgram?.id === program.id} onOpenChange={(open) => !open && setSelectedProgram(null)}>
                          <DialogTrigger asChild>
                            <Button
                              className="w-full bg-dark-purple text-white"
                              onClick={() => handleTrainingRegistration(program)}
                            >
                              <Bookmark className="mr-2 h-4 w-4" />
                              Enroll Now
                            </Button>
                          </DialogTrigger>
                          {selectedProgram && (
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Training Registration</DialogTitle>
                                <DialogDescription>
                                  Register for "{selectedProgram.name}" training program.
                                </DialogDescription>
                              </DialogHeader>
                              <Form {...enrollForm}>
                                <form onSubmit={enrollForm.handleSubmit(handleEnrollSubmit)} className="space-y-4">
                                  <div className="grid gap-4">
                                    <FormField
                                      control={enrollForm.control}
                                      name="studentId"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Student ID</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Enter your student ID" {...field} required />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={enrollForm.control}
                                      name="name"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Full Name</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Enter your full name" {...field} required />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={enrollForm.control}
                                      name="email"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Email</FormLabel>
                                          <FormControl>
                                            <Input type="email" placeholder="Enter your email" {...field} required />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={enrollForm.control}
                                      name="department"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Department</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Enter your department" {...field} required />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={enrollForm.control}
                                      name="paymentMethod"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Payment Method</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select payment method" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value="credit">Credit Card</SelectItem>
                                              <SelectItem value="debit">Debit Card</SelectItem>
                                              <SelectItem value="bank">Bank Transfer</SelectItem>
                                              <SelectItem value="paypal">PayPal</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className="bg-muted p-3 rounded-md">
                                    <div className="flex justify-between items-center">
                                      <span>Training Fee:</span>
                                      <span className="font-semibold">{selectedProgram.cost}</span>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit" className="bg-dark-charcoal text-white" disabled={submitting}>
                                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Registration'}
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          )}
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <EmptyState message="No programs match your search criteria." />
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trainers">
            <Card>
              <CardHeader>
                <CardTitle>Program Trainers</CardTitle>
                <CardDescription>
                  Meet our expert trainers and instructors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTrainers ? (
                  <LoadingState />
                ) : trainersError ? (
                  <ErrorState error={trainersError} onRetry={fetchTrainers} />
                ) : trainers.length === 0 ? (
                  <EmptyState message="No trainers registered at the moment." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b">
                          <th className="py-3 px-4">Trainer ID</th>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Expertise</th>
                          <th className="py-3 px-4">Organization</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainers.map((trainer) => (
                          <tr key={trainer.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm">{trainer.id}</td>
                            <td className="py-4 px-4 font-medium">{trainer.name}</td>
                            <td className="py-4 px-4">
                              <div>
                                <p>{trainer.email}</p>
                                <p className="text-sm text-gray-500">{trainer.phone}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">{trainer.expertise}</td>
                            <td className="py-4 px-4">{trainer.organization}</td>
                            <td className="py-4 px-4">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600">
                                    Remove
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[400px]">
                                  <DialogHeader>
                                    <DialogTitle>Remove Trainer</DialogTitle>
                                    <DialogDescription>
                                      Enter admin credentials to remove trainer "{trainer.name}".
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      const form = e.target;
                                      const adminId = form.adminId.value;
                                      const adminPassword = form.adminPassword.value;
                                      handleTrainerRemoval(trainer.id, adminId, adminPassword);
                                    }}
                                    className="space-y-4"
                                  >
                                    <div className="grid gap-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="adminId" className="text-right">
                                          Admin ID
                                        </Label>
                                        <Input id="adminId" name="adminId" placeholder="Enter admin ID" className="col-span-3" required />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="adminPassword" className="text-right">
                                          Password
                                        </Label>
                                        <Input
                                          id="adminPassword"
                                          name="adminPassword"
                                          type="password"
                                          placeholder="Enter admin password"
                                          className="col-span-3"
                                          required
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button type="submit" className="bg-red-600 text-white" disabled={submitting}>
                                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Removal'}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Training Feedback</CardTitle>
                <CardDescription>
                  Share your experience and help us improve our training programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPrograms || loadingTrainers ? (
                  <LoadingState />
                ) : (
                  <Form {...feedbackForm}>
                    <form onSubmit={feedbackForm.handleSubmit(handleFeedbackSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={feedbackForm.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Student ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your Student ID" {...field} required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={feedbackForm.control}
                          name="trainingId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Training Program</FormLabel>
                              {programs.length > 0 ? (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select training program" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {programs.map(program => (
                                      <SelectItem key={program.id} value={program.id}>
                                        {program.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div className="text-sm text-gray-500 border rounded-md p-2">
                                  No training programs available
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={feedbackForm.control}
                          name="trainerId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trainer</FormLabel>
                              {trainers.length > 0 ? (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select trainer" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {trainers.map(trainer => (
                                      <SelectItem key={trainer.id} value={trainer.id}>
                                        {trainer.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div className="text-sm text-gray-500 border rounded-md p-2">
                                  No trainers available
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={feedbackForm.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rating</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="5">★★★★★ Excellent</SelectItem>
                                  <SelectItem value="4">★★★★☆ Very Good</SelectItem>
                                  <SelectItem value="3">★★★☆☆ Good</SelectItem>
                                  <SelectItem value="2">★★☆☆☆ Fair</SelectItem>
                                  <SelectItem value="1">★☆☆☆☆ Poor</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={feedbackForm.control}
                        name="comments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comments</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your experience, suggestions, and feedback"
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="bg-dark-charcoal text-white" disabled={submitting}>
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Star className="mr-2 h-4 w-4" /> Submit Feedback</>}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}