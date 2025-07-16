import axios from 'axios';

const AUTH_BASE = 'http://localhost:8080/auth';
const API_BASE = 'http://localhost:8080/api';

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

// Google Auth
export const googleAuth = async (code) => {
  try {
    return await auth.get(`/google?code=${code}`);
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

// -------------------- Trip API --------------------

// 🔐 Safely get token from localStorage
const getToken = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("user-info"));
    return parsed?.token; // ✅ token is directly here
  } catch {
    return null;
  }
};


const getAuthHeader = () => ({
  Authorization: `Bearer ${getToken()}`
});

// Get your own trips
export const getMyTrips = async () => {
  const res = await axios.get(`${API_BASE}/trips/mine`, {
    headers: getAuthHeader()
  });
  return res.data;
};

// Discover matches for a trip
// Discover matches for a trip (with debug)
export const discoverMatches = async (tripId) => {
  try {
    const res = await axios.get(`${API_BASE}/trips/discover/${tripId}`, {
      headers: getAuthHeader()
    });
    console.log("📡 [discoverMatches] Response for tripId:", tripId, res.data);
    return res.data;
  } catch (err) {
    console.error("❌ [discoverMatches] API error:", err);
    throw err;
  }
};


export const createTrip = async (tripData) => {
  const token = JSON.parse(localStorage.getItem("user-info"))?.token;
  const res = await axios.post("http://localhost:8080/api/trips", tripData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// delete the trip
// Delete a trip
export const deleteTrip = async (tripId) => {
  try {
    const headers = getAuthHeader();
    console.log("🛡️ Sending DELETE with headers:", headers);

    const res = await axios.delete(`${API_BASE}/trips/${tripId}`, {
      headers
    });

    console.log("✅ Trip deleted from backend:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to delete trip. Error:", err.response?.data || err.message);
    throw err;
  }
};


// Send connection request
export const sendConnectionRequest = async (tripId, matchedTripId) => {
  try {
    const res = await axios.post(
      `http://localhost:8080/api/connections`,
      { tripId, matchedTripId },
      { headers: getAuthHeader() }
    );
    console.log("✅ [sendConnectionRequest] Sent:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ [sendConnectionRequest] Error:", err.response?.data || err.message);
    throw err;
  }
};

// Fetch existing connection status
export const getConnectionStatus = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/connections/mine`, {
      headers: getAuthHeader()
    });
    return res.data; // list of connections
  } catch (err) {
    console.error("❌ [getConnectionStatus] Error:", err.response?.data || err.message);
    return [];
  }
};


export const getAcceptedConnections = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/connections/accepted', {
      headers: getAuthHeader()
    });
    console.log("👥 [getAcceptedConnections] Loaded", res.data.length);
    return res.data;
  } catch (err) {
    console.error("❌ [getAcceptedConnections] error:", err.response?.data || err.message);
    return [];
  }
};




// Add this function
export const getTestimonials = async () => {
  try {
    const res = await axios.get("/api/testimonials");
    console.log("✅ Testimonials fetched:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching testimonials:", err.message);
    throw err;
  }
};


export const postTestimonial = async (data) => {
  try {
    const res = await axios.post('/api/testimonials', data);
    console.log('✅ Testimonial submitted:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ Error submitting testimonial:', err.message);
    throw err;
  }
};



export const hasUserSubmitted = async (userId) => {
  const res = await axios.get(`/api/testimonials/user/${userId}`);
  return res.data.submitted; // true or false
};










