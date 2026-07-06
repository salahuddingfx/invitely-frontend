export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Wedding',
    slug: 'wedding',
    description: 'Elegant designs for your special wedding day',
    icon: 'Heart'
  },
  {
    id: 'cat-2',
    name: 'Birthday',
    slug: 'birthday',
    description: 'Fun and vibrant designs for all ages',
    icon: 'Cake'
  },
  {
    id: 'cat-3',
    name: 'Anniversary',
    slug: 'anniversary',
    description: 'Celebrate years of love and togetherness',
    icon: 'Sparkles'
  },
  {
    id: 'cat-4',
    name: 'Engagement',
    slug: 'engagement',
    description: 'Share the news of your commitment',
    icon: 'Ring'
  },
  {
    id: 'cat-5',
    name: 'Baby Shower',
    slug: 'baby-shower',
    description: 'Welcome the new addition to the family',
    icon: 'Baby'
  },
  {
    id: 'cat-6',
    name: 'Party / Gala',
    slug: 'party',
    description: 'Festive layouts for galas and corporate events',
    icon: 'PartyPopper'
  },
  {
    id: 'cat-7',
    name: 'Apology',
    slug: 'apology',
    description: 'Heartfelt apology letters and watercolor cards',
    icon: 'Smile'
  },
  {
    id: 'cat-8',
    name: 'Proposal',
    slug: 'proposal',
    description: 'Romantic proposal cards and question letters',
    icon: 'HeartHandshake'
  }
];
