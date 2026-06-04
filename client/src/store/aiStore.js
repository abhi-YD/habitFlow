import { create } from 'zustand';
import api from '../api/axios';

const useAIStore = create((set) => ({
  coach:       null,
  suggestions: null,
  insights:    null,
  priorities:  null,
  isLoading:   {},
  error:       null,

  fetchCoach: async () => {
    set((s) => ({ isLoading: { ...s.isLoading, coach: true } }));
    try {
      const res = await api.get('/ai/coach');
      set((s) => ({
        coach:     res.data,
        isLoading: { ...s.isLoading, coach: false }
      }));
    } catch (err) {
      set((s) => ({ isLoading: { ...s.isLoading, coach: false } }));
    }
  },

  fetchSuggestions: async (goal) => {
    set((s) => ({
      isLoading: { ...s.isLoading, suggestions: true },
      suggestions: null
    }));
    try {
      const res = await api.post('/ai/suggest-habits', { goal });
      set((s) => ({
        suggestions: res.data,
        isLoading:   { ...s.isLoading, suggestions: false }
      }));
      return res.data;
    } catch (err) {
      set((s) => ({
        isLoading: { ...s.isLoading, suggestions: false }
      }));
      return null;
    }
  },

  fetchInsights: async () => {
    set((s) => ({ isLoading: { ...s.isLoading, insights: true } }));
    try {
      const res = await api.get('/ai/insights');
      set((s) => ({
        insights:  res.data,
        isLoading: { ...s.isLoading, insights: false }
      }));
    } catch (err) {
      set((s) => ({ isLoading: { ...s.isLoading, insights: false } }));
    }
  },

  fetchPriorities: async (context = '') => {
    set((s) => ({
      isLoading: { ...s.isLoading, priorities: true }
    }));
    try {
      const res = await api.post('/ai/prioritize', { context });
      set((s) => ({
        priorities: res.data,
        isLoading:  { ...s.isLoading, priorities: false }
      }));
      return res.data;
    } catch (err) {
      set((s) => ({
        isLoading: { ...s.isLoading, priorities: false }
      }));
      return null;
    }
  },

  clearSuggestions: () => set({ suggestions: null }),
}));

export default useAIStore;