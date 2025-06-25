
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText } from 'lucide-react';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  assignedAgent?: string;
}

interface ComplaintCardProps {
  complaint: Complaint;
  onViewDetails: (id: string) => void;
  showAgent?: boolean;
}

const ComplaintCard = ({ complaint, onViewDetails, showAgent = false }: ComplaintCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{complaint.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getStatusColor(complaint.status)}>
              {complaint.status.replace('-', ' ')}
            </Badge>
            <Badge className={getPriorityColor(complaint.priority)}>
              {complaint.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {complaint.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(complaint.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {complaint.category}
          </div>
        </div>

        {showAgent && complaint.assignedAgent && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <User className="h-4 w-4" />
            Assigned to: {complaint.assignedAgent}
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewDetails(complaint.id)}
          className="w-full"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ComplaintCard;
