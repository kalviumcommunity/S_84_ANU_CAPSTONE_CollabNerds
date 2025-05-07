// api/projectApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:6767/api',
});

// Attach token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createProject = (projectData) => API.post('/projects', projectData);
export const getMyProjects = () => API.get('/projects/my-projects');
export const getMyContributions = () => API.get('/projects/my-contributions');
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const requestToJoinProject = (id) => API.post(`/projects/${id}/request`);
export const acceptRequest = (id, userId) => API.post(`/projects/${id}/accept`, { userId });
