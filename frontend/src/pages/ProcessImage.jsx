import React, { useState } from 'react';
import { Upload, Image as ImageIcon, FileImage, CheckCircle, XCircle, Loader, ZoomIn } from 'lucide-react';

const ProcessImage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
    } else {
      alert('Please select valid image files');
    }
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) return;

    setProcessing(true);

    setTimeout(() => {
      const results = selectedFiles.map(file => ({
        id: Date.now() + Math.random(),
        filename: file.name,
        size: (file.size / 1024).toFixed(2),
        status: Math.random() > 0.1 ? 'detected' : 'clean',
        violationType: ['Red Light', 'Overspeed', 'No Helmet', 'Wrong Way'][Math.floor(Math.random() * 4)],
        confidence: (Math.random() * (0.99 - 0.75) + 0.75).toFixed(2),
        plateNumber: `ABC${Math.floor(Math.random() * 9000) + 1000}`,
        processedAt: new Date().toLocaleString()
      }));

      setProcessedImages([...results, ...processedImages]);
      setSelectedFiles([]);
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Process Images</h1>
        <p className="text-gray-400 mt-1">Upload and analyze images for traffic violations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Upload Images</h2>
          
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
              disabled={processing}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {selectedFiles.length > 0 ? (
                <>
                  <FileImage className="w-16 h-16 text-teal-400 mb-4" />
                  <p className="text-white font-medium">{selectedFiles.length} files selected</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {(selectedFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)} MB total
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-white font-medium">Click to upload images</p>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG up to 10MB each</p>
                  <p className="text-gray-500 text-xs mt-2">Multiple files supported</p>
                </>
              )}
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-2">
                  <span className="text-sm text-gray-300 truncate">{file.name}</span>
                  <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Analysis Mode
              </label>
              <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2">
                <option>Full Analysis</option>
                <option>License Plate Only</option>
                <option>Violation Type Only</option>
                <option>Quick Scan</option>
              </select>
            </div>

            <button
              onClick={handleProcess}
              disabled={selectedFiles.length === 0 || processing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing {selectedFiles.length} images...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Process Images
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Results</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                {processedImages.filter(img => img.status === 'detected').length} Violations
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                {processedImages.filter(img => img.status === 'clean').length} Clean
              </span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {processedImages.length === 0 ? (
              <div className="text-center py-12">
                <FileImage className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No processed images yet</p>
                <p className="text-gray-500 text-sm mt-2">Upload images to start analysis</p>
              </div>
            ) : (
              processedImages.map(image => (
                <div key={image.id} className={`rounded-lg p-4 border ${
                  image.status === 'detected'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-slate-700/50 border-slate-600/50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{image.filename}</h3>
                        {image.status === 'detected' ? (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                            Violation
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                            Clean
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{image.processedAt}</p>
                    </div>
                    {image.status === 'detected' ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  
                  {image.status === 'detected' && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Violation Type:</span>
                        <span className="text-white font-medium">{image.violationType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Plate Number:</span>
                        <span className="text-white font-medium">{image.plateNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="text-teal-400 font-medium">{(image.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors">
                      <ZoomIn className="w-4 h-4" />
                      View
                    </button>
                    {image.status === 'detected' && (
                      <button className="flex-1 px-3 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-lg text-sm font-medium transition-colors">
                        Create Report
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Batch Processing Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-teal-400">{processedImages.length}</p>
            <p className="text-gray-400 text-sm mt-1">Images Analyzed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-400">
              {processedImages.filter(img => img.status === 'detected').length}
            </p>
            <p className="text-gray-400 text-sm mt-1">Violations Found</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {processedImages.filter(img => img.status === 'clean').length}
            </p>
            <p className="text-gray-400 text-sm mt-1">Clean Images</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">
              {processedImages.length > 0
                ? ((processedImages.reduce((sum, img) => sum + parseFloat(img.confidence), 0) / processedImages.length) * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-gray-400 text-sm mt-1">Avg Confidence</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">
              {processedImages.length > 0
                ? ((processedImages.filter(img => img.status === 'detected').length / processedImages.length) * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-gray-400 text-sm mt-1">Detection Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessImage;
