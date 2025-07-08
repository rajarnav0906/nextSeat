import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/auth', // backend base URL
  withCredentials: true
});

// Manual Signup
export const manualSignup = async (data) => {
  try {
    return await api.post('/signup', data);
  } catch (error) {
    console.error('Manual signup error:', error);
    throw error;
  }
};

// Google Auth
export const googleAuth = async (code) => {
  try {
    return await api.get(`/google?code=${code}`);
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
};

// Manual Login
export const manualLogin = async (data) => {
  try {
    return await api.post('/login', data);
  } catch (error) {
    console.error('Manual login error:', error);
    throw error;
  }
};

// Upload ID Card
export const uploadIdCard = async (formData) => {
  try {
    return await api.post('/upload-id', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('ID card upload error:', error);
    throw error;
  }
};
