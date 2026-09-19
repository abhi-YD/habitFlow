import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Activity, Search, Shield, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Admin() {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [metricsRes, usersRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get(`/admin/users?page=${page}&search=${search}`)
      ]);
      setMetrics(metricsRes.data);
      setUsers(usersRes.data.users);
      setTotalPages(usersRes.data.pages);
    } catch (error) {
      toast.error('Failed to load admin data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, [page, search]);

  const handleUpdateUser = async (id, updates) => {
    try {
      await api.put(`/admin/users/${id}`, updates);
      toast.success('User updated successfully');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-[#64748B] text-sm">Manage users, plans, and platform metrics.</p>
      </div>

      {/* METRICS */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Users Stat */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
                <Users size={16} />
              </div>
              <p className="text-[#64748B] text-sm font-medium">Total Users</p>
            </div>
            <p className="text-2xl font-bold text-white">{metrics.users.total}</p>
            <p className="text-xs text-[#64748B] mt-1">
              +{metrics.users.newThisWeek} this week
            </p>
          </div>

          {/* Revenue Stat */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">
                <CreditCard size={16} />
              </div>
              <p className="text-[#64748B] text-sm font-medium">Pro Users</p>
            </div>
            <p className="text-2xl font-bold text-white">{metrics.users.pro}</p>
            <p className="text-xs text-[#64748B] mt-1">
              {metrics.users.conversionRate}% conversion
            </p>
          </div>

          {/* Platform Activity */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-violet-500/20 text-violet-400 rounded-lg flex items-center justify-center">
                <Activity size={16} />
              </div>
              <p className="text-[#64748B] text-sm font-medium">Active Habits</p>
            </div>
            <p className="text-2xl font-bold text-white">{metrics.content.habits}</p>
            <p className="text-xs text-[#64748B] mt-1">
              {metrics.content.logs} total completions
            </p>
          </div>

          {/* Revenue Monthly estimate */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center">
                <span className="font-bold">₹</span>
              </div>
              <p className="text-[#64748B] text-sm font-medium">Monthly Rev.</p>
            </div>
            <p className="text-2xl font-bold text-white">₹{metrics.revenue.monthly.toLocaleString()}</p>
            <p className="text-xs text-[#64748B] mt-1">
              Estimated run rate
            </p>
          </div>
        </div>
      )}

      {/* USERS TABLE */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[#1E1E2E] flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">User Management</h2>
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0A0A0F] border border-[#1E1E2E] text-white text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0A0A0F] border-b border-[#1E1E2E] text-xs uppercase text-[#64748B] font-medium">
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-[#1E1E2E]/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-400 font-bold text-xs flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-[#64748B] text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      user.plan === 'pro' ? 'bg-[#06FFA5]/10 text-[#06FFA5]' : 'bg-[#1E1E2E] text-[#94A3B8]'
                    }`}>
                      {user.plan === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs ${
                      user.role === 'admin' ? 'text-violet-400' : 'text-[#64748B]'
                    }`}>
                      {user.role === 'admin' && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#64748B]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.plan === 'free' ? (
                        <button
                          onClick={() => handleUpdateUser(user._id, { plan: 'pro' })}
                          className="p-1.5 text-[#64748B] hover:text-[#06FFA5] hover:bg-[#06FFA5]/10 rounded-lg transition-colors"
                          title="Upgrade to Pro"
                        >
                          <ArrowUpCircle size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateUser(user._id, { plan: 'free' })}
                          className="p-1.5 text-[#06FFA5] hover:text-[#64748B] hover:bg-[#1E1E2E] rounded-lg transition-colors"
                          title="Downgrade to Free"
                        >
                          <ArrowDownCircle size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleUpdateUser(user._id, { role: user.role === 'admin' ? 'user' : 'admin' })}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.role === 'admin' ? 'text-violet-400 hover:bg-violet-500/10' : 'text-[#64748B] hover:text-white hover:bg-[#1E1E2E]'
                        }`}
                        title="Toggle Admin Role"
                      >
                        <Shield size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-1.5 text-[#64748B] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-2"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#1E1E2E] flex justify-between items-center bg-[#0A0A0F]">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-[#111118] border border-[#1E1E2E] text-white text-xs rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-[#64748B] text-xs">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-[#111118] border border-[#1E1E2E] text-white text-xs rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}