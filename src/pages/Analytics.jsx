import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { api } from '../services/api';
import {
  TrendingUp,
  AlertTriangle,
  MapPin,
  Target,
  BarChart3,
  Clock,
  Award
} from 'lucide-react';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    topRiskLocations: [],
    violationsByLocation: []
  });
  const [chartData, setChartData] = useState({
    violationsByDay: [],
    violationsByType: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chartsResponse, analyticsResponse] = await Promise.all([
          api.getChartData(),
          api.getAnalyticsData()
        ]);
        setChartData(chartsResponse);
        setAnalyticsData(analyticsResponse);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate analytics metrics based on real data
  const totalViolationsLast7Days = chartData.violationsByDay.reduce((sum, day) => sum + day.violations, 0);

  // For critical percentage, we would ideally need a separate endpoint or more data, 
  // but we can approximate from violationsByType if we knew which were critical.
  // For now, let's use a placeholder or derived if possible. 
  // Since we don't have severity breakdown in charts yet, we might need to fetch stats/dashboard again or just omit.
  // Let's fetch dashboard stats for the summary cards.
  const [dashboardStats, setDashboardStats] = useState({
    totalViolationsToday: 0,
    criticalViolations: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await api.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Most common type
  const mostCommonType = chartData.violationsByType.length > 0
    ? chartData.violationsByType.reduce((prev, current) => (prev.value > current.value) ? prev : current).name
    : "N/A";

  // Busiest Location
  const busiestLocation = analyticsData.violationsByLocation.length > 0
    ? analyticsData.violationsByLocation.reduce((prev, current) => (prev.value > current.value) ? prev : current).name
    : "N/A";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Insights and trends for traffic violation data</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Clock className="w-4 h-4 mr-2" />
            Last 30 Days
          </button>
          <button className="btn-primary">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Violations (7 Days)"
          value={totalViolationsLast7Days}
          subtitle="violations recorded"
          icon={TrendingUp}
          trend={{ value: "Last 7 Days", isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Critical Violations"
          value={dashboardStats.criticalViolations}
          subtitle="total recorded"
          icon={AlertTriangle}
          trend={{ value: "All Time", isPositive: false }}
          color="red"
        />
        <StatCard
          title="Most Common Type"
          value={mostCommonType}
          subtitle="leading violation"
          icon={Target}
          color="orange"
        />
        <StatCard
          title="Busiest Location"
          value={busiestLocation}
          subtitle="highest activity"
          icon={MapPin}
          color="green"
        />
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Violations Over Time - Full Width */}
        <AnalyticsCharts.ViolationsOverTimeChart data={chartData.violationsByDay} />

        {/* Two Charts Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsCharts.ViolationsByLocationChart data={analyticsData.violationsByLocation} />
          <AnalyticsCharts.ViolationsByTypeChart data={chartData.violationsByType} />
        </div>
      </div>

      {/* Top Risk Locations */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-primary-500" />
              <span>Top 5 High-Risk Locations</span>
            </h3>
            <button className="btn-secondary text-sm">View All Locations</button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.topRiskLocations.map((location, index) => (
              <div key={location.name} className="flex items-center justify-between p-4 glass-card hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{location.name}</h4>
                    <p className="text-gray-400 text-sm">{location.area}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white font-medium">
                    {location.avgDailyViolations} avg/day
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Suggested: {location.suggestion}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights (Static for now as backend doesn't support this yet) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Detection Accuracy */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Detection Accuracy</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Red Light Detection</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-[95%]"></div>
                </div>
                <span className="text-green-400 text-sm font-medium">95%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Speed Detection</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-[92%]"></div>
                </div>
                <span className="text-green-400 text-sm font-medium">92%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Helmet Detection</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 w-[88%]"></div>
                </div>
                <span className="text-yellow-400 text-sm font-medium">88%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Lane Detection</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-[90%]"></div>
                </div>
                <span className="text-green-400 text-sm font-medium">90%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Performance */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Camera Performance</h3>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Online Cameras</span>
              <span className="text-green-400 font-medium">12/12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Avg Response Time</span>
              <span className="text-white font-medium">1.2s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Data Quality</span>
              <span className="text-green-400 font-medium">Excellent</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Maintenance Due</span>
              <span className="text-yellow-400 font-medium">2 cameras</span>
            </div>
          </div>
        </div>

        {/* System Efficiency */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Efficiency</h3>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">97.8%</div>
              <div className="text-gray-400 text-sm">Overall Uptime</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Processing Speed</span>
                <span className="text-green-400 font-medium">Fast</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Storage Used</span>
                <span className="text-yellow-400 font-medium">75%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">False Positives</span>
                <span className="text-green-400 font-medium">3.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;