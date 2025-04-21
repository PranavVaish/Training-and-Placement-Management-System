import MainLayout from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, GraduationCap, Users, Briefcase, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import backgroundImage from '@/assets/job-portal-bg.jpg';

export default function Index() {
  return (
    <MainLayout>
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-cover bg-center py-16 md:py-24 text-white" 
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Training & Placement Management System
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Connect with the right opportunities and grow your career
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-[#1A1F2C] text-white">
                <Link to="/training">Explore Training</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-gray-50" id="about">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="animate-spin-slow absolute -top-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-r from-portal-DEFAULT to-portal-dark opacity-20"></div>
                <div className="animate-ping-slow absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-r from-portal-dark to-portal-DEFAULT opacity-20"></div>
                <div className="rounded-full bg-portal-muted p-6 relative z-10">
                  <Sparkles className="h-12 w-12 text-portal-DEFAULT animate-pulse" />
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">About Us</h2>
            <div className="prose prose-lg mx-auto">
              <p>
                The Training and Placement Management System is dedicated to bridging the gap between 
                educational institutions, students, and industry. We provide a comprehensive platform 
                that facilitates career development, training programs, and job placements.
              </p>
              <p>
                Our mission is to empower students with the skills and opportunities needed to thrive 
                in their careers while helping companies find exceptional talent that aligns with their 
                requirements and culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Training & Placements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-portal-muted rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-portal-DEFAULT" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Training</h3>
              <Button className="bg-portal-light text-white w-full">
                View Courses
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-portal-muted rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-portal-DEFAULT" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Career Opportunities</h3>
              <Button className="bg-portal-light text-white w-full">
                Explore Opportunities
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 bg-portal-muted rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-portal-DEFAULT" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Industry Network</h3>
              <Button className="text-white w-full" style={{ backgroundColor: '#9B87F5' }}>
                Connect Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-portal-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-portal-dark">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700">
            Join our platform today to access exclusive job listings, training programs, and career resources.
          </p>
          <Button asChild size="lg" className="bg-portal-DEFAULT hover:bg-portal-dark text-white">
            <Link to="/auth/register/student">
              Register Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
