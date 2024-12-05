import axios from 'axios';

// Define the base API URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Adjusted to /user, if needed

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
    const token = localStorage.getItem('authToken'); // Fetch token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// **User Profile Service Functions**

/**
 * Create a new user profile.
 * @param {Object} profileData - The profile data to create a new user.
 * @returns {Promise<Object>} - The created user profile data.
 */
export const createProfile = async (profileData) => {
  try {
    const response = await api.post('/user/admin/profiles/create', profileData);
    return response.data;
  } catch (error) {
    console.error('Create profile error:', error);
    throw error.response ? error.response.data : error.message || error;
  }
};

/**
 * Get all user profiles.
 * @returns {Promise<Object[]>} - An array of user profiles.
 */
export const getAllProfiles = async () => {
  try {
    const response = await api.get('/user/admin/profiles/all');
    return response.data;
  } catch (error) {
    console.error('Get all profiles error:', error.message);
    throw error.response ? error.response.data : error.message || error;
  }
};

/**
 * Get a user profile by ID.
 * @param {number} id - The ID of the user profile.
 * @returns {Promise<Object>} - The user profile data.
 */
export const getProfileById = async (id) => {
  try {
    const response = await api.get(`/user/admin/profiles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get profile by ID error: ${id}`, error);
    throw error.response ? error.response.data : error.message || error;
  }
};

/**
 * Update a user profile by ID.
 * @param {number} id - The ID of the user profile.
 * @param {Object} profileData - The updated profile data.
 * @returns {Promise<Object>} - The updated user profile data.
 */
export const updateProfile = async (id, profileData) => {
  try {
    const response = await api.patch(`/user/admin/profiles/update/${id}`, profileData);
    return response.data;
  } catch (error) {
    console.error(`Update profile error: ${id}`, error);
    throw error.response ? error.response.data : error.message || error;
  }
};

/**
 * Delete a user profile by ID.
 * @param {number} id - The ID of the user profile.
 * @returns {Promise<Object>} - The result of the deletion.
 */
export const deleteProfile = async (id) => {
  try {
    const response = await api.delete(`/user/admin/profiles/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete profile error: ${id}`, error);
    throw error.response ? error.response.data : error.message || error;
  }
};
