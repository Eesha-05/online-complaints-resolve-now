
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface UserAccount {
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
}

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [agents, setAgents] = useState<UserAccount[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load complaints from localStorage
    const savedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints(savedComplaints);

    // Load agents from user accounts
    const userAccounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
    const agentUsers = userAccounts.filter((user: UserAccount) => user.role === 'agent');
    setAgents(agentUsers);
  }, []);

  const handleAssignComplaint = (complaintId: string, agentName: string) => {
    // Update local state
    const updatedComplaints = complaints.map(complaint =>
      complaint.id === complaintId
        ? { ...complaint, assignedAgent: agentName, status: 'in-progress' as any }
        : complaint
    );
    setComplaints(updatedComplaints);

    // Update localStorage
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));

    toast({
      title: "Complaint Assigned",
      description: `Complaint ${complaintId} has been assigned to ${agentName}`,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Complaints</h1>

      {complaints.length === 0 ? (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No complaints submitted yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="bg-gray-50">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">#{complaint.id}</h3>
                  <Badge className={
                    complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    complaint.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {complaint.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p><strong>Customer:</strong> {complaint.customerName}</p>
                  <p><strong>Email:</strong> {complaint.customerEmail}</p>
                  <p><strong>Title:</strong> {complaint.title}</p>
                  <p><strong>Category:</strong> {complaint.category}</p>
                  <p><strong>Priority:</strong> {complaint.priority}</p>
                  <p><strong>Created:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                  <p><strong>Description:</strong> {complaint.description}</p>
                  {complaint.assignedAgent && (
                    <p><strong>Assigned to:</strong> {complaint.assignedAgent}</p>
                  )}
                </div>
                
                {!complaint.assignedAgent && agents.length > 0 && (
                  <div className="pt-2">
                    <Select onValueChange={(value) => handleAssignComplaint(complaint.id, value)}>
                      <SelectTrigger className="w-full bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                        <SelectValue placeholder="Assign to Agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map((agent) => (
                          <SelectItem key={agent.email} value={agent.name}>
                            {agent.name} ({agent.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {!complaint.assignedAgent && agents.length === 0 && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-500">No agents available for assignment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
