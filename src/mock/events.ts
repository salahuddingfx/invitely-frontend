import { Invitation, mockInvitationSample } from './invitation';

export const mockEventsList: Invitation[] = [
  mockInvitationSample,
  {
    id: 'inv-birthday-01',
    title: "Clara's 30th Birthday Bash",
    slug: 'clara-30',
    categoryId: 'cat-2',
    templateId: 'tpl-midnight-party',
    status: 'draft',
    eventDate: '2026-11-15T19:30:00.000Z',
    eventTime: '07:30 PM - 02:00 AM',
    locationName: 'The Neon Lounge',
    locationAddress: '505 Penthouse Plaza, New York, NY 10001',
    locationMapsUrl: 'https://maps.google.com/?q=New+York+NY',
    musicUrl: 'lively-jazz-party-beats',
    coverPhoto: '/placeholder-template.svg',
    themeColor: {
      primary: '#a855f7',
      secondary: '#f59e0b',
      background: '#090d16',
      text: '#f8fafc'
    },
    fontFamily: 'sans',
    bride: {
      name: 'Clara Jenkins',
      avatar: '/avatar-placeholder.svg',
      bio: 'Clara is turning 30 and ready to dance the night away! Join us for signature cocktails, music, and midnight snacks.'
    },
    groom: {
      name: 'Special Guests',
      avatar: '/avatar-placeholder.svg',
      bio: 'All our amazing friends and family from near and far!'
    },
    gallery: [
      '/placeholder-couple.svg',
      '/placeholder-couple.svg'
    ],
    rsvps: []
  }
];
