import { create } from 'zustand';
import { api } from '../services/api';

export interface PlanSettings {
  id: string;
  name: string;
  price: string;
  priceBDT: number;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  buttonText: string;
}

export interface PaymentNumberSettings {
  personal: string;
  merchant: string;
  instructions: string;
}

interface SettingsState {
  plans: Record<string, PlanSettings>;
  paymentNumbers: {
    bkash: PaymentNumberSettings;
    nagad: PaymentNumberSettings;
  };
  isLoading: boolean;
  error: string | null;
  fetched: boolean;
  fetchSettings: () => Promise<void>;
  updatePlans: (plans: Record<string, PlanSettings>) => Promise<boolean>;
  updatePaymentNumbers: (numbers: { bkash: PaymentNumberSettings; nagad: PaymentNumberSettings }) => Promise<boolean>;
  updateAll: (data: { plans?: Record<string, PlanSettings>; paymentNumbers?: { bkash: PaymentNumberSettings; nagad: PaymentNumberSettings } }) => Promise<boolean>;
  clearError: () => void;
}

const DEFAULT_PLANS: Record<string, PlanSettings> = {
  'plan-free': {
    id: 'plan-free',
    name: 'Starter',
    price: '$0',
    priceBDT: 0,
    period: 'forever',
    description: 'Perfect for small, intimate gatherings with close friends and family.',
    features: [
      'Access to 2 basic templates',
      'Up to 50 RSVPs',
      'Standard image upload (max 3 photos)',
      'Shared Invitely subdomain',
      'Basic countdown timer',
      'Ad-supported layout'
    ],
    isPopular: false,
    buttonText: 'Get Started'
  },
  'plan-premium': {
    id: 'plan-premium',
    name: 'Premium',
    price: '৳1,900',
    priceBDT: 1900,
    period: 'one-time',
    description: 'Our most popular choice for weddings, engagements, and big parties.',
    features: [
      'Unlock all premium templates',
      'Unlimited RSVPs',
      'Full photo gallery (up to 20 photos)',
      'Custom theme styling, colors & custom fonts',
      'No ads or Invitely watermarks',
      'Background music placeholder integration',
      'Downloadable RSVP CSV reports',
      'Google Maps venue integration'
    ],
    isPopular: true,
    buttonText: 'Upgrade Now'
  },
  'plan-vip': {
    id: 'plan-vip',
    name: 'VIP Elite',
    price: '৳4,900',
    priceBDT: 4900,
    period: 'one-time',
    description: 'Tailored for large events seeking absolute control and dedicated customization.',
    features: [
      'Everything in Premium',
      'Personalized domain support',
      'Priority support (response in < 2 hours)',
      'Custom RSVP form builder fields',
      'Guest seat and food preference management',
      'Password protection & RSVP security pins',
      'Advanced greeting wall & guest comments'
    ],
    isPopular: false,
    buttonText: 'Go VIP'
  }
};

const DEFAULT_PAYMENT_NUMBERS = {
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

export const useSettingsStore = create<SettingsState>((set, get) => ({
  plans: DEFAULT_PLANS,
  paymentNumbers: DEFAULT_PAYMENT_NUMBERS,
  isLoading: false,
  error: null,
  fetched: false,

  fetchSettings: async () => {
    if (get().fetched) return;
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/settings');
      if (response.data.success) {
        const { plans, paymentNumbers } = response.data.data;
        set({
          plans: plans || DEFAULT_PLANS,
          paymentNumbers: paymentNumbers || DEFAULT_PAYMENT_NUMBERS,
          isLoading: false,
          fetched: true
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch settings';
      set({ error: message, isLoading: false, fetched: true });
    }
  },

  updatePlans: async (plans) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/settings/plans', { plans });
      if (response.data.success) {
        set({ plans: response.data.data.plans, isLoading: false });
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update plans';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  updatePaymentNumbers: async (paymentNumbers) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/settings/payment-numbers', { paymentNumbers });
      if (response.data.success) {
        set({ paymentNumbers: response.data.data.paymentNumbers, isLoading: false });
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update payment numbers';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  updateAll: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/settings', data);
      if (response.data.success) {
        set({
          plans: response.data.data.plans || get().plans,
          paymentNumbers: response.data.data.paymentNumbers || get().paymentNumbers,
          isLoading: false
        });
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update settings';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));
