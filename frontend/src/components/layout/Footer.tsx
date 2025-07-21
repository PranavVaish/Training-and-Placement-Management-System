
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-portal-DEFAULT">Training and Placement</h3>
            <p className="text-gray-600 text-sm">
              Connecting students with opportunities and companies with talent.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-portal-dark">Home</Link></li>
              <li><Link to="/jobs" className="text-gray-600 hover:text-portal-dark">Job Listings</Link></li>
              <li><Link to="/training" className="text-gray-600 hover:text-portal-dark">Training Programs</Link></li>
              <li><Link to="/placement-records" className="text-gray-600 hover:text-portal-dark">Placement Records</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-gray-900">For Students</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/auth/register/student" className="text-gray-600 hover:text-portal-dark">Register</Link></li>
              <li><Link to="/auth/login" className="text-gray-600 hover:text-portal-dark">Login</Link></li>
              <li><Link to="/training" className="text-gray-600 hover:text-portal-dark">Training</Link></li>
              <li><Link to="/jobs" className="text-gray-600 hover:text-portal-dark">Find Jobs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-gray-900">For Companies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/auth/register/company" className="text-gray-600 hover:text-portal-dark">Register</Link></li>
              <li><Link to="/auth/login" className="text-gray-600 hover:text-portal-dark">Login</Link></li>
              <li><Link to="/feedback" className="text-gray-600 hover:text-portal-dark">Feedback</Link></li>
              <li><a href="mailto:contact@jobgrowthhub.com" className="text-gray-600 hover:text-portal-dark">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© {currentYear} Training and Placement. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
