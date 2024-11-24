import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the base API URL
const API_URL = 'http://192.168.68.154:8000/api';

// Create an instance of axios with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include the token in the headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken'); // Ensure 'authToken' is used
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// **Fuel Logs Service Functions**

/**
 * Fetch all fuel logs.
 * @returns {Promise<Object[]>} - An array of fuel logs.
 */
export const fetchAllFuelLogs = async () => {
  try {
    const response = await api.get('/user/admin/fuel-logs/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all fuel logs:', error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Fetch a single fuel log by ID.
 * @param {number} id - The ID of the fuel log.
 * @returns {Promise<Object>} - The fuel log data.
 */
export const fetchFuelLogById = async (id) => {
  try {
    const response = await api.get(`/user/admin/fuel-logs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching fuel log with ID ${id}:`, error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Create a new fuel log.
 * @param {FormData} fuelLogData - Form data for creating a new fuel log.
 * @returns {Promise<Object>} - The created fuel log data.
 */
export const createFuelLog = async (fuelLogData) => {
  try {
    const response = await api.post('/user/admin/fuel-logs/create', fuelLogData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating fuel log:', error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Update an existing fuel log.
 * @param {number} id - The ID of the fuel log to update.
 * @param {FormData} fuelLogData - Form data with updated values.
 * @returns {Promise<Object>} - The updated fuel log data.
 */
export const updateFuelLog = async (id, fuelLogData) => {
  try {
    const response = await api.patch(`/user/admin/fuel-logs/update/${id}`, fuelLogData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating fuel log with ID ${id}:`, error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Delete a fuel log by ID.
 * @param {number} id - The ID of the fuel log to delete.
 * @returns {Promise<Object>} - The result of the deletion.
 */
export const deleteFuelLog = async (id) => {
  try {
    const response = await api.delete(`/user/admin/fuel-logs/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting fuel log with ID ${id}:`, error);
    throw error.response ? error.response.data : error;
  }
};
