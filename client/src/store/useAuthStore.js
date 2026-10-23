import { create } from 'zustand';
import { api } from '../config/axios.js';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, 
  error: null,

  checkAuth: async () => {
    try {
      const response = await api.get('/users/me'); 
      set({ user: response.data, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/users/register', { email, password });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      return { success: true, user: response.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
      return { success: false };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/users/login', { email, password });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      return { success: true, user: response.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      return { success: false };
    }
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
}));