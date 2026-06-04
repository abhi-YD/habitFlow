import { create } from 'zustand';
import api from '../api/axios';

const useAnalyticsStore = create((set) => ({
  data:      null,
  isLoading: false,
  days:      30,

  fetchAnalytics: async (days = 30) => {
    set({ isLoading: true, days });
    try {
      const res = await api.get(`/analytics?days=${days}`);
      set({ data: res.data, isLoading: false });
      return res.data;
    } catch (err) {
      set({ isLoading: false });
      return null;
    }
  },
}));

export default useAnalyticsStore;