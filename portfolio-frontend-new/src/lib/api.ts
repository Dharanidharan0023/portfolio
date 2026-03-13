import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend-port-beryl.vercel.app/api',
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

// Response interceptor to handle global 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized! Token may be missing or expired.');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
