import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  FileText,
  MapPin,
  Clock,
  X,
  Play
} from 'lucide-react';
import { api } from '../services/api';

// Keep these for dropdown options as they are static config
const violationTypes = [
  "Red Light",
  "Speeding",
  "Illegal Turn",
  "Wrong Way",
  "No Helmet",
  "Zebra Crossing"
];

const severityLevels = ["Critical", "High", "Medium", "Low"];
const statusOptions = ["Open", "Under Review", "Closed"];

const Violations = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    status: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const data = await api.getViolations();
        // Map backend data to frontend format
        const formattedData = data.map(v => ({
          id: v.id,
          time: v.timestamp,
          camera: v.camera_id,
          location: v.location,
          type: v.violation_type,
          severity: v.severity,
          status: v.status,
          plateNumber: v.plate_number,
          description: v.description,
          evidence: v.evidence_url
        }));
        setViolations(formattedData);
      } catch (error) {
        console.error("Failed to fetch violations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-medium';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'status-open';
      case 'under review': return 'status-review';
      case 'closed': return 'status-closed';
      default: return 'status-open';
    }
  };

  const formatDateTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch {
      return { date: timeString, time: '' };
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredViolations = violations.filter(violation => {
    const matchesType = !filters.type || violation.type === filters.type;
    const matchesSeverity = !filters.severity || violation.severity === filters.severity;
    const matchesStatus = !filters.status || violation.status === filters.status;

    const searchLower = filters.search.toLowerCase();
    const matchesSearch = !filters.search ||
      (violation.plateNumber && violation.plateNumber.toLowerCase().includes(searchLower)) ||
      (violation.location && violation.location.toLowerCase().includes(searchLower)) ||
      (violation.camera && violation.camera.toLowerCase().includes(searchLower)) ||
      (violation.id && violation.id.toLowerCase().includes(searchLower));

    let matchesDate = true;
    if (filters.dateFrom) {
      const violationDate = new Date(violation.time);
      const fromDate = new Date(filters.dateFrom);
      matchesDate = matchesDate && violationDate >= fromDate;
    }
    if (filters.dateTo) {
      const violationDate = new Date(violation.time);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && violationDate <= toDate;
    }

    return matchesType && matchesSeverity && matchesStatus && matchesSearch && matchesDate;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Traffic Violations</h1>
          <p className="text-gray-400 mt-1">Manage and review traffic violation records</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="btn-primary">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Violation Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="">All Types</option>
              {violationTypes.map(type => (
                <option key={type} value={type} className="bg-slate-800">{type}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="">All Severities</option>
              {severityLevels.map(severity => (
                <option key={severity} value={severity} className="bg-slate-800">{severity}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status} className="bg-slate-800">{status}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Plate, camera, location..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Violations Table */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Violations ({filteredViolations.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Violation ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Camera
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Severity
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredViolations.map((violation) => {
                const dateTime = formatDateTime(violation.time);
                return (
                  <tr key={violation.id} className="table-row">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{violation.id}</div>
                        <div className="text-xs text-gray-400">{violation.plateNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{dateTime.time}</div>
                      <div className="text-xs text-gray-400">{dateTime.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white">{violation.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">{violation.camera}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{violation.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getSeverityClass(violation.severity)}>
                        {violation.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusClass(violation.status)}>
                        {violation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedViolation(violation)}
                          className="p-1 hover:bg-white/10 rounded text-primary-400 hover:text-primary-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded text-green-400 hover:text-green-300">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Violation Details Panel */}
      {selectedViolation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Violation Details</h3>
                <button
                  onClick={() => setSelectedViolation(null)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Evidence Preview */}
              <div>
                <h4 className="text-lg font-medium text-white mb-3">Evidence</h4>
                <div className="bg-slate-800 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">Evidence Preview</p>
                    <p className="text-sm text-gray-500">{selectedViolation.evidence}</p>
                  </div>
                </div>
              </div>

              {/* Violation Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Violation Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">ID:</span>
                      <p className="text-white font-medium">{selectedViolation.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Vehicle Plate:</span>
                      <p className="text-white font-medium">{selectedViolation.plateNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Type:</span>
                      <p className="text-white font-medium">{selectedViolation.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Severity:</span>
                      <span className={getSeverityClass(selectedViolation.severity)}>
                        {selectedViolation.severity}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Status:</span>
                      <span className={getStatusClass(selectedViolation.status)}>
                        {selectedViolation.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Location & Time</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Time:</span>
                      <p className="text-white font-medium">{formatDateTime(selectedViolation.time).time}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Date:</span>
                      <p className="text-white font-medium">{formatDateTime(selectedViolation.time).date}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Location:</span>
                      <p className="text-white font-medium">{selectedViolation.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Camera:</span>
                      <p className="text-white font-medium">{selectedViolation.camera}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-medium text-white mb-3">Description</h4>
                <p className="text-gray-300 bg-white/5 rounded-lg p-4">
                  {selectedViolation.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-white/10">
                <button className="btn-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Download Evidence
                </button>
                <button className="btn-secondary">
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </button>
                <button className="btn-secondary">
                  Change Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Violations;