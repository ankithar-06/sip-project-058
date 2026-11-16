import axios from 'axios';

// Create configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('msme_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (window.location.pathname.startsWith('/dashboard')) {
        localStorage.removeItem('msme_token');
        localStorage.removeItem('msme_user');
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authApi = {
  register: (data) => api.post('/api/users/register', data),
  login: (data) => api.post('/api/users/login', data),
  getMe: () => api.get('/api/users/me'),
  logout: () => api.post('/api/users/logout'),
};

// Business APIs
export const businessApi = {
  create: (data) => api.post('/api/businesses/', data),
  getMy: () => api.get('/api/businesses/my'),
  getById: (id) => api.get(`/api/businesses/${id}`),
  getPublic: (id) => api.get(`/api/businesses/${id}/public`),
  update: (id, data) => api.put(`/api/businesses/${id}`, data),
  delete: (id) => api.delete(`/api/businesses/${id}`),
  list: (params) => api.get('/api/businesses/', { params }),
};

// Product APIs
export const productApi = {
  add: (data) => api.post('/api/products/', data),
  getMy: () => api.get('/api/products/my'),
  list: (params) => api.get('/api/products/', { params }),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
};

// Marketing APIs
export const marketingApi = {
  generate: (data) => api.post('/api/marketing/generate', data),
  getHistory: () => api.get('/api/marketing/history'),
};

// Collaboration APIs
export const collaborationApi = {
  send: (data) => api.post('/api/collaborations/', data),
  getMy: () => api.get('/api/collaborations/'),
  updateStatus: (id, status) => api.patch(`/api/collaborations/${id}/status`, { status }),
};

// Government Opportunities APIs
export const opportunityApi = {
  list: (params) => api.get('/api/opportunities/', { params }),
};

// Analytics APIs
export const analyticsApi = {
  getOverview: () => api.get('/api/analytics/overview'),
  recordInquiry: (businessId) => api.post(`/api/analytics/inquiry/${businessId}`),
};

export default api;
