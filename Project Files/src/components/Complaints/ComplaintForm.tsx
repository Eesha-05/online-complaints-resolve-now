import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ComplaintFormProps {
  currentUser: {
    name: string;
    email: string;
    role: string;
  };
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  contactPhone: string;
  address: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  assignedAgent: string | null;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  messages: Array<{
    sender: string;
    message: string;
    time: string;
  }>;
}

const ComplaintForm = ({ currentUser }: ComplaintFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    contactPhone: '',
    address: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a complaint ID
    const newComplaintId = 'CMP' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setComplaintId(newComplaintId);
    
    // Create complaint object with actual user details
    const newComplaint: Complaint = {
      id: newComplaintId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      contactPhone: formData.contactPhone,
      address: formData.address,
      status: 'pending',
      assignedAgent: null,
      createdAt: new Date().toISOString(),
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      messages: [{
        sender: currentUser.name,
        message: formData.description,
        time: new Date().toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      }]
    };

    // Save to localStorage
    const existingComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    existingComplaints.push(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(existingComplaints));

    setIsSubmitted(true);
    
    // Show success toast
    toast({
      title: "Complaint Submitted Successfully!",
      description: `Your complaint has been registered with ID: ${newComplaintId}`,
    });

    console.log('Complaint submitted:', newComplaint);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNewComplaint = () => {
    setIsSubmitted(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: '',
      contactPhone: '',
      address: '',
    });
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">Complaint Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">Your complaint has been registered and assigned ID:</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-lg font-bold text-green-800">{complaintId}</p>
          </div>
          <p className="text-gray-600 mb-6">
            You will receive updates on your complaint status. An agent will be assigned to handle your case shortly.
          </p>
          <Button onClick={handleNewComplaint} className="bg-blue-600 hover:bg-blue-700">
            Submit Another Complaint
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Submit New Complaint
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Complaint Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => handleInputChange('category', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product Issue</SelectItem>
                  <SelectItem value="service">Service Issue</SelectItem>
                  <SelectItem value="billing">Billing Problem</SelectItem>
                  <SelectItem value="delivery">Delivery Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select onValueChange={(value) => handleInputChange('priority', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Please provide detailed information about your complaint..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              placeholder="Your contact number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Your address (if relevant to the complaint)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500">
              Upload relevant images or documents (max 5MB each)
            </p>
          </div>

          <Button type="submit" className="w-full">
            Submit Complaint
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComplaintForm;
