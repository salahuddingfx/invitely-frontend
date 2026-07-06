export interface PricingPlan {
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

export const mockPricingPlans: PricingPlan[] = [
  {
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
      'Shared Invitely subdomain (e.g., invitely.co/your-slug)',
      'Basic countdown timer',
      'Ad-supported layout'
    ],
    isPopular: false,
    buttonText: 'Get Started'
  },
  {
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
  {
    id: 'plan-vip',
    name: 'VIP Elite',
    price: '৳4,900',
    priceBDT: 4900,
    period: 'one-time',
    description: 'Tailored for large events seeking absolute control and dedicated customization.',
    features: [
      'Everything in Premium',
      'Personalized domain support (e.g., wedding.johnandjane.com)',
      'Priority support (response in < 2 hours)',
      'Custom RSVP form builder fields',
      'Guest seat and food preference management',
      'Password protection & RSVP security pins',
      'Advanced greeting wall & guest comments'
    ],
    isPopular: false,
    buttonText: 'Go VIP'
  }
];
