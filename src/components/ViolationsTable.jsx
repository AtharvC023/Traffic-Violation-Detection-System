import React from 'react';
import { Clock, MapPin, AlertTriangle } from 'lucide-react';

const ViolationsTable = ({ violations = [], compact = false, showActions = true }) => {
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

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="glass-card">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-primary-500" />
            <span>Recent Violations</span>
          </h3>
          {!compact && (
            <button className="btn-secondary text-sm">View All</button>
          )}
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Violation
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time/Date
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Location
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
                {showActions && (
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {violations.map((violation) => (
                <tr key={violation.id} className="table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-white">{violation.id}</div>
                        <div className="text-xs text-gray-400">{violation.plateNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(violation.time)}</span>
                    </div>
                    <div className="text-xs text-gray-400">{formatDate(violation.time)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <div>
                        <div className="text-sm text-white">{violation.location}</div>
                        <div className="text-xs text-gray-400">{violation.camera}</div>
                      </div>
                    </div>
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
                  {showActions && (
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                          View
                        </button>
                        <button className="text-gray-400 hover:text-white text-sm font-medium">
                          Review
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViolationsTable;