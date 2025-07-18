import axios from 'axios';

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const AUTH_BASE = `${BACKEND}/auth`;
const API_BASE = `${BACKEND}/api`;

// -------------------- Auth API --------------------

const auth = axios.create({
  baseURL: AUTH_BASE,
  withCredentials: true,
});

// Manual Signup
export const manualSignup = async (data) => {
  try {
    return await auth.post('/signup', data);
  } catch (error) {
    console.error('Manual signup error:', error);
    throw error;
  }
};

// api.js
export const googleAuth = async (idToken) => {
  try {
    return await auth.post('/google', { idToken });
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
};



// Manual Login
export const manualLogin = async (data) => {
  try {
    return await auth.post('/login', data);
  } catch (error) {
    console.error('Manual login error:', error);
    throw error;
  }

};

// Upload ID Card
export const uploadIdCard = async (formData) => {
  try {
    return await auth.post('/upload-id', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('ID card upload error:', error);
    throw error;
  }
};

// -------------------- Auth Header --------------------

const getToken = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem('user-info'));
    return parsed?.token;
  } catch {
    return null;
  }
};

const getAuthHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// -------------------- Trip APIs --------------------

export const getMyTrips = async () => {
  const res = await axios.get(`${API_BASE}/trips/mine`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const createTrip = async (tripData) => {
  const res = await axios.post(`${API_BASE}/trips`, tripData, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const deleteTrip = async (tripId) => {
  const res = await axios.delete(`${API_BASE}/trips/${tripId}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const discoverMatches = async (tripId) => {
  const res = await axios.get(`${API_BASE}/trips/discover/${tripId}`, {
    headers: getAuthHeader(),
  });
  // console.log('[discoverMatches]', tripId, res.data);
  return res.data;
};

// -------------------- Connection APIs --------------------

export const sendConnectionRequest = async (tripId, matchedTripId) => {
  const res = await axios.post(
    `${API_BASE}/connections`,
    { tripId, matchedTripId },
    { headers: getAuthHeader() }
  );
  return res.data;
};

export const getConnectionStatus = async () => {
  const res = await axios.get(`${API_BASE}/connections/mine`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getAcceptedConnections = async () => {
  const res = await axios.get(`${API_BASE}/connections/accepted`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

// export const getConnectionById = async (connectionId) => {
//   const res = await axios.get(`${API_BASE}/connections/${connectionId}`, {
//     headers: getAuthHeader(),
//   });
//   return res.data;
// };


// -------------------- Testimonial APIs --------------------

export const getTestimonials = async () => {
  const res = await axios.get(`${API_BASE}/testimonials`);
  return res.data;
};

export const postTestimonial = async (data) => {
  const res = await axios.post(`${API_BASE}/testimonials`, data);
  return res.data;
};

export const hasUserSubmitted = async (userId) => {
  const res = await axios.get(`${API_BASE}/testimonials/user/${userId}`);
  return res.data.submitted;
};

// Optional: export a pre-configured axios instance
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: getAuthHeader(),
});
