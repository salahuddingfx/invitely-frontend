export interface PersonDetails {
  name: string;
  avatar: string;
  bio: string;
  parentGroomBride?: string;
  facebook?: string;
  instagram?: string;
}

export interface RSVP {
  id: string;
  name: string;
  status: 'attending' | 'declined' | 'tentative';
  guestsCount: number;
  foodPreference: 'standard' | 'vegetarian' | 'vegan' | 'halal' | 'kosher';
  message: string;
  createdAt: string;
  phone?: string;
}

export interface Invitation {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  templateId: string;
  status: 'draft' | 'published';
  eventDate: string; // ISO date string
  eventTime: string; // e.g., "4:00 PM"
  locationName: string; // e.g., "The Palace Garden"
  locationAddress: string;
  locationMapsUrl: string;
  musicUrl: string; // URL or placeholder string
  coverPhoto: string; // Cover/hero image for the invitation
  themeColor: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fontFamily: 'playfair' | 'cormorant' | 'greatvibes' | 'sans' | 'amiri';
  bride: PersonDetails;
  groom: PersonDetails;
  gallery: string[];
  rsvps: RSVP[];
}

export const mockInvitationSample: Invitation = {
  id: 'inv-wedding-01',
  title: 'Wedding of Sarah & Alexander',
  slug: 'sarah-and-alex',
  categoryId: 'cat-1',
  templateId: 'tpl-royal-gold',
  status: 'published',
  eventDate: '2026-09-24T16:00:00.000Z',
  eventTime: '04:00 PM - 10:00 PM',
  locationName: 'Royal Grand Pavilion & Garden',
  locationAddress: '782 Whispering Pines Parkway, Napa Valley, CA 94558',
  locationMapsUrl: 'https://maps.google.com/?q=Napa+Valley+CA',
  musicUrl: 'romantic-acoustic-wedding-waltz',
  coverPhoto: '/placeholder-couple.svg',
  themeColor: {
    primary: '#d4af37',
    secondary: '#1e293b',
    background: '#fdfbf7',
    text: '#0f172a'
  },
  fontFamily: 'playfair',
  bride: {
    name: 'Sarah Elizabeth Bennett',
    avatar: '/avatar-placeholder.svg',
    bio: 'Sarah is an interior designer who loves watercolors, garden walks, and early mornings. She met Alexander during an art gallery opening, and they have been inseparable since.',
    parentGroomBride: 'Daughter of Mr. & Mrs. Edward Bennett',
    instagram: '@sarah_bennett'
  },
  groom: {
    name: 'Alexander James Harrison',
    avatar: '/avatar-placeholder.svg',
    bio: 'Alexander is an architectural designer with a passion for classic books, hiking, and acoustic guitar. He proposed to Sarah at sunrise on a foggy cliff overlooking the ocean.',
    parentGroomBride: 'Son of Mr. & Mrs. Richard Harrison',
    instagram: '@alex_harrison'
  },
  gallery: [
    '/placeholder-couple.svg',
    '/placeholder-couple.svg',
    '/placeholder-couple.svg',
    '/placeholder-couple.svg',
    '/placeholder-couple.svg',
    '/placeholder-couple.svg'
  ],
  rsvps: [
    {
      id: 'rsvp-1',
      name: 'Eleanor Vance',
      status: 'attending',
      guestsCount: 2,
      foodPreference: 'vegetarian',
      message: 'So incredibly happy for you two! Looking forward to celebrating your beautiful day.',
      createdAt: '2026-07-02T14:32:00.000Z'
    },
    {
      id: 'rsvp-2',
      name: 'Michael Chen',
      status: 'attending',
      guestsCount: 1,
      foodPreference: 'standard',
      message: 'Cant wait! Congrats Sarah and Alex!',
      createdAt: '2026-07-03T09:15:00.000Z'
    },
    {
      id: 'rsvp-3',
      name: 'Dr. Rebecca Foster',
      status: 'tentative',
      guestsCount: 1,
      foodPreference: 'vegan',
      message: 'Will check my schedule, hope to see you guys there!',
      createdAt: '2026-07-04T10:00:00.000Z'
    }
  ]
};
