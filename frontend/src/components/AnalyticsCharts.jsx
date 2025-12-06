import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-white/20 rounded-lg p-3 shadow-xl">
        <p className="text-white text-sm font-medium">{`${label}`}</p>
        <p className="text-primary-400 text-sm">
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

const ViolationsByDayChart = ({ data = [] }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Violations by Day</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="violations" 
            fill="url(#violationsGradient)" 
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="violationsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ViolationsByTypeChart = ({ data = [] }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Violations by Type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-300">{item.name}</span>
            <span className="text-sm text-gray-400">({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ViolationsByLocationChart = ({ data = [] }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Violations by Location</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number" 
            stroke="#9CA3AF" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            dataKey="location" 
            type="category" 
            stroke="#9CA3AF" 
            fontSize={12}
            tickLine={false}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="violations" 
            fill="url(#locationGradient)" 
            radius={[0, 4, 4, 0]}
          />
          <defs>
            <linearGradient id="locationGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ViolationsOverTimeChart = ({ data = [] }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Violations Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="violations" 
            stroke="#10b981" 
            fill="url(#timeGradient)" 
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const AnalyticsCharts = {
  ViolationsByDayChart,
  ViolationsByTypeChart,
  ViolationsByLocationChart,
  ViolationsOverTimeChart
};

export default AnalyticsCharts;