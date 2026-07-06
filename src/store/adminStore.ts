import { create } from 'zustand';
import { api } from '../services/api';

interface AdminStats {
  totalUsers: number;
  totalInvitations: number;
  publishedInvitations: number;
  totalRSVPs: number;
  attendingRSVPs: number;
  pendingPayments: number;
  approvedPayments: number;
  rejectedPayments: number;
  totalRevenue: number;
  monthlyRevenue: Array<{ _id: string; total: number; count: number }>;
  paymentMethods: Array<{ _id: string; count: number; total: number }>;
  planDistribution: Array<{ _id: string; count: number }>;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    avatar: string;
    currentPlan: string;
    createdAt: string;
  }>;
  recentPayments: Array<{
    _id: string;
    userId: { name: string; email: string };
    planName: string;
    amount: number;
    method: string;
    status: string;
    createdAt: string;
  }>;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  currentPlan: string;
  joinedDate: string;
  invitationCount: number;
  createdAt: string;
}

interface AdminState {
  stats: AdminStats | null;
  users: AdminUser[];
  usersPagination: { total: number; page: number; pages: number };
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchUsers: (params?: { search?: string; plan?: string; page?: number }) => Promise<void>;
  updateUserPlan: (userId: string, plan: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  users: [],
  usersPagination: { total: 0, page: 1, pages: 1 },
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        set({ stats: response.data.data, isLoading: false });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      set({ error: message, isLoading: false });
    }
  },

  fetchUsers: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { search, plan, page = 1 } = params || {};
      let query = `?page=${page}&limit=20`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (plan && plan !== 'all') query += `&plan=${plan}`;
      
      const response = await api.get(`/admin/users${query}`);
      if (response.data.success) {
        set({
          users: response.data.data,
          usersPagination: response.data.pagination,
          isLoading: false
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      set({ error: message, isLoading: false });
    }
  },

  updateUserPlan: async (userId, plan) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/admin/users/${userId}/plan`, { plan });
      if (response.data.success) {
        set((state) => ({
          users: state.users.map((u) =>
            u._id === userId ? { ...u, currentPlan: plan } : u
          ),
          isLoading: false
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user plan';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        set((state) => ({
          users: state.users.filter((u) => u._id !== userId),
          isLoading: false
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete user';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));
