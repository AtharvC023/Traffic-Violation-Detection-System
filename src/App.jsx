import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Violations from './pages/Violations';
import Analytics from './pages/Analytics';
import Cameras from './pages/Cameras';
import { api } from './services/api';

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [backendConnected, setBackendConnected] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test backend connection and check authentication on app load
    const initializeApp = async () => {
      const isConnected = await api.testConnection();
      setBackendConnected(isConnected);

      // Check if user is already logged in
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Verify token is still valid by getting current user
          const currentUser = await api.getCurrentUser();
          setIsAuthenticated(true);
          setUser(currentUser);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('token_type');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    initializeApp();
  }, []);

  const handleNavigate = (path) => {
    setCurrentPath(path);
    // In a real app, you'd use React Router's navigate here
    // For this demo, we'll just update the state
  };

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPath('/');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/violations':
        return <Violations />;
      case '/cameras':
        return <Cameras />;
      case '/analytics':
        return <Analytics />;
      case '/live':
        return (
          <div className="p-6">
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Live Detection</h2>
              <p className="text-gray-400">Live detection interface will be implemented here.</p>
            </div>
          </div>
        );
      case '/video':
        return (
          <div className="p-6">
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Process Video</h2>
              <p className="text-gray-400">Video processing interface will be implemented here.</p>
            </div>
          </div>
        );
      case '/images':
        return (
          <div className="p-6">
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Process Images</h2>
              <p className="text-gray-400">Image processing interface will be implemented here.</p>
            </div>
          </div>
        );
      case '/archive':
        return (
          <div className="p-6">
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Archive</h2>
              <p className="text-gray-400">Archive management interface will be implemented here.</p>
            </div>
          </div>
        );
      case '/settings':
        return (
          <div className="p-6">
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <p className="text-gray-400">System settings interface will be implemented here.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />

      <div className="ml-64">
        <TopNavbar user={user} onLogout={handleLogout} />
        
        {/* Backend Connection Status */}
        {backendConnected !== null && (
          <div className={`px-6 py-2 text-sm ${
            backendConnected 
              ? 'bg-green-500/20 text-green-400 border-green-400/30' 
              : 'bg-red-500/20 text-red-400 border-red-400/30'
          } border-l-4 mb-4 mx-6`}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                backendConnected ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span>
                Backend API: {backendConnected ? '✅ Connected' : '❌ Disconnected'} 
                {backendConnected && ' - http://localhost:8000'}
              </span>
            </div>
          </div>
        )}

        <main className="min-h-screen">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
