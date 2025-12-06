import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, MapPin, Car, AlertTriangle, FileText, Eye } from 'lucide-react';

const Archive = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');

  const archivedViolations = [
    {
      id: 'V2024-001',
      plateNumber: 'ABC-1234',
      violationType: 'Red Light',
      location: 'Main St & 5th Ave',
      date: '2024-01-15',
      time: '14:30',
      status: 'Resolved',
      fine: 150,
      officer: 'Officer Smith'
    },
    {
      id: 'V2024-002',
      plateNumber: 'XYZ-9876',
      violationType: 'Overspeed',
      location: 'Highway 101',
      date: '2024-01-18',
      time: '09:15',
      status: 'Paid',
      fine: 200,
      officer: 'Officer Johnson'
    },
    {
      id: 'V2024-003',
      plateNumber: 'LMN-5555',
      violationType: 'No Helmet',
      location: 'Park Avenue',
      date: '2024-01-20',
      time: '16:45',
      status: 'Dismissed',
      fine: 0,
      officer: 'Officer Davis'
    },
    {
      id: 'V2024-004',
      plateNumber: 'QRS-7890',
      violationType: 'Wrong Side',
      location: 'Market Street',
      date: '2024-01-22',
      time: '11:20',
      status: 'Resolved',
      fine: 100,
      officer: 'Officer Martinez'
    },
    {
      id: 'V2024-005',
      plateNumber: 'DEF-3456',
      violationType: 'Parking Violation',
      location: 'City Center',
      date: '2024-01-25',
      time: '08:00',
      status: 'Paid',
      fine: 50,
      officer: 'Officer Wilson'
    }
  ];

  const filteredViolations = archivedViolations.filter(violation => {
    const matchesSearch = 
      violation.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || violation.violationType === selectedType;
    const matchesStatus = selectedStatus === 'all' || violation.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: archivedViolations.length,
    resolved: archivedViolations.filter(v => v.status === 'Resolved').length,
    paid: archivedViolations.filter(v => v.status === 'Paid').length,
    dismissed: archivedViolations.filter(v => v.status === 'Dismissed').length,
    totalFines: archivedViolations.reduce((sum, v) => sum + v.fine, 0)
  };

  const handleExport = () => {
    console.log('Exporting archive data...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'text-green-400';
      case 'Paid': return 'text-blue-400';
      case 'Dismissed': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Violation Archive</h1>
          <p className="text-gray-400 mt-1">Historical records and resolved violations</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Archive
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Records</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.resolved}</p>
              <p className="text-sm text-gray-400">Resolved</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Car className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.paid}</p>
              <p className="text-sm text-gray-400">Paid</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.dismissed}</p>
              <p className="text-sm text-gray-400">Dismissed</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Download className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${stats.totalFines}</p>
              <p className="text-sm text-gray-400">Total Fines</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by plate, location, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Types</option>
            <option value="Red Light">Red Light</option>
            <option value="Overspeed">Overspeed</option>
            <option value="No Helmet">No Helmet</option>
            <option value="Wrong Side">Wrong Side</option>
            <option value="Parking Violation">Parking</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="Resolved">Resolved</option>
            <option value="Paid">Paid</option>
            <option value="Dismissed">Dismissed</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="this-year">This Year</option>
            <option value="all-time">All Time</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Plate Number</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Violation</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Location</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date & Time</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Fine</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Officer</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map((violation) => (
                <tr key={violation.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{violation.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-medium">{violation.plateNumber}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-sm">
                      {violation.violationType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{violation.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{violation.date} {violation.time}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${getStatusColor(violation.status)}`}>
                      {violation.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white font-medium">
                      {violation.fine > 0 ? `$${violation.fine}` : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{violation.officer}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-teal-400">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-blue-400">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredViolations.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No archived violations found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;
