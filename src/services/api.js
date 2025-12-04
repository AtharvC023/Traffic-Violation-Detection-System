const API_URL = 'http://localhost:8000/api/v1';

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
        const response = await fetch(`${API_URL}/analytics/dashboard`);
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }
        return response.json();
    },

    async getChartData() {
        const response = await fetch(`${API_URL}/analytics/charts`);
        if (!response.ok) {
            throw new Error('Failed to fetch chart data');
        }
        return response.json();
    },

    async getAnalyticsData() {
        const response = await fetch(`${API_URL}/analytics/summary`);
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
    },

    // Authentication
    async login(username, password) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    async getCurrentUser() {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No token found');
        
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to get current user');
        return response.json();
    },

    // Test connection
    async testConnection() {
        try {
            const response = await fetch(`${API_URL}/violations/?limit=1`);
            return response.ok;
        } catch (error) {
            console.error('Backend connection test failed:', error);
            return false;
        }
    }
};
