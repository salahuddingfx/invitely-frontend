export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: 'couple' | 'decor' | 'venue' | 'portraits';
}

export const mockGalleryImages: GalleryImage[] = [
  {
    id: 'img-1',
    url: '/placeholder-couple.svg',
    caption: 'Sunset embrace by the lake',
    category: 'couple'
  },
  {
    id: 'img-2',
    url: '/placeholder-couple.svg',
    caption: 'Floral wedding arch setting',
    category: 'decor'
  },
  {
    id: 'img-3',
    url: '/placeholder-couple.svg',
    caption: 'Strolling through the forest',
    category: 'couple'
  },
  {
    id: 'img-4',
    url: '/placeholder-couple.svg',
    caption: 'Aesthetic banquet reception table',
    category: 'decor'
  },
  {
    id: 'img-5',
    url: '/placeholder-couple.svg',
    caption: 'Sarah - Portrait',
    category: 'portraits'
  },
  {
    id: 'img-6',
    url: '/placeholder-couple.svg',
    caption: 'Alexander - Portrait',
    category: 'portraits'
  },
  {
    id: 'img-7',
    url: '/placeholder-couple.svg',
    caption: 'Outdoor garden pavilion venue',
    category: 'venue'
  },
  {
    id: 'img-8',
    url: '/placeholder-couple.svg',
    caption: 'Sunny beach destination venue',
    category: 'venue'
  }
];
