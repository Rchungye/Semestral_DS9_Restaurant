// src/services/userService.js
import { ApiService } from './api.config';

// ============= AUTHENTICATION SERVICES =============

// Login service
export const loginUser = async (username, password) => {
    return ApiService.post('/api/auth/login', { username, password })
        .then(response => response.data)
        .catch(error => Promise.resolve(error.response));
};

// Logout service
export const logoutUser = async () => {
    return ApiService.post('/api/auth/logout')
        .then(response => response.data)
        .catch(error => Promise.resolve(error.response));
};

// Get user profile service
export const getUserProfile = async () => {
    return ApiService.get('/api/auth/profile')
        .then(response => response.data)
        .catch(error => Promise.resolve(error.response));
};

// ============= USER CRUD SERVICES (ADMIN ONLY) =============

// Get all users
export const getAllUsers = async () => {
    return ApiService.get('/api/admin/users')
        .then(response => response.data)
        .catch(error => Promise.resolve(error.response));
};

// Get user by ID
export const getUserById = async (userId) => {
    return ApiService.get(`/api/admin/users/${userId}`)
        .then(response => response.data)
        .catch(error => Promise.resolve(error.response));
};

// Create user (Admin only)
export const createUserAdmin = async (userData) => {
    return ApiService.post('/api/admin/users', userData)
        .then(response => response.data)
        .catch(error => Promise.resolve(error.response));
};

// Update user (Admin only)
export const updateUserAdmin = async (userId, userData) => {
    return ApiService.put(`/api/admin/users/${userId}`, userData)
        .then(response => response.data)
        .catch(error => Promise.resolve(error.response));
};

// Delete user (Admin only)
export const deleteUserAdmin = async (userId) => {
    return ApiService.delete(`/api/admin/users/${userId}`)
        .then(response => response.data)
        .catch(error => Promise.resolve(error.response));
};