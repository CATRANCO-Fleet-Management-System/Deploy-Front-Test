import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the base API URL for vehicle assignments
const API_URL = 'http://192.168.68.154:8000/api/user/admin/assignments';

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

// Function to create a new vehicle assignment
export const createVehicleAssignment = async (assignmentData) => {
  try {
    const response = await api.post('/create', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Create vehicle assignment error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to get all vehicle assignments
export const getAllVehicleAssignments = async () => {
  try {
    const response = await api.get('/all');
    return response.data;
  } catch (error) {
    console.error('Get all vehicle assignments error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

// Function to get a vehicle assignment by ID
export const getVehicleAssignmentById = async (id) => {
  try {
    const response = await api.get(`/${id}`); // Correct URL format
    return response.data;
  } catch (error) {
    console.error('Get vehicle assignment by ID error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to update a vehicle assignment by ID
export const updateVehicleAssignment = async (id, assignmentData) => {
  try {
    const response = await api.patch(`/update/${id}`, assignmentData);
    return response.data;
  } catch (error) {
    console.error('Update vehicle assignment error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to delete a vehicle assignment by ID
export const deleteVehicleAssignment = async (id) => {
  try {
    const response = await api.delete(`/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete vehicle assignment error:', error);
    throw error.response ? error.response.data : error;
  }
};
