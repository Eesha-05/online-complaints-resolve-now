
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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

interface AgentDashboardProps {
  currentUser: {
    name: string;
    email: string;
    role: string;
  };
}

const AgentDashboard = ({ currentUser }: AgentDashboardProps) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load complaints from localStorage and filter assigned ones for current agent
    const savedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const assignedComplaints = savedComplaints.filter((complaint: Complaint) => 
      complaint.assignedAgent === currentUser.name
    );
    setComplaints(assignedComplaints);
  }, [currentUser.name]);

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    // Update local state
    const updatedComplaints = complaints.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, status: newStatus as any }
        : complaint
    );
    setComplaints(updatedComplaints);

    // Update localStorage
    const allComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const updatedAllComplaints = allComplaints.map((complaint: Complaint) =>
      complaint.id === complaintId
        ? { ...complaint, status: newStatus }
        : complaint
    );
    localStorage.setItem('complaints', JSON.stringify(updatedAllComplaints));
    
    toast({
      title: "Status Updated",
      description: `Complaint ${complaintId} status changed to ${newStatus}`,
    });
  };

  const handleSendMessage = (complaintId: string) => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      // Update local state
      const updatedComplaints = complaints.map(complaint =>
        complaint.id === complaintId
          ? {
              ...complaint,
              messages: [
                ...complaint.messages,
                { sender: currentUser.name, message: newMessage, time: currentTime }
              ]
            }
          : complaint
      );
      setComplaints(updatedComplaints);

      // Update localStorage
      const allComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      const updatedAllComplaints = allComplaints.map((complaint: Complaint) =>
        complaint.id === complaintId
          ? {
              ...complaint,
              messages: [
                ...complaint.messages,
                { sender: currentUser.name, message: newMessage, time: currentTime }
              ]
            }
          : complaint
      );
      localStorage.setItem('complaints', JSON.stringify(updatedAllComplaints));

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the customer",
      });

      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Assigned Complaints</h1>
      
      {complaints.length === 0 ? (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No complaints assigned yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="bg-white shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">#{complaint.id} - {complaint.customerName}</CardTitle>
                  <Badge className={
                    complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {complaint.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Title:</strong> {complaint.title}</p>
                    <p><strong>Category:</strong> {complaint.category}</p>
                    <p><strong>Priority:</strong> {complaint.priority}</p>
                  </div>
                  <div>
                    <p><strong>Email:</strong> {complaint.customerEmail}</p>
                    <p><strong>Created:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                    <p><strong>Description:</strong> {complaint.description}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Select onValueChange={(value) => handleStatusChange(complaint.id, value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message Box */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Customer Communication</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto mb-4">
                    {complaint.messages.map((msg, index) => (
                      <div key={index} className="text-sm">
                        <div className={`p-2 rounded ${msg.sender === currentUser.name ? 'bg-blue-100 ml-4' : 'bg-white'}`}>
                          <div className="font-medium">{msg.sender}: {msg.message}</div>
                          <div className="text-gray-500 text-xs mt-1">{msg.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your response..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(complaint.id)}
                    />
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleSendMessage(complaint.id)}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
