import axios from 'axios';

// Define the base API URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create an instance of axios with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include the token in the headers
api.interceptors.request.use(config => {
  if (typeof window !== "undefined") { // Check if in the browser environment
    const token = localStorage.getItem('authToken'); // Ensure 'authToken' is used
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Function to handle login
export const login = async (credentials) => {
  try {
    const response = await api.post('/user/login', {
      username: credentials.username,
      password: credentials.password,
    });

    if (response.data && response.data.token) {
      const token = response.data.token;

      // Save token in localStorage
      localStorage.setItem('authToken', token);
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to handle registration
export const register = async (userData) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to get user profile
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    if (!token) throw new Error('User not logged in.');

    const response = await api.get('/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to update user profile
export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    if (!token) throw new Error('User not logged in.');

    const response = await api.patch('/user/update', profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Function to handle logout
export const logout = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    if (!token) throw new Error('User not logged in.');

    await api.post('/user/logout', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remove token from localStorage
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
