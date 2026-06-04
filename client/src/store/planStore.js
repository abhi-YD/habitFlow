//created by Abhinav  on 26/05/24
import { create } from 'zustand';
import api from '../api/axios';

const usePlanStore = create((set) => ({
  plan:      'free',
  expiry:    null,
  billing:   null,
  daysLeft:  null,
  isLoading: false,
  showUpgradeModal: false,
  upgradeReason:    '',

  fetchPlanStatus: async () => {
    try {
      const res = await api.get('/payments/status');
      set({
        plan:     res.data.plan,
        expiry:   res.data.expiry,
        billing:  res.data.billing,
        daysLeft: res.data.daysLeft,
      });
      return res.data;
    } catch (err) {
      return null;
    }
  },

  openUpgradeModal: (reason = '') => {
    set({ showUpgradeModal: true, upgradeReason: reason });
  },

  closeUpgradeModal: () => {
    set({ showUpgradeModal: false, upgradeReason: '' });
  },

  setplan: (plan) => set({ plan }),
}));

export default usePlanStore;