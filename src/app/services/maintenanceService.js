import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the base API URL
const API_URL = 'http://192.168.68.154:8000/api/user/admin';

// Create an instance of axios with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include the token in the headers
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Function to create maintenance scheduling
export const createMaintenanceScheduling = async (data) => {
  try {
    const response = await api.post('/maintenance-scheduling/create', data);
    return response.data;
  } catch (error) {
    console.error('Create Maintenance Scheduling error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to get all maintenance scheduling records
export const getAllMaintenanceScheduling = async () => {
  try {
    const response = await api.get('/maintenance-scheduling/all');
    return response.data;
  } catch (error) {
    console.error('Get All Maintenance Scheduling error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to get maintenance scheduling by ID
export const getMaintenanceSchedulingById = async (id) => {
  try {
    const response = await api.get(`/maintenance-scheduling/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get Maintenance Scheduling by ID error: ${id}`, error);
    throw error.response ? error.response.data : error;
  }
};

// Function to update maintenance scheduling
export const updateMaintenanceScheduling = async (id, data) => {
  try {
    const response = await api.patch(`/maintenance-scheduling/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Update Maintenance Scheduling error: ${id}`, error);
    throw error.response ? error.response.data : error;
  }
};

// Function to delete maintenance scheduling
export const deleteMaintenanceScheduling = async (id) => {
  try {
    const response = await api.delete(`/maintenance-scheduling/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete Maintenance Scheduling error: ${id}`, error);
    throw error.response ? error.response.data : error;
  }
};
