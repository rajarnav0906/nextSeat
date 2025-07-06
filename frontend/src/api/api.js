import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/auth',
    withCredentials: true
});

// Google Auth
export const googleAuth = async (code) => {
    try {
        return await api.get(`/google?code=${code}`);
    } catch (error) {
        console.error('Google auth error:', error);
        throw error;
    }
};