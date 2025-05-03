import { useState } from 'react';
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
import { Edit, Plus, Trash2, User, Users, BookOpen, Briefcase } from 'lucide-react';

export default function AdminDashboard() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // for department
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false); // for profile
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<null | {id: string, name: string}>(null);
  
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    id: 'ADM12345',
    email: 'admin@example.com',
    phone: '(123) 456-7890',
    role: 'Super Admin',
  });

  const [departments, setDepartments] = useState([
    { id: 'DEP001', name: 'Computer Science' },
    { id: 'DEP002', name: 'Electrical Engineering' },
    { id: 'DEP003', name: 'Mechanical Engineering' },
    { id: 'DEP004', name: 'Civil Engineering' },
    { id: 'DEP005', name: 'Business Administration' },
  ]);
  
  const stats = [
    { title: 'Total Students', value: 2450, icon: <User className="h-8 w-8 text-blue-500" />, change: '+15%', period: 'from last year' },
    { title: 'Registered Companies', value: 78, icon: <Briefcase className="h-8 w-8 text-purple-500" />, change: '+23%', period: 'from last year' },
    { title: 'Active Training Programs', value: 32, icon: <BookOpen className="h-8 w-8 text-green-500" />, change: '+8%', period: 'from last year' },
    { title: 'Placements (2024)', value: 845, icon: <Users className="h-8 w-8 text-orange-500" />, change: '+12%', period: 'from previous batch' },
  ];

  const handleEditDepartment = (department: {id: string, name: string}) => {
    setSelectedDepartment(department);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    setDepartments(departments.filter(dept => dept.id !== departmentId));
  };

  const handleSaveDepartment = () => {
    if (!selectedDepartment) return;
    setDepartments(departments.map(dept => 
      dept.id === selectedDepartment.id ? selectedDepartment : dept
    ));
    setIsEditDialogOpen(false);
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newDeptName = formData.get('departmentName') as string;
    if (!newDeptName) return;
    const newId = `DEP${(departments.length + 1).toString().padStart(3, '0')}`;
    setDepartments([...departments, { id: newId, name: newDeptName }]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
                  <div className="p-3 rounded-full bg-gray-50">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Admin Profile */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><h3 className="text-gray-500">Name</h3><p>{adminProfile.name}</p></div>
              <div><h3 className="text-gray-500">Admin ID</h3><p>{adminProfile.id}</p></div>
              <div><h3 className="text-gray-500">Email</h3><p>{adminProfile.email}</p></div>
              <div><h3 className="text-gray-500">Phone</h3><p>{adminProfile.phone}</p></div>
              <div><h3 className="text-gray-500">Role</h3><p>{adminProfile.role}</p></div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setIsEditProfileDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Department Management */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Departments</CardTitle>
                  <CardDescription>Manage academic departments</CardDescription>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Department
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="py-3 px-2">Department ID</th>
                      <th className="py-3 px-2">Department Name</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id} className="border-b">
                        <td className="py-3 px-2">{dept.id}</td>
                        <td className="py-3 px-2 font-medium">{dept.name}</td>
                        <td className="py-3 px-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditDepartment(dept)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteDepartment(dept.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
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
                  value={adminProfile.email} 
                  onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Input 
                  id="phone" 
                  value={adminProfile.phone} 
                  onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditProfileDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsEditProfileDialogOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Department Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Department</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="departmentId" className="text-sm font-medium">Department ID</label>
                <Input id="departmentId" value={selectedDepartment?.id || ''} disabled />
              </div>
              <div className="space-y-2">
                <label htmlFor="departmentName" className="text-sm font-medium">Department Name</label>
                <Input 
                  id="departmentName" 
                  value={selectedDepartment?.name || ''}
                  onChange={(e) => setSelectedDepartment(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveDepartment}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Department Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Department</DialogTitle></DialogHeader>
            <form onSubmit={handleAddDepartment}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="departmentName" className="text-sm font-medium">Department Name</label>
                  <Input id="departmentName" name="departmentName" placeholder="Enter department name" required />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Department</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
