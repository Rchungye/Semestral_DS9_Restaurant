// src/services/api.config.js
import axios from 'axios';

export const ApiService = axios.create({
    baseURL: import.meta.env.VITE_BE_URL,  // // // BACKEND URL // // //
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
ApiService.interceptors.request.use(
    (config) => {
        // Get token from zustand store
        const storedAuth = localStorage.getItem('golden-panda-auth');
        if (storedAuth) {
            try {
                const parsedAuth = JSON.parse(storedAuth);
                if (parsedAuth.state?.token) {
                    config.headers.Authorization = `Bearer ${parsedAuth.state.token}`;
                }
            } catch (error) {
                console.error('Error parsing stored auth:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
ApiService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
            // Clear auth data and redirect to login
            localStorage.removeItem('golden-panda-auth');

            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);