
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import AgentDashboard from '@/components/Dashboard/AgentDashboard';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import AdminUserManagement from '@/components/Dashboard/AdminUserManagement';
import ComplaintForm from '@/components/Complaints/ComplaintForm';
import CustomerStatusPage from '@/components/Dashboard/CustomerStatusPage';

interface User {
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeItem, setActiveItem] = useState(
    user.role === 'agent' ? 'assigned' : 
    user.role === 'admin' ? 'all-complaints' : 'complaints'
  );

  const renderContent = () => {
    // Agent role content
    if (user.role === 'agent') {
      return <AgentDashboard currentUser={user} />;
    }

    // Admin role content
    if (user.role === 'admin') {
      switch (activeItem) {
        case 'all-complaints':
          return <AdminDashboard />;
        case 'users':
          return <AdminUserManagement />;
        default:
          return <AdminDashboard />;
      }
    }

    // Customer role content (default)
    switch (activeItem) {
      case 'submit':
        return <ComplaintForm currentUser={user} />;
      case 'complaints':
        return <CustomerStatusPage currentUser={user} />;
      default:
        return <CustomerStatusPage currentUser={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar 
          userRole={user.role} 
          activeItem={activeItem} 
          onItemClick={setActiveItem} 
        />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
