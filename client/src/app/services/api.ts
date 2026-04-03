import axios from 'axios';
import { RegisterRequest, LoginRequest } from './types';
export * from './types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh/error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data: RegisterRequest) =>
    api.post('/farmers/register', data),
  login: (data: LoginRequest) =>
    api.post('/farmers/login', data),
  phoneLogin: (data: { firebaseToken: string }) =>
    api.post('/farmers/phone-login', data),
  phoneRegister: (data: { firebaseToken: string; name: string }) =>
    api.post('/farmers/phone-register', data),
  getProfile: () => api.get('/farmers/profile'),
};

export const farmsAPI = {
  create: (data: { location: string; area: number; soilType: string; season: string }) =>
    api.post('/farms/create', data),
  getMyFarms: () => api.get('/farms/my-farms'),
  update: (id: string, data: any) => api.put(`/farms/update/${id}`, data),
  refresh: (id: string) => api.put(`/farms/refresh/${id}`),
  delete: (id: string) => api.delete(`/farms/delete/${id}`),
};

export const recommendAPI = {
  recommendCrop: (data: { location: string; soilType: string; season: string }) =>
    api.post('/recommend/recommend-crop', data),
};

export const dashboardAPI = {
  getDashboardData: (userId?: string) =>
    api.get(`/farms/my-farms`),
};

export const chatAPI = {
  sendMessage: (data: { message: string; context?: any }) =>
    api.post('/chat', data),
};