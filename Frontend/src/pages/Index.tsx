import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Bell, Users, CheckCircle, Clock } from 'lucide-react';
import LoginForm from '@/components/Auth/LoginForm';
import SignUpForm from '@/components/Auth/SignUpForm';
import Dashboard from './Dashboard';
import { useToast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
}

interface UserAccount {
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: 'customer' | 'agent' | 'admin';
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { toast } = useToast();

  // Load user accounts from localStorage
  const getUserAccounts = (): UserAccount[] => {
    const accounts = localStorage.getItem('userAccounts');
    return accounts ? JSON.parse(accounts) : [];
  };

  // Save user accounts to localStorage
  const saveUserAccounts = (accounts: UserAccount[]) => {
    localStorage.setItem('userAccounts', JSON.stringify(accounts));
  };

  const handleLogin = (loginData: { email: string; password: string; role: 'customer' | 'agent' | 'admin' }) => {
    const accounts = getUserAccounts();
    const account = accounts.find(acc => 
      acc.email === loginData.email && 
      acc.role === loginData.role
    );

    if (!account) {
      toast({
        title: "Account Not Found",
        description: "No account exists with these credentials. Please sign up first.",
        variant: "destructive"
      });
      return;
    }

    if (account.password !== loginData.password) {
      toast({
        title: "Invalid Password",
        description: "The password you entered is incorrect.",
        variant: "destructive"
      });
      return;
    }

    setUser({
      name: account.name,
      email: account.email,
      role: account.role
    });
    setShowLogin(false);
    toast({
      title: "Login Successful",
      description: `Welcome back, ${account.name}!`,
    });
  };

  const handleSignUp = (userData: { name: string; email: string; password: string; mobile: string; role: 'customer' | 'agent' | 'admin' }) => {
    const accounts = getUserAccounts();
    
    // Check if account already exists
    const existingAccount = accounts.find(acc => acc.email === userData.email);
    if (existingAccount) {
      toast({
        title: "Account Already Exists",
        description: "An account with this email already exists. Please login instead.",
        variant: "destructive"
      });
      return;
    }

    // Save new account
    const newAccount: UserAccount = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      mobile: userData.mobile,
      role: userData.role
    };

    accounts.push(newAccount);
    saveUserAccounts(accounts);

    toast({
      title: "Registration Successful",
      description: "Your account has been created. Please login to continue.",
    });
    
    setShowSignUp(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  if (showSignUp) {
    return (
      <SignUpForm 
        onSignUp={handleSignUp} 
        onSwitchToLogin={() => {
          setShowSignUp(false);
          setShowLogin(true);
        }} 
      />
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <LoginForm 
          onLogin={handleLogin} 
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ResolveNow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setShowLogin(true)}>
                Login
              </Button>
              <Button onClick={() => setShowSignUp(true)}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Platform for
            <span className="text-blue-600"> Online Complaints</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline complaint management with our comprehensive platform. Submit, track, 
            and resolve issues efficiently while maintaining transparency and excellent customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowSignUp(true)} className="px-8">
              Submit a Complaint
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowLogin(true)}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ResolveNow?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything you need for efficient complaint management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Easy Submission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Submit complaints quickly with our intuitive form. Attach documents, 
                  images, and provide detailed descriptions effortlessly.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track your complaint status in real-time. Get instant notifications 
                  when there are updates or resolution progress.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Agent Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Communicate directly with assigned agents through our built-in 
                  messaging system for quick resolution.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Secure & Confidential</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your data is protected with enterprise-grade security. We ensure 
                  complete confidentiality of your complaint information.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Bell className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Smart Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive email and SMS notifications for important updates. 
                  Stay informed throughout the resolution process.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Efficient Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our intelligent routing system ensures your complaint reaches 
                  the right department for fastest possible resolution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ResolveNow for their complaint management needs.
          </p>
          <Button size="lg" variant="secondary" onClick={() =>setShowSignUp(true)}>
            Start Your Complaint Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ResolveNow</h3>
              <p className="text-gray-400">
                Making complaint resolution simple, transparent, and efficient.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Complaint Submission</li>
                <li>Real-time Tracking</li>
                <li>Agent Communication</li>
                <li>Analytics & Reports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>News</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ResolveNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
