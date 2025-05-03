
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
import { Briefcase, MapPin, Search, BarChart3, FileText, DollarSign } from 'lucide-react';

export default function PlacementRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  
  // Mock placement data
  const placements = [
    {
      id: 'PL001',
      studentId: 'ST1001',
      studentName: 'Alex Johnson',
      companyId: 'CMP001',
      companyName: 'Tech Innovations Inc.',
      package: '$85,000/year',
      jobLocation: 'New York, USA',
      placementDate: '2025-02-15',
      jobId: 'JOB123',
      jobTitle: 'Software Developer',
      department: 'Computer Science',
      year: '2025',
    },
    {
      id: 'PL002',
      studentId: 'ST1002',
      studentName: 'Emma Wilson',
      companyId: 'CMP002',
      companyName: 'Global Systems Ltd.',
      package: '$92,000/year',
      jobLocation: 'Seattle, USA',
      placementDate: '2025-02-20',
      jobId: 'JOB456',
      jobTitle: 'Frontend Developer',
      department: 'Computer Science',
      year: '2025',
    },
    {
      id: 'PL003',
      studentId: 'ST1003',
      studentName: 'Ryan Lee',
      companyId: 'CMP003',
      companyName: 'DataCorp Solutions',
      package: '$78,000/year',
      jobLocation: 'Boston, USA',
      placementDate: '2025-03-05',
      jobId: 'JOB789',
      jobTitle: 'Data Analyst',
      department: 'Statistics',
      year: '2025',
    },
    {
      id: 'PL004',
      studentId: 'ST1004',
      studentName: 'Jessica Brown',
      companyId: 'CMP004',
      companyName: 'Innovate Inc.',
      package: '$105,000/year',
      jobLocation: 'San Francisco, USA',
      placementDate: '2025-03-12',
      jobId: 'JOB101',
      jobTitle: 'Product Manager',
      department: 'Business Administration',
      year: '2025',
    },
    {
      id: 'PL005',
      studentId: 'ST1005',
      studentName: 'Michael Smith',
      companyId: 'CMP005',
      companyName: 'Creative Solutions',
      package: '$88,000/year',
      jobLocation: 'Chicago, USA',
      placementDate: '2025-03-18',
      jobId: 'JOB202',
      jobTitle: 'UX/UI Designer',
      department: 'Design',
      year: '2025',
    },
    {
      id: 'PL006',
      studentId: 'ST1006',
      studentName: 'Sarah Davis',
      companyId: 'CMP001',
      companyName: 'Tech Innovations Inc.',
      package: '$90,000/year',
      jobLocation: 'Austin, USA',
      placementDate: '2024-03-25',
      jobId: 'JOB303',
      jobTitle: 'Backend Developer',
      department: 'Computer Science',
      year: '2024',
    },
    {
      id: 'PL007',
      studentId: 'ST1007',
      studentName: 'David Clark',
      companyId: 'CMP006',
      companyName: 'Finance Plus',
      package: '$95,000/year',
      jobLocation: 'Chicago, USA',
      placementDate: '2024-04-05',
      jobId: 'JOB404',
      jobTitle: 'Financial Analyst',
      department: 'Finance',
      year: '2024',
    },
  ];
  
  // Filter placements based on search term and year
  const filteredPlacements = placements.filter(placement => 
    (placement.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     placement.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     placement.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (yearFilter === 'all' || placement.year === yearFilter)
  );
  
  // Stats data
  const years = ['2025', '2024', '2023'];
  const departments = ['Computer Science', 'Business Administration', 'Finance', 'Statistics', 'Design'];
  
  // Calculate stats
  const totalPlacements = placements.length;
  const avgPackage = '$90,428/year';
  
  // Department-wise placement data for chart
  const deptPlacements = [
    { department: 'Computer Science', count: 4 },
    { department: 'Business Administration', count: 1 },
    { department: 'Finance', count: 1 },
    { department: 'Statistics', count: 1 },
    { department: 'Design', count: 1 },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
        <h1 className="text-3xl font-bold">Placement Records</h1>
        <p className="text-gray-600 mt-1">Track student placement achievements and statistics</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search placements..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-[250px]"
          />
        </div>
        
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
          <SelectItem key={year} value={year}>
            {year}
          </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
          <p className="text-sm font-medium text-gray-500">Total Placements</p>
          <h3 className="text-2xl font-bold mt-1">{totalPlacements}</h3>
          <p className="text-sm text-green-600 mt-1">
            +15% <span className="text-gray-400">from last year</span>
          </p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
          <Briefcase className="h-6 w-6 text-portal-DEFAULT" />
            </div>
          </div>
        </CardContent>
          </Card>
          
          <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
          <p className="text-sm font-medium text-gray-500">Average Package</p>
          <h3 className="text-2xl font-bold mt-1">{avgPackage}</h3>
          <p className="text-sm text-green-600 mt-1">
            +8% <span className="text-gray-400">from last year</span>
          </p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
          <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
          </Card>
          
          <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
          <p className="text-sm font-medium text-gray-500">Placement Rate</p>
          <h3 className="text-2xl font-bold mt-1">89%</h3>
          <p className="text-sm text-green-600 mt-1">
            +5% <span className="text-gray-400">from last year</span>
          </p>
            </div>
            <div className="p-3 rounded-full bg-purple-50">
          <BarChart3 className="h-6 w-6 text-portal-DEFAULT" />
            </div>
          </div>
        </CardContent>
          </Card>
        </div>
        
        {/* Department Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {departments.map((dept, index) => {
        const deptData = deptPlacements.find(d => d.department === dept);
        return (
          <Card key={index}>
            <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500">{dept}</CardTitle>
            </CardHeader>
            <CardContent>
          <div className="text-2xl font-bold">{deptData?.count || 0}</div>
          <div className="mt-1 text-xs text-gray-500">placed students</div>
            </CardContent>
          </Card>
        );
          })}
        </div>
        
        {/* Placement Records Table */}
        <Card>
          <CardHeader>
        <CardTitle>Placement Records</CardTitle>
        <CardDescription>
          Showing {filteredPlacements.length} of {placements.length} placement records
        </CardDescription>
          </CardHeader>
          <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
          <tr className="text-left text-sm text-gray-500 border-b">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Student</th>
            <th className="py-3 px-4">Company</th>
            <th className="py-3 px-4">Position</th>
            <th className="py-3 px-4">Package</th>
            <th className="py-3 px-4">Location</th>
            <th className="py-3 px-4">Placement Date</th>
          </tr>
            </thead>
            <tbody>
          {filteredPlacements.map((placement) => (
            <tr key={placement.id} className="border-b hover:bg-gray-50">
              <td className="py-4 px-4 text-sm">{placement.id}</td>
              <td className="py-4 px-4 font-medium">
            <div>
              {placement.studentName}
              <p className="text-xs text-gray-500">{placement.studentId}</p>
            </div>
              </td>
              <td className="py-4 px-4">{placement.companyName}</td>
              <td className="py-4 px-4">{placement.jobTitle}</td>
              <td className="py-4 px-4 font-medium">
            <span className="text-green-600">{placement.package}</span>
              </td>
              <td className="py-4 px-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              {placement.jobLocation}
            </div>
              </td>
              <td className="py-4 px-4">{placement.placementDate}</td>
            </tr>
          ))}
            </tbody>
          </table>
        </div>
          </CardContent>
        </Card>
      </div>
        </MainLayout>
  );
}
