import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../mock/profile';
import { useNotificationStore } from './notificationStore';
import { api } from '../services/api';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  updateUserPlan: (planId: 'plan-free' | 'plan-premium' | 'plan-vip') => Promise<boolean>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializing: true,

      initializeAuth: async () => {
        const authStorage = localStorage.getItem('invitely-auth-storage');
        if (!authStorage) {
          set({ isInitializing: false });
          return;
        }
        
        try {
          const parsed = JSON.parse(authStorage);
          const token = parsed?.state?.user?.token;
          if (!token) {
            set({ isInitializing: false });
            return;
          }

          // Verify token against backend profile endpoint
          const res = await api.get('/auth/profile');
          if (res.data && res.data.success) {
            const serverUser = res.data.data;
            const updatedUser: UserProfile = {
              id: serverUser.id || serverUser._id,
              name: serverUser.name,
              email: serverUser.email,
              avatar: serverUser.avatar,
              currentPlan: serverUser.currentPlan,
              isAdmin: serverUser.isAdmin,
              joinedDate: new Date(serverUser.joinedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }),
              isEmailVerified: true,
              token: token // retain token
            };
            set({ user: updatedUser, isAuthenticated: true, isInitializing: false });
          } else {
            set({ user: null, isAuthenticated: false, isInitializing: false });
          }
        } catch (err) {
          console.error('Session initialization failed:', err);
          // Token might be expired or server down, clear session
          set({ user: null, isAuthenticated: false, isInitializing: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { email, password });
          if (res.data && res.data.success) {
            const serverUser = res.data.data;
            const user: UserProfile = {
              id: serverUser.id || serverUser._id,
              name: serverUser.name,
              email: serverUser.email,
              avatar: serverUser.avatar,
              currentPlan: serverUser.currentPlan,
              isAdmin: serverUser.isAdmin,
              joinedDate: new Date(serverUser.joinedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }),
              isEmailVerified: true,
              token: serverUser.token
            };
            set({ user, isAuthenticated: true, isLoading: false, isInitializing: false });
            useNotificationStore.getState().addToast('Welcome back to Invitely!', 'success');
            return true;
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'Login failed. Please try again.';
          useNotificationStore.getState().addToast(errMsg, 'error');
        }
        set({ isLoading: false });
        return false;
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/register', { name, email, password: password || '123456' });
          if (res.data && res.data.success) {
            const serverUser = res.data.data;
            const user: UserProfile = {
              id: serverUser.id || serverUser._id,
              name: serverUser.name,
              email: serverUser.email,
              avatar: serverUser.avatar,
              currentPlan: serverUser.currentPlan,
              joinedDate: new Date(serverUser.joinedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }),
              isEmailVerified: true,
              token: serverUser.token
            };
            set({ user, isAuthenticated: true, isLoading: false, isInitializing: false });
            useNotificationStore.getState().addToast('Account created successfully!', 'success');
            return true;
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'Registration failed.';
          useNotificationStore.getState().addToast(errMsg, 'error');
        }
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isInitializing: false });
        useNotificationStore.getState().addToast('Logged out successfully.', 'info');
      },

      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/forgot-password', { email });
          if (res.data && res.data.success) {
            set({ isLoading: false });
            useNotificationStore.getState().addToast(`Password reset instructions sent to ${email}`, 'success');
            return true;
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'Failed to dispatch password instructions.';
          useNotificationStore.getState().addToast(errMsg, 'error');
        }
        set({ isLoading: false });
        return false;
      },

      updateUserPlan: async (planId) => {
        try {
          const res = await api.put('/auth/plan', { planId });
          if (res.data && res.data.success) {
            const serverUser = res.data.data;
            set((state) => {
              if (!state.user) return {};
              const updatedUser = { ...state.user, currentPlan: serverUser.currentPlan };
              return { user: updatedUser };
            });
            useNotificationStore.getState().addToast('Plan upgraded successfully!', 'success');
            return true;
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'Failed to upgrade plan.';
          useNotificationStore.getState().addToast(errMsg, 'error');
        }
        return false;
      }
    }),
    {
      name: 'invitely-auth-storage'
    }
  )
);
