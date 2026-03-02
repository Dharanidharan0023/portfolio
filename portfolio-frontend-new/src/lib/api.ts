import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5195/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the JWT token to headers if available
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('adminToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
