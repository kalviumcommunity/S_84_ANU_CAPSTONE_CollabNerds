import axios from 'axios';

const instance = axios.create({
  // Use the environment variable from .env file for dynamic base URL
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  withCredentials: true
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
