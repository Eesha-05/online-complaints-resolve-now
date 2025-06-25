
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

interface CustomerStatusPageProps {
  currentUser: {
    name: string;
    email: string;
    role: string;
  };
}

const CustomerStatusPage = ({ currentUser }: CustomerStatusPageProps) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load complaints from localStorage and filter by current user
    const savedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const userComplaints = savedComplaints.filter((complaint: Complaint) => 
      complaint.customerEmail === currentUser.email
    );
    setComplaints(userComplaints);
    if (userComplaints.length > 0) {
      setSelectedComplaint(userComplaints[0]);
    }
  }, [currentUser.email]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedComplaint) {
      const currentTime = new Date().toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const updatedComplaints = complaints.map(complaint =>
        complaint.id === selectedComplaint.id
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
      setSelectedComplaint({
        ...selectedComplaint,
        messages: [
          ...selectedComplaint.messages,
          { sender: currentUser.name, message: newMessage, time: currentTime }
        ]
      });

      // Update localStorage
      const allComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      const updatedAllComplaints = allComplaints.map((complaint: Complaint) =>
        complaint.id === selectedComplaint.id
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
        description: "Your message has been sent to the assigned agent",
      });

      setNewMessage('');
    }
  };

  if (complaints.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No complaints submitted yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints List */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>All Complaints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {complaints.map((complaint) => (
                <button
                  key={complaint.id}
                  onClick={() => setSelectedComplaint(complaint)}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    selectedComplaint?.id === complaint.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{complaint.title}</p>
                      <p className="text-xs text-gray-500">#{complaint.id}</p>
                    </div>
                    <Badge className={
                      complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {complaint.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Selected Complaint Details */}
        {selectedComplaint && (
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Details */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Complaint #{selectedComplaint.id}</span>
                  <Badge className={
                    selectedComplaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedComplaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {selectedComplaint.status.replace('-', ' ')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p><strong>Title:</strong> {selectedComplaint.title}</p>
                  <p><strong>Category:</strong> {selectedComplaint.category}</p>
                  <p><strong>Priority:</strong> {selectedComplaint.priority}</p>
                  <p><strong>Description:</strong> {selectedComplaint.description}</p>
                  <p><strong>Created:</strong> {new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                  {selectedComplaint.assignedAgent && (
                    <p><strong>Assigned Agent:</strong> {selectedComplaint.assignedAgent}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Communication Panel */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Communication with Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="max-h-80 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
                    {selectedComplaint.messages.map((msg, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        msg.sender === currentUser.name 
                          ? 'bg-blue-100 ml-6' 
                          : 'bg-white mr-6 border'
                      }`}>
                        <div className="font-medium text-sm mb-1">{msg.sender}</div>
                        <div className="text-sm">{msg.message}</div>
                        <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleSendMessage}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerStatusPage;
