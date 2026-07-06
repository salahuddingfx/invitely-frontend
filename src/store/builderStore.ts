import { create } from 'zustand';
import { Invitation } from '../mock/invitation';

export type BuilderInvitationData = Omit<Invitation, 'id' | 'rsvps'>;

const defaultInvitationData = (): BuilderInvitationData => ({
  title: '',
  slug: '',
  categoryId: 'cat-1',
  templateId: 'tpl-royal-gold',
  status: 'draft',
  eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
  eventTime: '',
  locationName: '',
  locationAddress: '',
  locationMapsUrl: '',
  musicUrl: 'romantic-acoustic-wedding-waltz',
  coverPhoto: '',
  themeColor: {
    primary: '#d4af37',
    secondary: '#1e293b',
    background: '#fdfbf7',
    text: '#0f172a'
  },
  fontFamily: 'playfair',
  bride: {
    name: '',
    avatar: '',
    bio: '',
    parentGroomBride: '',
    instagram: ''
  },
  groom: {
    name: '',
    avatar: '',
    bio: '',
    parentGroomBride: '',
    instagram: ''
  },
  gallery: []
});

interface BuilderState {
  activeStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  invitationId: string | null; // null if creating a new one
  invitationData: BuilderInvitationData;
  isMobilePreviewOpen: boolean;
  toggleMobilePreview: () => void;
  setMobilePreview: (isOpen: boolean) => void;
  updateInvitationData: (fields: Partial<BuilderInvitationData>) => void;
  updateBrideDetails: (fields: Partial<BuilderInvitationData['bride']>) => void;
  updateGroomDetails: (fields: Partial<BuilderInvitationData['groom']>) => void;
  loadInvitation: (id: string, invitation: Invitation) => void;
  resetBuilder: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  activeStep: 0,
  setStep: (step) => set({ activeStep: step }),
  nextStep: () => set((state) => ({ activeStep: Math.min(state.activeStep + 1, 5) })),
  prevStep: () => set((state) => ({ activeStep: Math.max(state.activeStep - 1, 0) })),
  invitationId: null,
  invitationData: defaultInvitationData(),
  isMobilePreviewOpen: false,
  toggleMobilePreview: () => set((state) => ({ isMobilePreviewOpen: !state.isMobilePreviewOpen })),
  setMobilePreview: (isOpen) => set({ isMobilePreviewOpen: isOpen }),
  updateInvitationData: (fields) => set((state) => ({
    invitationData: { ...state.invitationData, ...fields }
  })),
  updateBrideDetails: (fields) => set((state) => ({
    invitationData: {
      ...state.invitationData,
      bride: { ...state.invitationData.bride, ...fields }
    }
  })),
  updateGroomDetails: (fields) => set((state) => ({
    invitationData: {
      ...state.invitationData,
      groom: { ...state.invitationData.groom, ...fields }
    }
  })),
  loadInvitation: (id, invitation) => {
    // eslint-disable-key-next-line @typescript-eslint/no-unused-vars
    const { id: _, rsvps: __, ...data } = invitation;
    set({
      invitationId: id,
      invitationData: data,
      activeStep: 0
    });
  },
  resetBuilder: () => set({
    invitationId: null,
    invitationData: defaultInvitationData(),
    activeStep: 0
  })
}));
