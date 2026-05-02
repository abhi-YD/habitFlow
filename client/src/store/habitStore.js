import { create } from 'zustand';
import api from '../api/axios';

const useHabitStore = create((set, get) => ({
  habits: [],
  logs: {},        // { "2026-04-29": [...logs] }
  streaks: {},     // { habitId: streakCount }
  isLoading: false,
  error: null,

  // FETCH ALL HABITS
  fetchHabits: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/habits');
      set({ habits: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // CREATE HABIT
  createHabit: async (habitData) => {
    try {
      const res = await api.post('/habits', habitData);
      set((state) => ({ habits: [res.data, ...state.habits] }));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message 
      };
    }
  },

  // UPDATE HABIT
  updateHabit: async (id, habitData) => {
    try {
      const res = await api.put(`/habits/${id}`, habitData);
      set((state) => ({
        habits: state.habits.map((h) => h._id === id ? res.data : h)
      }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  // DELETE HABIT
  deleteHabit: async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      set((state) => ({
        habits: state.habits.filter((h) => h._id !== id)
      }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  // LOG HABIT (check off)
  logHabit: async (habitId, date, completed, note = '') => {
    try {
      const res = await api.post(`/habits/${habitId}/log`, {
        date, completed, note
      });
      // update local logs state
      set((state) => ({
        logs: {
          ...state.logs,
          [date]: state.logs[date]
            ? state.logs[date].map((l) =>
                l.habitId === habitId ? res.data : l
              )
            : [res.data]
        }
      }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  // FETCH LOGS FOR A DATE
  fetchLogsForDate: async (date) => {
    try {
      const res = await api.get(`/habits/logs/${date}`);
      set((state) => ({
        logs: { ...state.logs, [date]: res.data.logs }
      }));
      return res.data;  // { logs, score, completed, total }
    } catch (err) {
      return null;
    }
  },

  // FETCH HABIT LOGS (streak)
  fetchHabitLogs: async (habitId) => {
    try {
      const res = await api.get(`/habits/${habitId}/logs`);
      set((state) => ({
        streaks: { ...state.streaks, [habitId]: res.data.streak }
      }));
      return res.data;
    } catch (err) {
      return null;
    }
  }
}));

export default useHabitStore;