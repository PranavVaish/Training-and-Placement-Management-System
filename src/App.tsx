
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import RegisterStudent from "./pages/auth/RegisterStudent";
import RegisterCompany from "./pages/auth/RegisterCompany";
import RegisterAdmin from "./pages/auth/RegisterAdmin";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import CompanyDashboard from "./pages/dashboard/CompanyDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import JobsPage from "./pages/JobsPage";
import TrainingPage from "./pages/TrainingPage";
import PlacementRecordsPage from "./pages/PlacementRecordsPage";
import FeedbackPage from "./pages/FeedbackPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Authentication Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register/student" element={<RegisterStudent />} />
          <Route path="/auth/register/company" element={<RegisterCompany />} />
          <Route path="/auth/register/admin" element={<RegisterAdmin />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/company" element={<CompanyDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          
          {/* Main Feature Routes */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/placement-records" element={<PlacementRecordsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
