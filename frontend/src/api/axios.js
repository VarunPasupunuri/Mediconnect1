import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Explicitly connected to corresponding backend port 5000
});

// Auto-attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediconnect_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRoute = err.config?.url?.includes('/auth/login') || err.config?.url?.includes('/auth/register');
    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('mediconnect_token');
      localStorage.removeItem('mediconnect_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
