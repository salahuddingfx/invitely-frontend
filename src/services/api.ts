import axios from 'axios';

// Backend port is 5000 by default
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject bearer token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('invitely-auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.user?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Error parsing token for authorization:', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
