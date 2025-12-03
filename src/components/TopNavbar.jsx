import React from 'react';
import { Search, Bell, User, Calendar, Clock } from 'lucide-react';

const TopNavbar = () => {
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const timeString = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="glass-card h-16 flex items-center justify-between px-6 ml-64 m-4 mb-0">
      {/* Left side - Title and Date/Time */}
      <div className="flex items-center space-x-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Traffic Violation Detection System</h2>
        </div>
        
        <div className="hidden md:flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{dateString}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{timeString}</span>
          </div>
        </div>
      </div>

      {/* Right side - Search, Notifications, Profile */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search violations, cameras..."
            className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 w-64"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-300" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </div>
        </button>

        {/* Profile Avatar */}
        <button className="flex items-center space-x-3 hover:bg-white/10 rounded-lg p-2 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-purple rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-white">Admin User</div>
            <div className="text-xs text-gray-400">System Administrator</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;