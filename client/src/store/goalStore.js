import { create } from 'zustand';
import api from '../api/axios';

const useGoalStore = create((set) => ({
  goals: [],
  isLoading: false,

  // FETCH GOALS
  fetchGoals: async (level = '') => {
    set({ isLoading: true });
    try {
      const query = level ? `?level=${level}` : '';
      const res = await api.get(`/goals${query}`);
      set({ goals: res.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  // CREATE GOAL
  createGoal: async (goalData) => {
    try {
      const res = await api.post('/goals', goalData);
      set((state) => ({ goals: [res.data, ...state.goals] }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  // UPDATE GOAL
  updateGoal: async (id, goalData) => {
    try {
      const res = await api.put(`/goals/${id}`, goalData);
      set((state) => ({
        goals: state.goals.map((g) => g._id === id ? res.data : g)
      }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  // UPDATE PROGRESS
  updateProgress: async (id) => {
    try {
      const res = await api.patch(`/goals/${id}/progress`);
      set((state) => ({
        goals: state.goals.map((g) => g._id === id ? res.data.goal : g)
      }));
      return res.data;
    } catch (err) {
      return null;
    }
  },

  // DELETE GOAL
  deleteGoal: async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      set((state) => ({
        goals: state.goals.filter((g) => g._id !== id)
      }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
}));

export default useGoalStore;