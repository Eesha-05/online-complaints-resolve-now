
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import ComplaintCard from '../Complaints/ComplaintCard';

const CustomerDashboard = () => {
  // Mock data - in real app this would come from API
  const [complaints] = useState([
    {
      id: '1',
      title: 'Defective Product Received',
      description: 'The product I ordered arrived with a manufacturing defect. The screen has dead pixels and the device does not turn on properly.',
      status: 'in-progress' as const,
      priority: 'high' as const,
      category: 'Product Issue',
      createdAt: '2024-01-15',
      assignedAgent: 'Sarah Johnson'
    },
    {
      id: '2',
      title: 'Late Delivery Complaint',
      description: 'My order was supposed to arrive 3 days ago but still has not been delivered. No tracking updates provided.',
      status: 'pending' as const,
      priority: 'medium' as const,
      category: 'Delivery Issue',
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'Billing Error',
      description: 'I was charged twice for the same order. Need immediate refund for the duplicate charge.',
      status: 'resolved' as const,
      priority: 'urgent' as const,
      category: 'Billing Problem',
      createdAt: '2024-01-10'
    }
  ]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  const handleViewDetails = (id: string) => {
    console.log('View complaint details:', id);
    // Navigate to complaint details page
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onViewDetails={handleViewDetails}
                showAgent={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
