// src/api/contributionApi.js
import axios from './axiosInstance';

export const getMyContributions = () => {
  return axios.get('/projects/contributions');
};
