
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
import { BookOpen, Calendar, Clock, User, Search, Filter, Award } from 'lucide-react';

export default function TrainingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock training programs data
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
  
  // Mock trainers data
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
  
  // Mock enrollment data
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
  
  // Filter programs based on search term
  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          </div>
        </div>
        
        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-1 sm:grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="enrollment">My Enrollments</TabsTrigger>
          </TabsList>
          
          {/* Training Programs Tab */}
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
                    <Button className="w-full bg-portal-DEFAULT hover:bg-portal-dark">
                      Enroll Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Trainers Tab */}
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
          
          {/* Enrollment Tab */}
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
                      <Button asChild>
                        <a href="#programs">Browse Programs</a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
