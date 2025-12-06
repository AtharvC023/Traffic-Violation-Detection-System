import React, { useState } from 'react';
import { Save, User, Bell, Shield, Database, Palette, Globe } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Database },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'regional', name: 'Regional', icon: Globe }
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="lg:col-span-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="john.doe@example.com"
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+1 234 567 8900"
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
                    <input
                      type="text"
                      defaultValue="Traffic Management"
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Badge Number</label>
                  <input
                    type="text"
                    defaultValue="TM-1234"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">New Violations</h3>
                    <p className="text-gray-400 text-sm">Get notified when new violations are detected</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">System Alerts</h3>
                    <p className="text-gray-400 text-sm">Receive alerts about system status changes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Camera Status</h3>
                    <p className="text-gray-400 text-sm">Get notified when cameras go offline</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Daily Reports</h3>
                    <p className="text-gray-400 text-sm">Receive daily summary reports via email</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-teal-500" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Security Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="border-t border-slate-700 pt-4 mt-6">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                      <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">System Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Detection Sensitivity</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2">
                    <option>High (Recommended)</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Auto-Save Interval</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2">
                    <option>Every 5 minutes</option>
                    <option>Every 10 minutes</option>
                    <option>Every 30 minutes</option>
                    <option>Manual only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Data Retention Period</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2">
                    <option>30 days</option>
                    <option>60 days</option>
                    <option>90 days</option>
                    <option>1 year</option>
                    <option>Unlimited</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Appearance Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-900 border-2 border-teal-500 rounded-lg cursor-pointer">
                      <p className="text-white font-medium text-center">Dark</p>
                    </div>
                    <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg cursor-pointer">
                      <p className="text-gray-400 font-medium text-center">Light</p>
                    </div>
                    <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg cursor-pointer">
                      <p className="text-gray-400 font-medium text-center">Auto</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Accent Color</label>
                  <div className="grid grid-cols-6 gap-3">
                    {['teal', 'blue', 'purple', 'pink', 'green', 'orange'].map(color => (
                      <div
                        key={color}
                        className={`w-12 h-12 rounded-lg cursor-pointer border-2 ${
                          color === 'teal' ? 'border-white' : 'border-transparent'
                        } bg-${color}-500`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'regional' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Regional Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Time Zone</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2">
                    <option>UTC-08:00 (Pacific Time)</option>
                    <option>UTC-05:00 (Eastern Time)</option>
                    <option>UTC+00:00 (UTC)</option>
                    <option>UTC+05:30 (India Standard Time)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date Format</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Time Format</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2">
                    <option>12-hour</option>
                    <option>24-hour</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
