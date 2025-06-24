
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserAccount {
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
}

interface Complaint {
  id: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  status: string;
}

const AdminUserManagement = () => {
  const [customerUsers, setCustomerUsers] = useState<any[]>([]);
  const [agentUsers, setAgentUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    // Load user accounts
    const userAccounts = JSON.parse(localStorage.getItem('userAccounts') || '[]');
    
    // Load complaints to get customer info
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    
    // Create customer list from complaints with user details
    const customersWithComplaints = complaints.reduce((acc: any[], complaint: Complaint) => {
      const existingCustomer = acc.find(c => c.email === complaint.customerEmail);
      if (existingCustomer) {
        existingCustomer.complaints += 1;
      } else {
        // Find user account details
        const userAccount = userAccounts.find((user: UserAccount) => 
          user.email === complaint.customerEmail
        );
        
        acc.push({
          name: complaint.customerName,
          email: complaint.customerEmail,
          phone: userAccount?.mobile || 'Not provided',
          complaints: 1,
          joinedDate: complaint.createdAt,
          status: 'Active'
        });
      }
      return acc;
    }, []);

    // Get agent users
    const agents = userAccounts.filter((user: UserAccount) => user.role === 'agent');
    
    setCustomerUsers(customersWithComplaints);
    setAgentUsers(agents);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      
      {/* Customer Users */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customers with Complaints</h2>
        {customerUsers.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No customers have submitted complaints yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customerUsers.map((user, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-blue-800">{user.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {user.complaints} complaints
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>First Complaint:</strong> {new Date(user.joinedDate).toLocaleDateString()}</p>
                    <p><strong>Total Complaints:</strong> {user.complaints}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Agent Users */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Registered Agents</h2>
        {agentUsers.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No agents have registered yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agentUsers.map((agent, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-green-800">{agent.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      Agent
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {agent.email}</p>
                    <p><strong>Role:</strong> {agent.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
