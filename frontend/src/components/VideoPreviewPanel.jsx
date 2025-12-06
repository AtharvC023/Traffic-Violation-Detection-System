import React from 'react';
import { Play, Pause, Maximize, Volume2 } from 'lucide-react';

const VideoPreviewPanel = () => {
  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Camera Feed</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative bg-slate-800 rounded-lg overflow-hidden aspect-video mb-4">
        {/* Placeholder for video */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Play className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400 text-sm">Camera: North Intersection</p>
            <p className="text-gray-500 text-xs">Main St & 5th Ave</p>
          </div>
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Play className="w-4 h-4 text-white" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Volume2 className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <Maximize className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Camera Info */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Resolution:</span>
          <span className="text-white">1920x1080</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">FPS:</span>
          <span className="text-white">30</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Status:</span>
          <span className="text-green-400">Active</span>
        </div>
        
        {/* Quick Actions */}
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-sm font-medium text-white mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-secondary text-xs py-2">Take Snapshot</button>
            <button className="btn-secondary text-xs py-2">Start Recording</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewPanel;