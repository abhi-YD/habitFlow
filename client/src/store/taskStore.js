import { create } from 'zustand';
import api from '../api/axios';

const useTaskStore = create((set) => ({
  tasks: [],
  summary: null,
  isLoading: false,

  // FETCH ALL TASKS
  fetchTasks: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/tasks?${params}`);
      set({ tasks: res.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  // CREATE TASK
  createTask: async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      set((state) => ({ tasks: [res.data, ...state.tasks] }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  // TOGGLE COMPLETE
  completeTask: async (id) => {
    try {
      const res = await api.patch(`/tasks/${id}/complete`);
      set((state) => ({
        tasks: state.tasks.map((t) => t._id === id ? res.data : t)
      }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  // UPDATE TASK
  updateTask: async (id, taskData) => {
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      set((state) => ({
        tasks: state.tasks.map((t) => t._id === id ? res.data : t)
      }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  // DELETE TASK
  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id)
      }));
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },

  // TODAY'S SUMMARY
  fetchSummary: async () => {
    try {
      const res = await api.get('/tasks/summary/today');
      set({ summary: res.data });
      return res.data;
    } catch (err) {
      return null;
    }
  }
}));

export default useTaskStore;