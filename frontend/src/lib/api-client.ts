import axios from 'axios';

const api = axios.create({
    baseURL: '/api/',
    headers: {
        'Accept': 'application/json',
    },
    timeout: 300000, // 5 minutes for large file uploads
});

// Interceptor để tự động đính kèm Token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        console.log(`[API Client] Request: ${config.method?.toUpperCase()} ${config.url} | Token exists: ${!!token}`);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
