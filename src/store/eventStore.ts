import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invitation, RSVP } from '../mock/invitation';
import { useNotificationStore } from './notificationStore';
import { api } from '../services/api';

// Utility helper to map Mongoose _id objects to standard client id fields
const mapServerInvitation = (item: any): Invitation => {
  if (!item) return item;
  return {
    ...item,
    id: item._id || item.id,
    rsvps: (item.rsvps || []).map((r: any) => ({
      ...r,
      id: r._id || r.id
    }))
  };
};

interface EventState {
  events: Invitation[];
  isLoading: boolean;
  fetchUserInvitations: () => Promise<void>;
  createInvitation: (event: Omit<Invitation, 'id' | 'rsvps'>) => Promise<string | null>;
  updateInvitation: (id: string, updatedFields: Partial<Invitation>) => Promise<boolean>;
  deleteInvitation: (id: string) => Promise<boolean>;
  getInvitationById: (id: string) => Invitation | undefined;
  getInvitationBySlug: (slug: string) => Invitation | undefined;
  fetchPublicInvitation: (slug: string) => Promise<Invitation | null>;
  addRSVP: (slug: string, rsvpData: Omit<RSVP, 'id' | 'createdAt'>) => Promise<boolean>;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      isLoading: false,

      fetchUserInvitations: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get('/invitations/user');
          if (res.data && res.data.success) {
            const mapped = res.data.data.map(mapServerInvitation);
            set({ events: mapped });
          }
        } catch (err: any) {
          console.error('Failed to fetch user invitations:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      createInvitation: async (eventData) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/invitations', eventData);
          if (res.data && res.data.success) {
            const created = mapServerInvitation(res.data.data);
            set((state) => ({
              events: [created, ...state.events]
            }));
            useNotificationStore.getState().addToast('Invitation created successfully!', 'success');
            return created.id;
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'Failed to create invitation.';
          useNotificationStore.getState().addToast(errMsg, 'error');
        } finally {
          set({ isLoading: false });
        }
        return null;
      },

      updateInvitation: async (id, updatedFields) => {
        set({ isLoading: true });
        try {
          const res = await api.put(`/invitations/${id}`, updatedFields);
          if (res.data && res.data.success) {
            const updated = mapServerInvitation(res.data.data);
            set((state) => ({
              events: state.events.map((event) => 
                event.id === id ? updated : event
              )
            }));
            useNotificationStore.getState().addToast('Invitation updated successfully!', 'success');
            return true;
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'Failed to update invitation.';
          useNotificationStore.getState().addToast(errMsg, 'error');
        } finally {
          set({ isLoading: false });
        }
        return false;
      },

      deleteInvitation: async (id) => {
        set({ isLoading: true });
        try {
          const res = await api.delete(`/invitations/${id}`);
          if (res.data && res.data.success) {
            set((state) => ({
              events: state.events.filter((event) => event.id !== id)
            }));
            useNotificationStore.getState().addToast('Invitation deleted.', 'warning');
            return true;
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'Failed to delete invitation.';
          useNotificationStore.getState().addToast(errMsg, 'error');
        } finally {
          set({ isLoading: false });
        }
        return false;
      },

      getInvitationById: (id) => {
        return get().events.find((event) => event.id === id);
      },

      getInvitationBySlug: (slug) => {
        return get().events.find((event) => event.slug.toLowerCase() === slug.toLowerCase());
      },

      fetchPublicInvitation: async (slug) => {
        try {
          const res = await api.get(`/invitations/public/${slug}`);
          if (res.data && res.data.success) {
            return mapServerInvitation(res.data.data);
          }
        } catch (error) {
          console.error(`Failed to fetch public invitation ${slug}:`, error);
        }
        return null;
      },

      addRSVP: async (slug, rsvpData) => {
        try {
          const res = await api.post(`/invitations/public/${slug}/rsvp`, rsvpData);
          if (res.data && res.data.success) {
            const updated = mapServerInvitation(res.data.data);
            
            // Sync cache if user has this event loaded
            set((state) => ({
              events: state.events.map((event) => 
                event.slug.toLowerCase() === slug.toLowerCase() ? updated : event
              )
            }));
            
            useNotificationStore.getState().addToast('RSVP submitted successfully!', 'success');
            return true;
          }
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'Failed to submit RSVP.';
          useNotificationStore.getState().addToast(errMsg, 'error');
        }
        return false;
      }
    }),
    {
      name: 'invitely-events-storage'
    }
  )
);
