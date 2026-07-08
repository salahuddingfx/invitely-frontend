import { create } from 'zustand';
import { Invitation, LoveStoryMilestone } from '../mock/invitation';

export type BuilderInvitationData = Omit<Invitation, 'id' | 'rsvps'>;

const defaultLoveStory = (): LoveStoryMilestone[] => [
  { id: 'ms-1', title: 'How We Met', date: 'Autumn 2023', description: 'A chance encounter that turned into endless conversations, laughter, and a spark that couldn\'t be ignored.', icon: '✨' },
  { id: 'ms-2', title: 'First Date', date: 'December 2023', description: 'A quiet coffee afternoon that stretched into dinner. We lost track of time and knew it was something special.', icon: '☕' },
  { id: 'ms-3', title: 'The Proposal', date: 'Spring 2025', description: 'Under a beautiful sunset canopy, with hearts beating fast, he asked and she joyfully said "Yes" to forever.', icon: '💍' },
  { id: 'ms-4', title: 'The Big Day', date: 'Our Wedding Day', description: 'The start of our absolute forever. We are thrilled to celebrate our love and marriage vows with you.', icon: '🏰' },
];

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
  gallery: [],
  loveStory: defaultLoveStory()
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
  addLoveStoryMilestone: () => void;
  updateLoveStoryMilestone: (id: string, fields: Partial<LoveStoryMilestone>) => void;
  removeLoveStoryMilestone: (id: string) => void;
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
  addLoveStoryMilestone: () => set((state) => ({
    invitationData: {
      ...state.invitationData,
      loveStory: [
        ...(state.invitationData.loveStory || []),
        {
          id: `ms-${Date.now()}`,
          title: 'New Milestone',
          date: '',
          description: '',
          icon: '⭐'
        }
      ]
    }
  })),
  updateLoveStoryMilestone: (id, fields) => set((state) => ({
    invitationData: {
      ...state.invitationData,
      loveStory: (state.invitationData.loveStory || []).map((m) =>
        m.id === id ? { ...m, ...fields } : m
      )
    }
  })),
  removeLoveStoryMilestone: (id) => set((state) => ({
    invitationData: {
      ...state.invitationData,
      loveStory: (state.invitationData.loveStory || []).filter((m) => m.id !== id)
    }
  })),
  loadInvitation: (id, invitation) => {
    // eslint-disable-key-next-line @typescript-eslint/no-unused-vars
    const { id: _, rsvps: __, ...data } = invitation;
    set({
      invitationId: id,
      invitationData: {
        ...data,
        loveStory: data.loveStory?.length ? data.loveStory : defaultLoveStory()
      },
      activeStep: 0
    });
  },
  resetBuilder: () => set({
    invitationId: null,
    invitationData: defaultInvitationData(),
    activeStep: 0
  })
}));


