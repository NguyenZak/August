import axios from 'axios';

const api = axios.create({
    baseURL: '/api/',
    headers: {
        'Accept': 'application/json',
    },
    timeout: 300000, // 5 minutes for large file uploads
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 Session Expiry
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('[API Client] Unauthorized access - clearing session');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('august_auth_user');
                // Use window.location.href for a hard redirect since we're outside of React context
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
