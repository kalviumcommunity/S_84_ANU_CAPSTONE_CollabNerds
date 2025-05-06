import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const createMeeting = (data) => API.post('/meetings', data);
export const getUpcomingMeetings = () => API.get('/meetings/upcoming');
export const updateMeeting = (id, data) => API.put(`/meetings/${id}`, data);
export const deleteMeeting = (id) => API.delete(`/meetings/${id}`);