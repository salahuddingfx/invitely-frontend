import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import { useNotificationStore } from './notificationStore';
import { api } from '../services/api';

interface UserSettings {
  emailNotifications: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
  autoSaveBuilder: boolean;
}

interface UserState {
  settings: UserSettings;
  updateProfile: (name: string, email: string, avatar?: string) => Promise<boolean>;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      settings: {
        emailNotifications: true,
        marketingEmails: false,
        twoFactorEnabled: false,
        autoSaveBuilder: true
      },
      updateProfile: async (name, email, avatar) => {
        try {
          const res = await api.put('/auth/profile', { name, email, avatar });
          if (res.data && res.data.success) {
            const serverUser = res.data.data;
            const authStore = useAuthStore.getState();
            if (authStore.user) {
              const updatedUser = {
                ...authStore.user,
                name: serverUser.name,
                email: serverUser.email,
                avatar: serverUser.avatar || authStore.user.avatar
              };
              useAuthStore.setState({ user: updatedUser });
            }
            useNotificationStore.getState().addToast('Profile updated successfully!', 'success');
            return true;
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'Failed to update profile details.';
          useNotificationStore.getState().addToast(errMsg, 'error');
        }
        return false;
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
        useNotificationStore.getState().addToast('Settings saved.', 'success');
      }
    }),
    {
      name: 'invitely-user-storage'
    }
  )
);
