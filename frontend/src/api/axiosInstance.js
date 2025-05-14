import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://s-84-anu-capstone-collabnerds-3.onrender.com', // ✅ Hardcoded base URL
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
