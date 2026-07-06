import { create } from 'zustand';
import { api } from '../services/api';

export type PaymentMethod = 'bkash' | 'nagad';

export interface PaymentRequest {
  _id: string;
  userId: string | { _id: string; name: string; email: string; avatar: string; currentPlan: string };
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  senderPhone: string;
  transactionId: string;
  screenshotUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

interface PaymentState {
  payments: PaymentRequest[];
  currentPayment: Partial<PaymentRequest> | null;
  isLoading: boolean;
  error: string | null;
  setCurrentPayment: (payment: Partial<PaymentRequest> | null) => void;
  submitPayment: (paymentData: {
    planId: string;
    planName: string;
    amount: number;
    method: PaymentMethod;
    senderPhone: string;
    transactionId: string;
    screenshotUrl: string;
  }) => Promise<boolean>;
  fetchMyPayments: () => Promise<void>;
  fetchAllPayments: (status?: string) => Promise<void>;
  approvePayment: (id: string) => Promise<boolean>;
  rejectPayment: (id: string, reason?: string) => Promise<boolean>;
  clearError: () => void;
}

// bKash & Nagad merchant numbers (replace with real ones)
export const PAYMENT_NUMBERS = {
  bkash: {
    personal: '01XXXXXXXXX',
    merchant: '01XXXXXXXXX',
    instructions: 'Send money to bKash personal number'
  },
  nagad: {
    personal: '01XXXXXXXXX',
    merchant: '01XXXXXXXXX',
    instructions: 'Send money to Nagad personal number'
  }
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null,

  setCurrentPayment: (payment) => set({ currentPayment: payment }),

  submitPayment: async (paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/payments', paymentData);
      if (response.data.success) {
        set((state) => ({
          payments: [response.data.data, ...state.payments],
          isLoading: false
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit payment';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  fetchMyPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/payments/my');
      if (response.data.success) {
        set({ payments: response.data.data, isLoading: false });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch payments';
      set({ error: message, isLoading: false });
    }
  },

  fetchAllPayments: async (status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = status ? `?status=${status}` : '';
      const response = await api.get(`/payments${params}`);
      if (response.data.success) {
        set({ payments: response.data.data, isLoading: false });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch payments';
      set({ error: message, isLoading: false });
    }
  },

  approvePayment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/payments/${id}/approve`);
      if (response.data.success) {
        set((state) => ({
          payments: state.payments.map((p) =>
            p._id === id ? { ...p, status: 'approved' } : p
          ),
          isLoading: false
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to approve payment';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  rejectPayment: async (id, reason) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/payments/${id}/reject`, { reason });
      if (response.data.success) {
        set((state) => ({
          payments: state.payments.map((p) =>
            p._id === id ? { ...p, status: 'rejected' } : p
          ),
          isLoading: false
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reject payment';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));
