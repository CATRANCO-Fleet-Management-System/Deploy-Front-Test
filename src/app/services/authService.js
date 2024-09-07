import axios from 'axios';

const API_URL = 'http://192.168.68.154:8000/api/user/';

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}login`, {
      email: credentials.email,
      password: credentials.password
    });

    if (response.data && response.data.token) {
      const token = response.data.token; // Define the token
      localStorage.setItem("auth_token", token); // Use the defined token
    }
    

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}register`, userData);
    
    if (response.data) {
      return response.data;
    } else {
      throw new Error('No data received from register request');
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      console.log("User is already logged out");
      return false; // User is already logged out
    }

    // Proceed with logout request
    const response = await fetch('http://192.168.68.154:8000/api/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem('auth_token'); // Remove the token
      return true; // Successfully logged out
    } else {
      const data = await response.json();
      throw new Error(data.message || "Logout failed");
    }
  } catch (error) {
    console.error("Logout failed:", error);
    throw error; // Re-throw the error for the calling function to handle
  }
};
