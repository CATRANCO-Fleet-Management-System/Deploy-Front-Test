import axios from 'axios';

// Define the base API URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add interceptors for token handling
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Feedback Services

// Create Feedback Log
export const createFeedbackLog = async (feedbackData) => {
  try {
    const response = await api.post('/user/feedback', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error creating feedback log:', error);
    throw error.response ? error.response.data : error;
  }
};

// Generate OTP for Feedback
export const generateOTP = async (feedbackLogsId) => {
  try {
    const response = await api.post('/user/otp/generate', {
      feedback_logs_id: feedbackLogsId,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error.response ? error.response.data : error;
  }
};

// Verify Phone Number for Feedback
export const verifyPhoneNumber = async (feedbackLogsId, otpCode) => {
  try {
    const response = await api.post(`/user/feedback/${feedbackLogsId}/verify-phone`, {
      otp_code: otpCode,
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying phone number:', error);
    throw error.response ? error.response.data : error;
  }
};

// Get All Feedback Logs
export const getAllFeedbackLogs = async () => {
  try {
    const response = await api.get('/user/feedback-logs');
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback logs:', error);
    throw error.response ? error.response.data : error;
  }
};

// Get Feedback Log by ID
export const getFeedbackLogById = async (feedbackLogsId) => {
  try {
    const response = await api.get(`/user/feedback/${feedbackLogsId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback log by ID:', error);
    throw error.response ? error.response.data : error;
  }
};
