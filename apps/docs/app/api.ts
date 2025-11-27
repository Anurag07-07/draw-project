import axios from 'axios';
import { HTTP_BACKEND } from './config';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: HTTP_BACKEND,
  withCredentials: true, // Send cookies with requests
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, clear token and redirect to login
    if (error.response?.status === 401) {
      console.error('❌ Got 401 error from API');
      console.error('Request URL:', error.config?.url);
      console.error('Error response:', error.response?.data);
      console.log('🗑️ Removing token from localStorage');
      localStorage.removeItem('token');
      // Optionally redirect to login page
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
