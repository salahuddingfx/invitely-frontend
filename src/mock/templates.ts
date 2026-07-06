export interface TemplateTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: 'playfair' | 'cormorant' | 'greatvibes' | 'sans';
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  previewImage: string;
  bgImage: string;
  isPremium: boolean;
  theme: TemplateTheme;
}

export const mockTemplates: Template[] = [
  // WEDDING CATEGORY (cat-1) - 10 Templates
  {
    id: 'tpl-royal-gold',
    name: 'Royal Gold',
    slug: 'royal-gold',
    categoryId: 'cat-1',
    description: 'An exquisite, luxury design featuring gold borders, floral details, and timeless serif typography.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#d4af37', // Luxury Gold
      secondaryColor: '#1e293b',
      accentColor: '#94721d',
      backgroundColor: '#fdfbf7',
      textColor: '#0f172a',
      fontFamily: 'playfair'
    }
  },
  {
    id: 'tpl-enchanted-forest',
    name: 'Enchanted Forest',
    slug: 'enchanted-forest',
    categoryId: 'cat-1',
    description: 'Deep forest green paired with delicate gold lines, capturing the magic of outdoor nature.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#166534', // Green
      secondaryColor: '#b8942c',
      accentColor: '#fef08a',
      backgroundColor: '#f4fbf7',
      textColor: '#14532d',
      fontFamily: 'cormorant'
    }
  },
  {
    id: 'tpl-blossom-pink',
    name: 'Blossom Pink',
    slug: 'blossom-pink',
    categoryId: 'cat-1',
    description: 'Romantic watercolor pink textures combined with a gorgeous script calligraphy font.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#ec4899', // Rose Pink
      secondaryColor: '#db2777',
      accentColor: '#f472b6',
      backgroundColor: '#fff1f2',
      textColor: '#4c0519',
      fontFamily: 'greatvibes'
    }
  },
  {
    id: 'tpl-nikkah-emerald',
    name: 'Islamic Nikkah Emerald',
    slug: 'nikkah-emerald',
    categoryId: 'cat-1',
    description: 'Featuring a beautiful Bismillah header, intricate arabesque gold stars, and a rich emerald layout.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#d4af37', // Royal Gold
      secondaryColor: '#065f46', // Emerald
      accentColor: '#d4af37',
      backgroundColor: '#ecfdf5', // Light Emerald
      textColor: '#064e3b',
      fontFamily: 'amiri'
    }
  },
  {
    id: 'tpl-nikkah-persian',
    name: 'Islamic Nikkah Persian',
    slug: 'nikkah-persian',
    categoryId: 'cat-1',
    description: 'Stunning royal Persian blue backdrop detailed with gold crescent motifs and arabesque trims.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#d4af37', // Royal Gold
      secondaryColor: '#312e81', // Indigo
      accentColor: '#d4af37',
      backgroundColor: '#eef2ff', // Light Indigo
      textColor: '#1e1b4b',
      fontFamily: 'amiri'
    }
  },
  {
    id: 'tpl-mehndi-traditional',
    name: 'Traditional Indian Mehndi',
    slug: 'mehndi-traditional',
    categoryId: 'cat-1',
    description: 'Vibrant marigold orange patterns, mandala vectors, and royal yellow fonts celebrating henna nights.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#d4af37', // Royal Gold
      secondaryColor: '#9a3412', // Orange-Brown
      accentColor: '#f59e0b',
      backgroundColor: '#fff7ed', // Light Warm
      textColor: '#431407',
      fontFamily: 'amiri'
    }
  },
  {
    id: 'tpl-boho-sunset',
    name: 'Boho Terracotta Sunset',
    slug: 'boho-sunset',
    categoryId: 'cat-1',
    description: 'Rustic warm clay terracotta gradients paired with dry pampas grass silhouettes.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#c2410c', // Terracotta
      secondaryColor: '#8c5e58',
      accentColor: '#eab308',
      backgroundColor: '#fff7ed',
      textColor: '#431407',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-vintage-crimson',
    name: 'Vintage Crimson',
    slug: 'vintage-crimson',
    categoryId: 'cat-1',
    description: 'Deep crimson watercolor roses, antiqued paper borders, and elegant italic scripts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#991b1b', // Crimson
      secondaryColor: '#450a0a',
      accentColor: '#fb7185',
      backgroundColor: '#fdf8f8',
      textColor: '#450a0a',
      fontFamily: 'cormorant'
    }
  },
  {
    id: 'tpl-minimal-ivory',
    name: 'Minimalist Ivory',
    slug: 'minimal-ivory',
    categoryId: 'cat-1',
    description: 'Clean ivory card background, single-line dark borders, and modern editorial sans fonts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#1e293b', // Charcoal
      secondaryColor: '#475569',
      accentColor: '#94a3b8',
      backgroundColor: '#fafafa',
      textColor: '#0f172a',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-nautical-coastal',
    name: 'Coastal Yacht Wedding',
    slug: 'nautical-coastal',
    categoryId: 'cat-1',
    description: 'Crisp navy blue details, sailor ropes, and light blue watercolor waves.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#1d4ed8', // Navy
      secondaryColor: '#3b82f6',
      accentColor: '#60a5fa',
      backgroundColor: '#f0f4f8',
      textColor: '#1e293b',
      fontFamily: 'sans'
    }
  },

  // BIRTHDAY CATEGORY (cat-2) - 6 Templates
  {
    id: 'tpl-midnight-party',
    name: 'Midnight Celebration',
    slug: 'midnight-celebration',
    categoryId: 'cat-2',
    description: 'Vibrant purple glow and gold stars set against a deep night sky backdrop.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#9333ea', // Purple
      secondaryColor: '#f59e0b',
      accentColor: '#ec4899',
      backgroundColor: '#faf5ff', // Light Purple
      textColor: '#3b0764',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-retro-arcade',
    name: 'Retro Arcade Birthday',
    slug: 'retro-arcade',
    categoryId: 'cat-2',
    description: 'Pixel fonts, neon grids, and yellow highlights recreating vintage gaming lounges.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#eab308', // Arcade Yellow
      secondaryColor: '#06b6d4', // Cyan
      accentColor: '#f43f5e',
      backgroundColor: '#fefce8', // Light Yellow
      textColor: '#422006',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-kids-carnival',
    name: 'Kids Carnival Balloon',
    slug: 'kids-carnival',
    categoryId: 'cat-2',
    description: 'Dotted pastel grids, floating red and blue balloons, and playful cartoon fonts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#3b82f6', // Light Blue
      secondaryColor: '#ef4444',
      accentColor: '#10b981',
      backgroundColor: '#f0fdf4',
      textColor: '#1e3a8a',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-sweet-16',
    name: 'Sweet 16 Pink Glitter',
    slug: 'sweet-16',
    categoryId: 'cat-2',
    description: 'Glittery rose gold backgrounds, floating bubbles, and cursive calligraphy scripts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#ec4899', // Pink
      secondaryColor: '#f43f5e',
      accentColor: '#fbcfe8',
      backgroundColor: '#fff1f2',
      textColor: '#4c0519',
      fontFamily: 'greatvibes'
    }
  },
  {
    id: 'tpl-jungle-safari',
    name: 'Jungle Safari Adventure',
    slug: 'jungle-safari',
    categoryId: 'cat-2',
    description: 'Safari plant leaves, cute watercolor lions, giraffes, and warm earthy fonts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#15803d', // Jungle Green
      secondaryColor: '#b45309',
      accentColor: '#f59e0b',
      backgroundColor: '#f0fdf4',
      textColor: '#14532d',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-vintage-50th',
    name: 'Golden Vintage 50th',
    slug: 'vintage-50th',
    categoryId: 'cat-2',
    description: 'Noble golden background detailed with metallic gold fonts and stars.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#d4af37', // Vintage Gold
      secondaryColor: '#fbbf24',
      accentColor: '#78350f',
      backgroundColor: '#fffbeb', // Light Gold
      textColor: '#451a03',
      fontFamily: 'playfair'
    }
  },
  {
    id: 'tpl-birthday-gif',
    name: 'Animated Panda Celebration',
    slug: 'birthday-panda-gif',
    categoryId: 'cat-2',
    description: 'An adorable, interactive birthday template featuring cute animated panda gifs, floating hearts, and watercolor details.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#ec4899', // Pink
      secondaryColor: '#db2777',
      accentColor: '#f472b6',
      backgroundColor: '#fff1f2', // Warm rose background
      textColor: '#2c1b3d',
      fontFamily: 'greatvibes'
    }
  },

  // ANNIVERSARY CATEGORY (cat-3) - 5 Templates
  {
    id: 'tpl-silver-jubilee',
    name: 'Silver Jubilee',
    slug: 'silver-jubilee',
    categoryId: 'cat-3',
    description: 'Platinum silver leaf borders, classic dark navy fonts, and a premium clean layout.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#64748b', // Platinum Silver
      secondaryColor: '#1e3a8a',
      accentColor: '#94a3b8',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      fontFamily: 'playfair'
    }
  },
  {
    id: 'tpl-golden-50th',
    name: 'Golden Anniversary 50th',
    slug: 'golden-50th',
    categoryId: 'cat-3',
    description: 'Rich amber glow textures, metallic gold borders, and elegant serif headings.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#d4af37', // Gold
      secondaryColor: '#f59e0b',
      accentColor: '#b45309',
      backgroundColor: '#fffbeb',
      textColor: '#451a03',
      fontFamily: 'cormorant'
    }
  },
  {
    id: 'tpl-diamond-romance',
    name: 'Diamond Romance',
    slug: 'diamond-romance',
    categoryId: 'cat-3',
    description: 'Delicate light teal watercolor background matching silver outlines and sparkles.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#0ea5e9', // Teal Light
      secondaryColor: '#0284c7',
      accentColor: '#bae6fd',
      backgroundColor: '#f0f9ff',
      textColor: '#0c4a6e',
      fontFamily: 'greatvibes'
    }
  },
  {
    id: 'tpl-cozy-autumn',
    name: 'Cozy Autumn Love',
    slug: 'cozy-autumn',
    categoryId: 'cat-3',
    description: 'Warm burnt sienna gradients, dry maple leaf frames, and cozy serif fonts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#c2410c', // Sienna
      secondaryColor: '#ea580c',
      accentColor: '#fed7aa',
      backgroundColor: '#fff7ed',
      textColor: '#431407',
      fontFamily: 'playfair'
    }
  },
  {
    id: 'tpl-greenhouse-botanical',
    name: 'Greenhouse Botanical',
    slug: 'greenhouse-botanical',
    categoryId: 'cat-3',
    description: 'Eucalyptus leaf motifs, white wood borders, and vintage typewriter fonts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#166534', // Leaf Green
      secondaryColor: '#15803d',
      accentColor: '#bbf7d0',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      fontFamily: 'cormorant'
    }
  },

  // ENGAGEMENT CATEGORY (cat-4) - 4 Templates
  {
    id: 'tpl-champagne-ring',
    name: 'Champagne Ring Silhouette',
    slug: 'champagne-ring',
    categoryId: 'cat-4',
    description: 'Golden ring outlines overlaid on a classy dark charcoal background.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#d4af37', // Champagne
      secondaryColor: '#e2e8f0',
      accentColor: '#78350f',
      backgroundColor: '#f8fafc', // Light
      textColor: '#1e293b',
      fontFamily: 'playfair'
    }
  },
  {
    id: 'tpl-sage-minimal',
    name: 'Sage Minimalist Ring',
    slug: 'sage-minimal',
    categoryId: 'cat-4',
    description: 'Warm cream base matching sage green elements and clean sans fonts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#15803d', // Sage Green
      secondaryColor: '#475569',
      accentColor: '#cbd5e1',
      backgroundColor: '#f4fbf7',
      textColor: '#0f172a',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-rosy-bliss',
    name: 'Rosy Bliss Engagement',
    slug: 'rosy-bliss',
    categoryId: 'cat-4',
    description: 'Splashes of soft pink blush watercolor, floral frames, and script fonts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#ec4899', // Blush Rose
      secondaryColor: '#f43f5e',
      accentColor: '#fce7f3',
      backgroundColor: '#fff1f2',
      textColor: '#4c0519',
      fontFamily: 'greatvibes'
    }
  },
  {
    id: 'tpl-sunset-skyline',
    name: 'Sunset Skyline Toast',
    slug: 'sunset-skyline',
    categoryId: 'cat-4',
    description: 'Dusk purple horizon line sketches, perfect for city-top cocktail proposal announcements.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#6366f1', // Dusk Indigo
      secondaryColor: '#8b5cf6',
      accentColor: '#c7d2fe',
      backgroundColor: '#eef2ff', // Light Indigo
      textColor: '#312e81',
      fontFamily: 'sans'
    }
  },

  // BABY SHOWER CATEGORY (cat-5) - 4 Templates
  {
    id: 'tpl-teddy-bear',
    name: 'Cute Teddy Bear',
    slug: 'teddy-bear',
    categoryId: 'cat-5',
    description: 'Warm cream watercolor teddy bears, soft clouds, and brown round serif titles.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#b45309', // Teddy Brown
      secondaryColor: '#d97706',
      accentColor: '#fef3c7',
      backgroundColor: '#fdfbf7',
      textColor: '#451a03',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-moon-stars',
    name: 'Moon & Stars Cloud',
    slug: 'moon-stars',
    categoryId: 'cat-5',
    description: 'Soft papercraft style showing crescent moon, sleeping stars, and warm fonts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#fbbf24', // Star Yellow
      secondaryColor: '#f59e0b',
      accentColor: '#fef3c7',
      backgroundColor: '#eff6ff', // Light Blue
      textColor: '#1e3a8a',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-floral-girl',
    name: 'Floral Baby Girl',
    slug: 'floral-girl',
    categoryId: 'cat-5',
    description: 'Delicate light lavender watercolor bouquets, warm pink borders, and calligraphic titles.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#c084fc', // Lavender
      secondaryColor: '#f43f5e',
      accentColor: '#f3e8ff',
      backgroundColor: '#faf5ff',
      textColor: '#3b0764',
      fontFamily: 'greatvibes'
    }
  },
  {
    id: 'tpl-prince-carriage',
    name: 'Prince Carriage Blue',
    slug: 'prince-carriage',
    categoryId: 'cat-5',
    description: 'Royal carriage outlines, sky blue textures, and golden typography for baby boys.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#3b82f6', // Baby Blue
      secondaryColor: '#d4af37',
      accentColor: '#93c5fd',
      backgroundColor: '#eff6ff',
      textColor: '#1e3a8a',
      fontFamily: 'playfair'
    }
  },

  // PARTY / GALA CATEGORY (cat-6) - 3 Templates
  {
    id: 'tpl-neon-dance',
    name: 'Neon Dance Night',
    slug: 'neon-dance',
    categoryId: 'cat-6',
    description: 'Glow-in-the-dark magenta outlines and musical beats vectors set against indigo vaults.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#ec4899', // Neon Magenta
      secondaryColor: '#8b5cf6',
      accentColor: '#fbcfe8',
      backgroundColor: '#fdf4ff', // Light Pink
      textColor: '#701a75',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-black-tie',
    name: 'Black Tie Dinner Gala',
    slug: 'black-tie',
    categoryId: 'cat-6',
    description: 'Tuxedo-inspired theme detailed with sharp silver linings and premium modern serif fonts.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#1e293b', // Dark Slate
      secondaryColor: '#94a3b8',
      accentColor: '#475569',
      backgroundColor: '#f8fafc', // Light
      textColor: '#0f172a',
      fontFamily: 'cormorant'
    }
  },
  {
    id: 'tpl-summer-pool',
    name: 'Summer Cocktail Poolside',
    slug: 'summer-pool',
    categoryId: 'cat-6',
    description: 'Bright pool-water teal backdrop, yellow lemon vectors, and modern block headlines.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#06b6d4', // Teal Blue
      secondaryColor: '#f59e0b',
      accentColor: '#22d3ee',
      backgroundColor: '#ecfeff',
      textColor: '#083344',
      fontFamily: 'sans'
    }
  },
  {
    id: 'tpl-apology-watercolor',
    name: 'Watercolor Apology',
    slug: 'apology-watercolor',
    categoryId: 'cat-7',
    description: 'A soft watercolor card template to convey warm, heartfelt apologies.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/watercolor-couple.png',
    isPremium: false,
    theme: {
      primaryColor: '#ec4899',
      secondaryColor: '#64748b',
      accentColor: '#f472b6',
      backgroundColor: '#fff1f2',
      textColor: '#4c0519',
      fontFamily: 'greatvibes'
    }
  },
  {
    id: 'tpl-apology-letter',
    name: 'Apology Heartfelt Letter',
    slug: 'apology-letter',
    categoryId: 'cat-7',
    description: 'Clean typographic letter layout on vintage parchment paper to say I am sorry.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: true,
    theme: {
      primaryColor: '#475569',
      secondaryColor: '#94a3b8',
      accentColor: '#64748b',
      backgroundColor: '#fafaf9',
      textColor: '#1c1917',
      fontFamily: 'cormorant'
    }
  },
  {
    id: 'tpl-proposal-watercolor',
    name: 'Watercolor Proposal Double Seal',
    slug: 'proposal-watercolor',
    categoryId: 'cat-8',
    description: 'Immersive watercolor blend illustration with double-door curtain animations and gold wax seals.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/watercolor-couple.png',
    isPremium: true,
    theme: {
      primaryColor: '#b8942c',
      secondaryColor: '#db2777',
      accentColor: '#f472b6',
      backgroundColor: '#fafaf9',
      textColor: '#0f172a',
      fontFamily: 'playfair'
    }
  },
  {
    id: 'tpl-proposal-floral',
    name: 'Floral Gold Proposal',
    slug: 'proposal-floral',
    categoryId: 'cat-8',
    description: 'Premium proposal card template featuring rose gold floral vectors and a classic script format.',
    previewImage: '/placeholder-template.svg',
    bgImage: '/placeholder-template.svg',
    isPremium: false,
    theme: {
      primaryColor: '#f43f5e',
      secondaryColor: '#f472b6',
      accentColor: '#fda4af',
      backgroundColor: '#fff1f2',
      textColor: '#4c0519',
      fontFamily: 'greatvibes'
    }
  },
  {
    id: 'tpl-violet-butterfly',
    name: 'Royal Violet Butterfly Proposal',
    slug: 'violet-butterfly-proposal',
    categoryId: 'cat-8',
    description: 'Breathtaking template decorated with watercolor purple roses and floating violet butterflies.',
    previewImage: '/purple-flowers.png',
    bgImage: '/purple-flowers.png',
    isPremium: true,
    theme: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#7c3aed',
      accentColor: '#c084fc',
      backgroundColor: '#faf5ff',
      textColor: '#2e1065',
      fontFamily: 'greatvibes'
    }
  },
  {
    id: 'tpl-apology-butterfly',
    name: 'Lavender Butterfly Apology Letter',
    slug: 'apology-butterfly',
    categoryId: 'cat-7',
    description: 'Premium lavender apology card framed with watercolor purple roses and butterflies.',
    previewImage: '/purple-flowers.png',
    bgImage: '/purple-flowers.png',
    isPremium: false,
    theme: {
      primaryColor: '#7c3aed',
      secondaryColor: '#6d28d9',
      accentColor: '#a78bfa',
      backgroundColor: '#fbfbfe',
      textColor: '#2e1065',
      fontFamily: 'cormorant'
    }
  }
];
