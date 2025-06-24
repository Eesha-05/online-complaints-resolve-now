
import React from 'react';
import { FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userRole: 'customer' | 'agent' | 'admin';
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar = ({ userRole, activeItem, onItemClick }: SidebarProps) => {
  const getMenuItems = () => {
    switch (userRole) {
      case 'customer':
        return [
          { id: 'complaints', label: 'My Complaints', icon: FileText },
          { id: 'submit', label: 'Submit Complaint', icon: FileText },
        ];
      case 'agent':
        return [
          { id: 'assigned', label: 'Assigned Complaints', icon: FileText },
        ];
      case 'admin':
        return [
          { id: 'all-complaints', label: 'All Complaints', icon: FileText },
          { id: 'users', label: 'Manage Users', icon: User },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-gray-50 h-full border-r">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={cn(
                  "w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  activeItem === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
