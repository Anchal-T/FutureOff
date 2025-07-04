import axios from 'axios';
import { BACKEND_API_URL } from './constants';

export const fetchProtocols = async () => {
  const response = await axios.get(`${BACKEND_API_URL}/api/protocols`);
  return response.data;
};

export const optimizePortfolio = async (params) => {
  const response = await axios.post(`${BACKEND_API_URL}/api/optimize`, params);
  return response.data;
};