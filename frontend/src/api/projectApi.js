// src/api/projectApi.js
import axios from './axiosInstance';

const API = axios.create({ baseURL: '/api' });

export const createProject = (data) => API.post('/projects', data);
export const getMyProjects = () => API.get('/projects/mine');
export const getMyContributions = () => API.get('/projects/contributions');
export const requestToJoinProject = (projectId) => API.post(`/projects/${projectId}/request`);
export const acceptRequest = (id, userId) => API.post(`/projects/${id}/accept`, { userId }); // This function
export const deleteProject = (id) => API.delete(`/projects/${id}`);
