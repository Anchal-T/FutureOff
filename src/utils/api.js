import axios from 'axios';
import { BACKEND_API_URL } from './constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Strategies API
export const fetchStrategies = async () => {
  const response = await api.get('/api/strategies');
  return response.data;
};

export const fetchStrategy = async (id) => {
  const response = await api.get(`/api/strategies/${id}`);
  return response.data;
};

export const executeStrategy = async (id, amount) => {
  const response = await api.post(`/api/strategies/${id}/execute`, { amount });
  return response.data;
};

export const optimizeStrategies = async () => {
  const response = await api.post('/api/strategies/optimize');
  return response.data;
};

// Protocols API
export const fetchProtocols = async () => {
  const response = await api.get('/api/protocols');
  return response.data;
};

// Execution History API
export const fetchExecutionHistory = async (limit = 50) => {
  const response = await api.get(`/api/execution-history?limit=${limit}`);
  return response.data;
};

// Simulation Logs API
export const fetchSimulationLogs = async (limit = 100) => {
  const response = await api.get(`/api/simulation-logs?limit=${limit}`);
  return response.data;
};

// System Status API
export const fetchSystemStatus = async () => {
  const response = await api.get('/api/status');
  return response.data;
};

// Legacy API for compatibility
export const optimizePortfolio = async (params) => {
  return await optimizeStrategies();
};