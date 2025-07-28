// src/store/userStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, logoutUser, getUserProfile } from '../services/userService';
import { ApiService } from '../services/api.config';

const useUserStore = create(
    persist(
        (set, get) => ({
            // ============= STATE =============
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // ============= ACTIONS =============

            // Login action
            login: async (username, password) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await loginUser(username, password);

                    // Check if response has error (from catch block)
                    if (response?.status && response.status !== 200) {
                        set({
                            error: response.data?.error || 'Error de conexión',
                            isLoading: false
                        });
                        return { success: false, error: response.data?.error || 'Error de conexión' };
                    }

                    // Success response
                    if (response.token && response.user) {
                        const { token, user } = response;

                        // Set token in axios defaults for future requests
                        ApiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        });

                        return { success: true, user, token };
                    } else {
                        set({
                            error: 'Respuesta inválida del servidor',
                            isLoading: false
                        });
                        return { success: false, error: 'Respuesta inválida del servidor' };
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.error || 'Error de conexión';
                    set({
                        error: errorMessage,
                        isLoading: false
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Logout action
            logout: async () => {
                set({ isLoading: true });

                try {
                    // Call logout endpoint if user is authenticated
                    if (get().isAuthenticated) {
                        await logoutUser();
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    // Clear token from axios defaults
                    delete ApiService.defaults.headers.common['Authorization'];

                    // Clear state
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                    });
                }
            },

            // Get profile action
            getProfile: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getUserProfile();

                    if (response?.status && response.status !== 200) {
                        // Token might be expired, logout user
                        get().logout();
                        return { success: false, error: 'Sesión expirada' };
                    }

                    if (response.user) {
                        set({
                            user: response.user,
                            isLoading: false,
                            error: null
                        });
                        return { success: true, user: response.user };
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.error || 'Error al obtener perfil';
                    set({
                        error: errorMessage,
                        isLoading: false
                    });

                    // If unauthorized, logout user
                    if (error.response?.status === 401) {
                        get().logout();
                    }

                    return { success: false, error: errorMessage };
                }
            },

            // Initialize auth from stored token
            initializeAuth: () => {
                const { token } = get();
                if (token) {
                    ApiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    // Optionally validate token by getting profile
                    get().getProfile();
                }
            },

            // Clear error
            clearError: () => set({ error: null }),

            // Check if user has specific role
            hasRole: (role) => {
                const { user } = get();
                return user?.role === role;
            },

            // Check if user is admin
            isAdmin: () => {
                const { user } = get();
                return user?.role === 'administrador';
            },

            // Check if user is chef
            isChef: () => {
                const { user } = get();
                return user?.role === 'cocinero';
            }
        }),
        {
            name: 'golden-panda-auth', // localStorage key
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);

export default useUserStore;