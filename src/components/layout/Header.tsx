
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold text-portal-dark">
            Training and Placement
          </h1>
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/jobs" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
            Job Listings
          </Link>
          <Link to="/training" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
            Training Programs
          </Link>
          <Link to="/placement-records" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
            Placement Records
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                Login/Register <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/auth/login" className="w-full cursor-pointer">
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/auth/register/student" className="w-full cursor-pointer">
                  Register as Student
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/auth/register/company" className="w-full cursor-pointer">
                  Register as Company
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/auth/register/admin" className="w-full cursor-pointer">
                  Register as Admin
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md border-b border-gray-200 p-4 flex flex-col space-y-2">
            <Link 
              to="/jobs" 
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Job Listings
            </Link>
            <Link 
              to="/training" 
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Training Programs
            </Link>
            <Link 
              to="/placement-records" 
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Placement Records
            </Link>
            <hr className="my-2" />
            <Link 
              to="/auth/login" 
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/auth/register/student" 
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Register as Student
            </Link>
            <Link 
              to="/auth/register/company" 
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Register as Company
            </Link>
            <Link 
              to="/auth/register/admin" 
              className="px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Register as Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
