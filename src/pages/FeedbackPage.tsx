
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, MessageSquare } from 'lucide-react';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    studentId: '',
    companyId: '',
    trainerId: '',
    feedbackType: '',
    rating: '',
    comments: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        studentId: '',
        companyId: '',
        trainerId: '',
        feedbackType: '',
        rating: '',
        comments: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Feedback Form</h1>
          <p className="text-gray-600 mb-8">
            Share your experience and help us improve our services
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-portal-DEFAULT" />
                Submit Feedback
              </CardTitle>
              <CardDescription>
                Please fill out the form below to submit your feedback
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {/* Identification Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Identification Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID (if applicable)</Label>
                      <Input 
                        id="studentId" 
                        placeholder="Enter your student ID" 
                        value={formData.studentId}
                        onChange={e => handleChange('studentId', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyId">Company ID (if applicable)</Label>
                      <Input 
                        id="companyId" 
                        placeholder="Enter company ID" 
                        value={formData.companyId}
                        onChange={e => handleChange('companyId', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainerId">Trainer ID (if applicable)</Label>
                    <Input 
                      id="trainerId" 
                      placeholder="Enter trainer ID" 
                      value={formData.trainerId}
                      onChange={e => handleChange('trainerId', e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Feedback Type */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Feedback Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="feedbackType">Feedback Type</Label>
                    <Select 
                      onValueChange={(value) => handleChange('feedbackType', value)} 
                      value={formData.feedbackType}
                    >
                      <SelectTrigger id="feedbackType">
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="training_program">Training Program</SelectItem>
                        <SelectItem value="trainer">Trainer</SelectItem>
                        <SelectItem value="placement_process">Placement Process</SelectItem>
                        <SelectItem value="interview_experience">Interview Experience</SelectItem>
                        <SelectItem value="job_experience">Job Experience</SelectItem>
                        <SelectItem value="website_usability">Website Usability</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <RadioGroup 
                      className="flex space-x-2" 
                      value={formData.rating} 
                      onValueChange={(value) => handleChange('rating', value)}
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex flex-col items-center">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                            <Label htmlFor={`rating-${value}`} className="sr-only">
                              {value}
                            </Label>
                          </div>
                          <Star 
                            className={`h-5 w-5 mt-1 ${
                              parseInt(formData.rating) >= value 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                          <span className="text-xs mt-1">{value}</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                
                {/* Comments */}
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea 
                    id="comments" 
                    placeholder="Please share your thoughts, suggestions, or experiences"
                    className="min-h-[150px]"
                    value={formData.comments}
                    onChange={e => handleChange('comments', e.target.value)}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-portal-DEFAULT hover:bg-portal-dark"
                  disabled={submitted}
                >
                  {submitted ? 'Submitted Successfully!' : 'Submit Feedback'}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              Your feedback is valuable to us and helps improve our services for everyone.
              All submissions are kept confidential.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
