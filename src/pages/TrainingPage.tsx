import { useState } from 'react';
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
import { BookOpen, Calendar, Clock, User, Search, Filter, Award, UserRound, Phone, Mail, Briefcase, Bookmark, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function TrainingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  
  const programs = [
    {
      id: 'TRN001',
      name: 'Web Development Fundamentals',
      description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
      duration: '8 weeks',
      trainerId: 'TR001',
      trainerName: 'Dr. Emily Chen',
      startDate: '2025-06-01',
      endDate: '2025-07-27',
      mode: 'Online',
      cost: '$299',
      certification: true,
    },
    {
      id: 'TRN002',
      name: 'Data Science Essentials',
      description: 'Introduction to data analysis, statistics, and machine learning fundamentals.',
      duration: '4 weeks',
      trainerId: 'TR002',
      trainerName: 'Prof. James Wilson',
      startDate: '2025-05-15',
      endDate: '2025-06-12',
      mode: 'Hybrid',
      cost: '$399',
      certification: true,
    },
    {
      id: 'TRN003',
      name: 'Mobile App Development',
      description: 'Learn to build native mobile applications for iOS and Android platforms.',
      duration: '10 weeks',
      trainerId: 'TR003',
      trainerName: 'Sarah Johnson',
      startDate: '2025-07-01',
      endDate: '2025-09-09',
      mode: 'In-person',
      cost: '$499',
      certification: true,
    },
    {
      id: 'TRN004',
      name: 'Cloud Computing',
      description: 'Explore cloud services, deployment models, and best practices.',
      duration: '6 weeks',
      trainerId: 'TR004',
      trainerName: 'Michael Brown',
      startDate: '2025-06-15',
      endDate: '2025-07-27',
      mode: 'Online',
      cost: '$349',
      certification: true,
    },
    {
      id: 'TRN005',
      name: 'Cybersecurity Fundamentals',
      description: 'Learn essential security concepts, threat detection, and prevention strategies.',
      duration: '6 weeks',
      trainerId: 'TR005',
      trainerName: 'Dr. Robert Thompson',
      startDate: '2025-08-01',
      endDate: '2025-09-12',
      mode: 'Online',
      cost: '$449',
      certification: true,
    },
  ];
  
  const trainers = [
    {
      id: 'TR001',
      name: 'Dr. Emily Chen',
      email: 'emily.chen@example.com',
      phone: '(123) 456-7890',
      expertise: 'Web Development, UX/UI Design',
      organization: 'Tech University',
    },
    {
      id: 'TR002',
      name: 'Prof. James Wilson',
      email: 'j.wilson@example.com',
      phone: '(123) 456-7891',
      expertise: 'Data Science, Machine Learning',
      organization: 'Data Analytics Institute',
    },
    {
      id: 'TR003',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(123) 456-7892',
      expertise: 'Mobile Development, Cross-platform Apps',
      organization: 'MobileTech Inc.',
    },
    {
      id: 'TR004',
      name: 'Michael Brown',
      email: 'm.brown@example.com',
      phone: '(123) 456-7893',
      expertise: 'Cloud Architecture, AWS, Azure',
      organization: 'Cloud Solutions Group',
    },
    {
      id: 'TR005',
      name: 'Dr. Robert Thompson',
      email: 'r.thompson@example.com',
      phone: '(123) 456-7894',
      expertise: 'Cybersecurity, Network Security',
      organization: 'Security Experts Ltd.',
    },
  ];
  
  const enrollments = [
    {
      enrollmentId: 'ENR001',
      studentId: 'ST12345',
      trainingId: 'TRN001',
      trainingName: 'Web Development Fundamentals',
      status: 'In Progress',
      performance: 'Good',
    },
    {
      enrollmentId: 'ENR002',
      studentId: 'ST12345',
      trainingId: 'TRN002',
      trainingName: 'Data Science Essentials',
      status: 'Completed',
      performance: 'Excellent',
    },
  ];
  
  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleTrainerSubmit = (data) => {
    console.log('Trainer registration data:', data);
    toast.success('Trainer registration submitted successfully!');
    trainerForm.reset();
  };

  const handleTrainingRegistration = (program) => {
    setSelectedProgram(program);
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    console.log('Enrolled for training:', selectedProgram);
    toast.success(`Successfully enrolled in ${selectedProgram.name}!`);
    setSelectedProgram(null);
  };

  const feedbackForm = useForm({
    defaultValues: {
      studentId: '',
      trainingId: '',
      trainerId: '',
      rating: '',
      comments: ''
    }
  });

  const handleFeedbackSubmit = (data) => {
    console.log('Feedback data:', data);
    toast.success('Feedback submitted successfully!');
    feedbackForm.reset();
  };

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
                <Button 
                  className="bg-dark-orange text-white"
                >
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
                            <Input placeholder="e.g. John Doe" {...field} />
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
                              <Input placeholder="e.g. johndoe@example.com" {...field} />
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
                              <Input placeholder="e.g. (123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={trainerForm.control}
                      name="trainerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trainer ID</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. TR123" {...field} />
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
                            <Input placeholder="e.g. Web Development, Machine Learning" {...field} />
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
                            <Input placeholder="e.g. Tech University" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit" className="bg-dark-charcoal text-white">Register</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-1 sm:grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="enrollment">My Enrollments</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="programs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-dark-purple text-white"
                          onClick={() => handleTrainingRegistration(program)}
                        >
                          <Bookmark className="mr-2 h-4 w-4" />
                          Enroll Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Training Registration</DialogTitle>
                          <DialogDescription>
                            Register for "{selectedProgram?.name}" training program.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEnrollSubmit} className="space-y-4">
                          <div className="grid gap-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="studentId" className="text-right">Student ID</Label>
                              <Input id="studentId" placeholder="Enter your student ID" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">Full Name</Label>
                              <Input id="name" placeholder="Enter your full name" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">Email</Label>
                              <Input id="email" type="email" placeholder="Enter your email" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="department" className="text-right">Department</Label>
                              <Input id="department" placeholder="Enter your department" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="paymentMethod" className="text-right">Payment Method</Label>
                              <Select defaultValue="credit">
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="credit">Credit Card</SelectItem>
                                  <SelectItem value="debit">Debit Card</SelectItem>
                                  <SelectItem value="bank">Bank Transfer</SelectItem>
                                  <SelectItem value="paypal">PayPal</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="flex justify-between items-center">
                              <span>Training Fee:</span>
                              <span className="font-semibold">{selectedProgram?.cost}</span>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" className="bg-dark-charcoal text-white">Confirm Registration</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="py-3 px-4">Trainer ID</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Expertise</th>
                        <th className="py-3 px-4">Organization</th>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="enrollment">
            <Card>
              <CardHeader>
                <CardTitle>My Enrollments</CardTitle>
                <CardDescription>
                  View your current and past training enrollments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b">
                          <th className="py-3 px-4">Enrollment ID</th>
                          <th className="py-3 px-4">Training Program</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Performance</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment.enrollmentId} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm">{enrollment.enrollmentId}</td>
                            <td className="py-4 px-4 font-medium">{enrollment.trainingName}</td>
                            <td className="py-4 px-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                enrollment.status === 'Completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {enrollment.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">{enrollment.performance}</td>
                            <td className="py-4 px-4">
                              <Button variant="outline" size="sm">View Details</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    You are not enrolled in any training programs yet.
                    <div className="mt-4">
                      <Button asChild className="bg-dark-charcoal text-white">
                        <a href="#programs">Browse Programs</a>
                      </Button>
                    </div>
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
                              <Input placeholder="Enter your Student ID" {...field} />
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
                    
                    <Button type="submit" className="bg-dark-charcoal text-white">
                      <Star className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
