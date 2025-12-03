const API_URL = 'http://localhost:8000';

export const api = {
    async getViolations() {
        const response = await fetch(`${API_URL}/violations/`);
        if (!response.ok) {
            throw new Error('Failed to fetch violations');
        }
        return response.json();
    },

    async createViolation(violationData) {
        const response = await fetch(`${API_URL}/violations/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(violationData),
        });
        if (!response.ok) {
            throw new Error('Failed to create violation');
        }
        return response.json();
    },

    async getDashboardStats() {
        const response = await fetch(`${API_URL}/stats/dashboard`);
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }
        return response.json();
    },

    async getChartData() {
        const response = await fetch(`${API_URL}/stats/charts`);
        if (!response.ok) {
            throw new Error('Failed to fetch chart data');
        }
        return response.json();
    },

    async getAnalyticsData() {
        const response = await fetch(`${API_URL}/stats/analytics`);
        if (!response.ok) {
            throw new Error('Failed to fetch analytics data');
        }
        return response.json();
    },

    // Camera Management
    async getCameras() {
        const response = await fetch(`${API_URL}/cameras/`);
        if (!response.ok) throw new Error('Failed to fetch cameras');
        return response.json();
    },

    async addCamera(cameraData) {
        const response = await fetch(`${API_URL}/cameras/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cameraData),
        });
        if (!response.ok) throw new Error('Failed to add camera');
        return response.json();
    },

    async updateCamera(id, cameraData) {
        const response = await fetch(`${API_URL}/cameras/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cameraData),
        });
        if (!response.ok) throw new Error('Failed to update camera');
        return response.json();
    },

    async deleteCamera(id) {
        const response = await fetch(`${API_URL}/cameras/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete camera');
        return response.json();
    }
};
