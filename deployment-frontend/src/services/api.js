import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Auth
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}-token-auth/`, { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  // Clients
  getClients: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.os_type) params.append('os_type', filters.os_type);
    
    return apiClient.get(`/clients/?${params.toString()}`);
  },
  
  getClient: async (id) => {
    return apiClient.get(`/clients/${id}/`);
  },
  
  // Packages
  getPackages: async () => {
    return apiClient.get('/packages/');
  },
  
  createPackage: async (packageData) => {
    return apiClient.post('/packages/', packageData);
  },
  
  // Deployments
  getDeployments: async () => {
    return apiClient.get('/deployments/');
  },
  
  createDeployment: async (deploymentData) => {
    return apiClient.post('/deployments/', deploymentData);
  },
  
  getDeployment: async (id) => {
    return apiClient.get(`/deployments/${id}/`);
  },
};

export default apiService;