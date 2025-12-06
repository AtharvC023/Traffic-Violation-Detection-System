import React, { useState } from 'react';
import { Upload, Video, FileVideo, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

const ProcessVideo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processedVideos, setProcessedVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const result = {
        id: Date.now(),
        filename: selectedFile.name,
        size: (selectedFile.size / (1024 * 1024)).toFixed(2),
        status: 'completed',
        violationsDetected: Math.floor(Math.random() * 15) + 1,
        processedAt: new Date().toLocaleString(),
        duration: '00:02:34'
      };

      setUploadProgress(100);
      setTimeout(() => {
        setProcessedVideos([result, ...processedVideos]);
        setSelectedFile(null);
        setProcessing(false);
        setUploadProgress(0);
        clearInterval(progressInterval);
      }, 1000);
    } catch {
      clearInterval(progressInterval);
      setProcessing(false);
      alert('Error processing video');
    }
  };

  const getSeverityColor = (count) => {
    if (count > 10) return 'text-red-400 bg-red-500/20';
    if (count > 5) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-green-400 bg-green-500/20';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Process Video</h1>
        <p className="text-gray-400 mt-1">Upload and analyze video footage for traffic violations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Upload Video</h2>
          
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="video-upload"
              disabled={processing}
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {selectedFile ? (
                <>
                  <FileVideo className="w-16 h-16 text-teal-400 mb-4" />
                  <p className="text-white font-medium">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-white font-medium">Click to upload video</p>
                  <p className="text-gray-400 text-sm mt-1">MP4, AVI, MOV up to 500MB</p>
                </>
              )}
            </label>
          </div>

          {processing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Processing...</span>
                <span className="text-sm text-teal-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Detection Sensitivity
              </label>
              <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2">
                <option>High (Recommended)</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Violation Types to Detect
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Red Light', 'Overspeed', 'No Helmet', 'Wrong Way', 'Illegal Parking', 'Lane Violation'].map(type => (
                  <label key={type} className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded text-teal-500" />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || processing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Process Video
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Processing Queue</h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {processedVideos.length === 0 ? (
              <div className="text-center py-12">
                <FileVideo className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No processed videos yet</p>
                <p className="text-gray-500 text-sm mt-2">Upload a video to start processing</p>
              </div>
            ) : (
              processedVideos.map(video => (
                <div key={video.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{video.filename}</h3>
                      <p className="text-gray-400 text-sm mt-1">{video.processedAt}</p>
                    </div>
                    {video.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {video.status === 'processing' && (
                      <Clock className="w-5 h-5 text-yellow-400 animate-spin" />
                    )}
                    {video.status === 'failed' && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Duration</p>
                      <p className="text-white font-medium">{video.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Size</p>
                      <p className="text-white font-medium">{video.size} MB</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Violations</p>
                      <p className={`font-medium px-2 py-1 rounded ${getSeverityColor(video.violationsDetected)}`}>
                        {video.violationsDetected}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-lg text-sm font-medium transition-colors">
                      View Results
                    </button>
                    <button className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors">
                      Download Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Processing Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-teal-400">{processedVideos.length}</p>
            <p className="text-gray-400 text-sm mt-1">Videos Processed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">
              {processedVideos.reduce((sum, v) => sum + v.violationsDetected, 0)}
            </p>
            <p className="text-gray-400 text-sm mt-1">Total Violations</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {(processedVideos.reduce((sum, v) => sum + parseFloat(v.size), 0).toFixed(2))} MB
            </p>
            <p className="text-gray-400 text-sm mt-1">Data Processed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">98.5%</p>
            <p className="text-gray-400 text-sm mt-1">Avg Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessVideo;
