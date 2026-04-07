import axios from 'axios';

const api = axios.create({
  // Use VITE_API_URL if defined, otherwise default to relative path for production or localhost for dev.
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global response interceptor for security monitoring
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session Expired logic (401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear persistence and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
