import React, { useState, useEffect, useMemo } from 'react';
import { Camera, Activity, AlertTriangle, Play, Square, Settings } from 'lucide-react';

const LiveDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [detections, setDetections] = useState([]);
  const [stats, setStats] = useState({
    activeCameras: 0,
    detectionsToday: 0,
    avgConfidence: 0
  });

  const cameras = useMemo(() => [
    { id: 'all', name: 'All Cameras' },
    { id: 'cam-001', name: 'Main Street - North' },
    { id: 'cam-002', name: 'Highway 101 - Exit 5' },
    { id: 'cam-003', name: 'Downtown Intersection' }
  ], []);

  useEffect(() => {
    if (isDetecting) {
      const interval = setInterval(() => {
        const mockDetection = {
          id: Date.now(),
          camera: cameras[Math.floor(Math.random() * (cameras.length - 1)) + 1].name,
          type: ['Red Light', 'Overspeed', 'No Helmet', 'Wrong Way'][Math.floor(Math.random() * 4)],
          confidence: (Math.random() * (0.99 - 0.75) + 0.75).toFixed(2),
          timestamp: new Date().toLocaleTimeString(),
          plate: `ABC${Math.floor(Math.random() * 9000) + 1000}`
        };
        setDetections(prev => [mockDetection, ...prev].slice(0, 10));
        setStats(prev => ({
          ...prev,
          detectionsToday: prev.detectionsToday + 1,
          avgConfidence: ((parseFloat(prev.avgConfidence) + parseFloat(mockDetection.confidence)) / 2).toFixed(2)
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isDetecting, cameras]);

  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Detection</h1>
          <p className="text-gray-400 mt-1">Real-time traffic violation detection</p>
        </div>
        <button
          onClick={toggleDetection}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            isDetecting
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-teal-500 hover:bg-teal-600 text-white'
          }`}
        >
          {isDetecting ? (
            <>
              <Square className="w-5 h-5" />
              Stop Detection
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Detection
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Cameras</p>
              <p className="text-2xl font-bold text-white mt-1">{cameras.length - 1}</p>
            </div>
            <div className="p-3 bg-teal-500/20 rounded-lg">
              <Camera className="w-6 h-6 text-teal-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Detections Today</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.detectionsToday}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Confidence</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.avgConfidence}%</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Live Feed</h2>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {cameras.map(cam => (
                <option key={cam.id} value={cam.id}>{cam.name}</option>
              ))}
            </select>
          </div>
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
            {isDetecting ? (
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-teal-400 font-medium">Detection Active</p>
                <p className="text-gray-400 text-sm mt-2">Processing video stream...</p>
              </div>
            ) : (
              <div className="relative z-10 text-center">
                <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Start detection to view live feed</p>
              </div>
            )}
            {isDetecting && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 rounded-full flex items-center gap-2 z-20">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">LIVE</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Detections</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {detections.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No detections yet</p>
            ) : (
              detections.map(detection => (
                <div key={detection.id} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-teal-400 font-medium">{detection.timestamp}</span>
                    <span className="text-xs text-gray-400">#{detection.plate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{detection.type}</p>
                      <p className="text-xs text-gray-400 mt-1">{detection.camera}</p>
                    </div>
                    <div className="text-right">
                      <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                        {(detection.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Detection Settings</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            Configure
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Confidence Threshold</label>
            <input
              type="range"
              min="50"
              max="99"
              defaultValue="75"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum: 75%</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Detection Types</label>
            <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2">
              <option>All Violations</option>
              <option>Red Light Only</option>
              <option>Speed Only</option>
              <option>Safety Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Alert Method</label>
            <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2">
              <option>Real-time Alerts</option>
              <option>Batch Processing</option>
              <option>Manual Review</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetection;
