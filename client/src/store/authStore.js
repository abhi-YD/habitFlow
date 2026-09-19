import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoggedIn: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // REGISTER
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      set({
        user: res.data.user,
        token: res.data.token,
        isLoggedIn: true,
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Registration failed',
        isLoading: false 
      });
      return { success: false };
    }
  },

  // LOGIN
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      set({
        user: res.data.user,
        token: res.data.token,
        isLoggedIn: true,
        isLoading: false
      });
      return { success: true };
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Login failed',
        isLoading: false 
      });
      return { success: false };
    }
  },

  // additional method to handle Google OAuth token login
  loginWithToken: (token, userData) => {
    localStorage.setItem('token', token);
    set({
      token,
      isLoggedIn: true,
      user: {
        name:  userData.name,
        email: userData.email,
      }
    });
  },

  // FETCH CURRENT USER
  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isLoggedIn: true });
    } catch (err) {
      set({ user: null, isLoggedIn: false });
    }
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isLoggedIn: false });
  }
}));

export default useAuthStore;