// meetingApi.js
import axios from './axiosInstance';

export const createMeeting = async (meetingData) => {
    const response = await axios.post('/meetings', meetingData);
    return response.data;
  };

export const getUpcomingMeetings = () => axios.get('/meetings/upcoming');
