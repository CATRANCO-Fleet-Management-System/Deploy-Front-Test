import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the base API URL
const API_URL = 'http://192.168.68.154:8000/api/user';

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

// Function to create a new user profile
export const createProfile = async (profileData) => {
  try {
    const response = await api.post('/admin/profiles/create', profileData);
    return response.data;
  } catch (error) {
    console.error('Create profile error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to get all user profiles
export const getAllProfiles = async () => {
  try {
    const response = await api.get('/admin/profiles/all');
    return response.data;
  } catch (error) {
    console.error('Get all profiles error:', error.message);
    throw error.response ? error.response.data : error;
  }
};

// Function to get a user profile by ID
export const getProfileById = async (id) => {
  try {
    const response = await api.get(`/admin/profiles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get profile by ID error: ${id}`, error);
    throw error.response ? error.response.data : error;
  }
};

// Function to update a user profile by ID
export const updateProfile = async (id, profileData) => {
  try {
    const response = await api.patch(`/admin/profiles/update/${id}`, profileData);
    return response.data;
  } catch (error) {
    console.error(`Update profile error: ${id}`, error);
    throw error.response ? error.response.data : error;
  }
};

// Function to delete a user profile by ID
export const deleteProfile = async (id) => {
  try {
    const response = await api.delete(`/admin/profiles/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete profile error: ${id}`, error);
    throw error.response ? error.response.data : error;
  }
};
