import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import VideoPreviewPanel from '../components/VideoPreviewPanel';
import ViolationsTable from '../components/ViolationsTable';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { api } from '../services/api';
import {
  AlertTriangle,
  Camera,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const [violations, setViolations] = useState([]);
  const [stats, setStats] = useState({
    totalViolationsToday: 0,
    criticalViolations: 0,
    activeCameras: 0,
    pendingActions: 0
  });
  const [chartData, setChartData] = useState({
    violationsByDay: [],
    violationsByType: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [violationsData, statsData, chartsData] = await Promise.all([
          api.getViolations(),
          api.getDashboardStats(),
          api.getChartData()
        ]);

        const formattedViolations = violationsData.map(v => ({
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

        setViolations(formattedViolations);
        setStats(statsData);
        setChartData(chartsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentViolations = violations.slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Violations Today"
          value={stats.totalViolationsToday}
          subtitle="violations recorded"
          icon={AlertTriangle}
          trend={{ value: "Today", isPositive: false }}
          color="red"
        />
        <StatCard
          title="Critical Violations"
          value={stats.criticalViolations}
          subtitle="require immediate action"
          icon={AlertTriangle}
          trend={{ value: "Total", isPositive: false }}
          color="orange"
        />
        <StatCard
          title="Active Cameras"
          value={stats.activeCameras}
          subtitle="monitoring traffic"
          icon={Camera}
          trend={{ value: "Online", isPositive: true }}
          color="green"
        />
        <StatCard
          title="Pending Actions"
          value={stats.pendingActions}
          subtitle="awaiting review"
          icon={Clock}
          trend={{ value: "To Do", isPositive: true }}
          color="purple"
        />
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Preview - Left Side */}
        <div className="lg:col-span-1">
          <VideoPreviewPanel />
        </div>

        {/* Recent Violations - Right Side */}
        <div className="lg:col-span-2">
          <ViolationsTable
            violations={recentViolations}
            compact={true}
            showActions={true}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCharts.ViolationsByDayChart data={chartData.violationsByDay} />
        <AnalyticsCharts.ViolationsByTypeChart data={chartData.violationsByType} />
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>System Health</span>
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">AI Detection</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Optimal</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Connected</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Storage</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-400 text-sm">75% Used</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Network</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Stable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <span>Quick Stats</span>
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">This Week</span>
              <span className="text-white font-medium">156 violations</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">This Month</span>
              <span className="text-white font-medium">682 violations</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Most Active Hour</span>
              <span className="text-white font-medium">8:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Top Violation</span>
              <span className="text-white font-medium">Red Light</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-white">Critical violation detected</p>
                <p className="text-xs text-gray-400">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-white">Camera CAM-North-01 online</p>
                <p className="text-xs text-gray-400">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-white">System backup completed</p>
                <p className="text-xs text-gray-400">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;