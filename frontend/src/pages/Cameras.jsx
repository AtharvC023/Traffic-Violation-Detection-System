import React, { useState, useEffect } from 'react';
import {
    Camera,
    Plus,
    MapPin,
    Activity,
    Trash2,
    Edit2,
    Save,
    X,
    Search
} from 'lucide-react';
import { api } from '../services/api';

const Cameras = () => {
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCamera, setEditingCamera] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        location: '',
        status: 'Active',
        resolution: '1920x1080'
    });

    const fetchCameras = async () => {
        try {
            const data = await api.getCameras();
            setCameras(data);
        } catch (error) {
            console.error("Failed to fetch cameras:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCameras();
    }, []);

    const handleOpenModal = (camera = null) => {
        if (camera) {
            setEditingCamera(camera);
            setFormData({
                id: camera.id,
                location: camera.location,
                status: camera.status,
                resolution: camera.resolution
            });
        } else {
            setEditingCamera(null);
            setFormData({
                id: '',
                location: '',
                status: 'Active',
                resolution: '1920x1080'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCamera) {
                await api.updateCamera(editingCamera.id, formData);
            } else {
                await api.addCamera(formData);
            }
            setIsModalOpen(false);
            fetchCameras();
        } catch (error) {
            console.error("Failed to save camera:", error);
            alert("Failed to save camera. Please check if ID is unique.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this camera?")) {
            try {
                await api.deleteCamera(id);
                fetchCameras();
            } catch (error) {
                console.error("Failed to delete camera:", error);
            }
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">Camera Management</h1>
                    <p className="text-gray-400 mt-1">Manage surveillance cameras and their locations</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Camera
                </button>
            </div>

            {/* Camera Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cameras.map((camera) => (
                    <div key={camera.id} className="glass-card p-6 group hover:bg-white/5 transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-primary-500/20 rounded-lg text-primary-400">
                                <Camera className="w-6 h-6" />
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenModal(camera)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(camera.id)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-1">{camera.id}</h3>

                        <div className="space-y-3 mt-4">
                            <div className="flex items-center text-gray-400 text-sm">
                                <MapPin className="w-4 h-4 mr-2" />
                                {camera.location}
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                <Activity className="w-4 h-4 mr-2" />
                                <span className={camera.status === 'Active' ? 'text-green-400' : 'text-red-400'}>
                                    {camera.status}
                                </span>
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                <div className="w-4 h-4 mr-2 flex items-center justify-center text-xs font-bold border border-gray-600 rounded">HD</div>
                                {camera.resolution}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card Placeholder */}
                <button
                    onClick={() => handleOpenModal()}
                    className="glass-card p-6 flex flex-col items-center justify-center border-dashed border-2 border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-200 min-h-[200px]"
                >
                    <div className="p-4 bg-white/5 rounded-full mb-4">
                        <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-gray-400 font-medium">Add New Camera</span>
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card max-w-md w-full">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-white">
                                {editingCamera ? 'Edit Camera' : 'Add New Camera'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Camera ID</label>
                                <input
                                    type="text"
                                    required
                                    disabled={!!editingCamera}
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 disabled:opacity-50"
                                    placeholder="e.g., CAM-001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                    placeholder="e.g., Main St Intersection"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                >
                                    <option value="Active" className="bg-slate-800">Active</option>
                                    <option value="Inactive" className="bg-slate-800">Inactive</option>
                                    <option value="Maintenance" className="bg-slate-800">Maintenance</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Resolution</label>
                                <select
                                    value={formData.resolution}
                                    onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                >
                                    <option value="1920x1080" className="bg-slate-800">1080p (FHD)</option>
                                    <option value="3840x2160" className="bg-slate-800">4K (UHD)</option>
                                    <option value="1280x720" className="bg-slate-800">720p (HD)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 btn-secondary justify-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary justify-center"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Camera
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cameras;
