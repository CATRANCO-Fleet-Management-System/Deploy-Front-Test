import axios from "axios";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the base API URL
const API_URL = "http://192.168.68.154:8000/api";

// Create an instance of axios with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to include the token in the headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken"); // Ensure 'authToken' is used
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to handle login
export const login = async (credentials) => {
  try {
    const response = await api.post("/user/login", {
      username: credentials.username, // Adjusted for "username" field
      password: credentials.password,
    });

    if (response.data && response.data.token) {
      const token = response.data.token;
      await AsyncStorage.setItem("authToken", token); // Save token in AsyncStorage
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to handle registration
export const register = async (userData) => {
  try {
    const response = await api.post("/user/register", userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// Function to get user profile
export const getProfile = async () => {
  try {
    const response = await api.get("/user/me"); // Adjusted to the correct endpoint
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.patch("/user/update", profileData); // Adjusted to the correct endpoint
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to handle logout
export const logout = async () => {
  try {
    await api.post("/user/logout"); // Call the logout endpoint
    await AsyncStorage.removeItem("authToken"); // Remove the token from AsyncStorage
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Optionally, add more functions for other endpoints if needed
