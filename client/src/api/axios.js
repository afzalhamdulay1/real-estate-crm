import axios from 'axios';

const api = axios.create({
  // Use VITE_API_URL if defined, otherwise default to relative path for production or localhost for dev.
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
