import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
    withCredentials: true, // Important for HttpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach access token if we have one in memory (optional if using cookies only)
// For this enterprise setup, we prefer cookies, but here is how we'd attach a stored token if needed.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s (Refresh Token)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Attempt to refresh token
                // const { data } = await api.post('/auth/refresh');
                // localStorage.setItem('access_token', data.access_token);
                // api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
                // return api(originalRequest);

                // For now, redirect to login
                window.location.href = '/login';
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
