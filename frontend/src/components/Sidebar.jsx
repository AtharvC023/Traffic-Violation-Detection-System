import React from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  Video, 
  Image, 
  AlertTriangle, 
  BarChart3, 
  Archive, 
  Settings,
  Shield
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/', active: true },
  { name: 'Live Detection', icon: Camera, path: '/live' },
  { name: 'Process Video', icon: Video, path: '/video' },
  { name: 'Process Images', icon: Image, path: '/images' },
  { name: 'Violations', icon: AlertTriangle, path: '/violations' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  { name: 'Archive', icon: Archive, path: '/archive' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = ({ currentPath = '/', onNavigate }) => {
  return (
    <div className="glass-sidebar w-64 h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-accent-purple p-2 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">TrafficGuard</h1>
            <p className="text-xs text-gray-400">Detection System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.name}
                onClick={() => onNavigate?.(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-purple/20 border-l-4 border-primary-500 text-primary-400' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="glass-card p-4 text-center">
          <div className="text-xs text-gray-400 mb-2">System Status</div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;