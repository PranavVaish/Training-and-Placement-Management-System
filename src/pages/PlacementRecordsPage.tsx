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
import { Briefcase, MapPin, Search, BarChart3, FileText, DollarSign, Loader2, RefreshCw } from 'lucide-react';

export default function PlacementRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [placements, setPlacements] = useState([]);
  const [years, setYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalPlacements: 0,
    avgPackage: '$0/year',
    placementRate: '0%',
    yearlyGrowth: '+0%',
    packageGrowth: '+0%',
    rateGrowth: '+0%'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchPlacementData();
  }, []);

  const fetchPlacementData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch placements data
      const placementsResponse = await fetch('http://your-fastapi-url/api/placements');
      if (!placementsResponse.ok) {
        throw new Error('Failed to fetch placement records');
      }
      const placementsData = await placementsResponse.json();
      setPlacements(placementsData);

      // Fetch placement statistics
      const statsResponse = await fetch('http://your-fastapi-url/api/placement-stats');
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch placement statistics');
      }
      const statsData = await statsResponse.json();
      
      // Extract and set statistics
      setTotalStats({
        totalPlacements: statsData.totalPlacements || 0,
        avgPackage: statsData.avgPackage || '$0/year',
        placementRate: statsData.placementRate || '0%',
        yearlyGrowth: statsData.yearlyGrowth || '+0%',
        packageGrowth: statsData.packageGrowth || '+0%',
        rateGrowth: statsData.rateGrowth || '+0%'
      });
      
      // Extract and set years for filtering
      if (statsData.years && Array.isArray(statsData.years)) {
        setYears(statsData.years);
      }
      
      // Extract and set departments and their stats
      if (statsData.departments && Array.isArray(statsData.departments)) {
        setDepartments(statsData.departments.map(dept => dept.name));
        setDepartmentStats(statsData.departments);
      }
    } catch (err) {
      console.error('Error fetching placement data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter placements based on search term and year
  const filteredPlacements = placements.filter(placement => 
    (placement.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     placement.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     placement.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (yearFilter === 'all' || placement.year === yearFilter)
  );

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-portal-DEFAULT" />
          <p className="mt-4 text-gray-600">Loading placement records...</p>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-red-600">Error Loading Placement Data</h2>
              <p className="text-red-500 mt-2">{error}</p>
              <Button 
                className="mt-4" 
                onClick={fetchPlacementData}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
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
                  <h3 className="text-2xl font-bold mt-1">{totalStats.totalPlacements}</h3>
                  <p className="text-sm text-green-600 mt-1">
                    {totalStats.yearlyGrowth} <span className="text-gray-400">from last year</span>
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
                  <h3 className="text-2xl font-bold mt-1">{totalStats.avgPackage}</h3>
                  <p className="text-sm text-green-600 mt-1">
                    {totalStats.packageGrowth} <span className="text-gray-400">from last year</span>
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
                  <h3 className="text-2xl font-bold mt-1">{totalStats.placementRate}</h3>
                  <p className="text-sm text-green-600 mt-1">
                    {totalStats.rateGrowth} <span className="text-gray-400">from last year</span>
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-50">
                  <BarChart3 className="h-6 w-6 text-portal-DEFAULT" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* No Data Found for Department Stats */}
        {departments.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <p className="text-gray-500 py-4">No department statistics found</p>
            </CardContent>
          </Card>
        ) : (
          /* Department Stats */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {departments.map((dept, index) => {
              const deptData = departmentStats.find(d => d.name === dept);
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
        )}
        
        {/* No Data Found for Placement Records */}
        {placements.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Placement Records</CardTitle>
              <CardDescription>No records available</CardDescription>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600">No Placement Records Found</h2>
              <p className="text-gray-500 mt-2">There are currently no placement records available.</p>
              <Button className="mt-4" onClick={fetchPlacementData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Placement Records Table */
          <Card>
            <CardHeader>
              <CardTitle>Placement Records</CardTitle>
              <CardDescription>
                Showing {filteredPlacements.length} of {placements.length} placement records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPlacements.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No records match your search criteria
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}