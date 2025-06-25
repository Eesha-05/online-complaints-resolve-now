
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SignUpFormProps {
  onSignUp: (userData: { name: string; email: string; password: string; mobile: string; role: 'customer' | 'agent' | 'admin' }) => void;
  onSwitchToLogin: () => void;
}

const SignUpForm = ({ onSignUp, onSwitchToLogin }: SignUpFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'customer' as 'customer' | 'agent' | 'admin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-gray-800 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">SignUp For Registering the Complaint</CardTitle>
          <p className="text-gray-300">Please enter your Details</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Full Name"
                className="bg-white text-black"
                required
              />
              <Label className="text-xs text-gray-300">Full Name</Label>
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="bg-white text-black"
                required
              />
              <Label className="text-xs text-gray-300">Email</Label>
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                className="bg-white text-black"
                required
              />
              <Label className="text-xs text-gray-300">Password</Label>
            </div>

            <div className="space-y-2">
              <Input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="Mobile No."
                className="bg-white text-black"
                required
              />
              <Label className="text-xs text-gray-300">Mobile No.</Label>
            </div>

            <div className="space-y-2">
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as any }))}>
                <SelectTrigger className="bg-blue-600 text-white border-0">
                  <SelectValue placeholder="Select User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Label className="text-xs text-gray-300">Select User Type</Label>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Sign Up
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-sm text-blue-400 hover:underline"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
