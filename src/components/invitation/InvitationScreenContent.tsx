import React, { useState, useEffect, useRef } from 'react';
import { Invitation } from '../../mock/invitation';
import { CountdownTimer } from './CountdownTimer';
import { ScratchCard } from './ScratchCard';
import { FallingPetals } from './FallingPetals';
import { useEventStore } from '../../store/eventStore';
import { useNotificationStore } from '../../store/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTemplates } from '../../mock/templates';
import {
  Heart,
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  MapPin,
  Send,
  Sparkles,
  Maximize2,
  X,
  PartyPopper,
  Flower2,
  Cake,
  Baby,
  Diamond,
  Music,
  CheckCircle2,
  Check
} from 'lucide-react';
import { ApologyLayout } from './ApologyLayout';
import { ProposalLayout } from './ProposalLayout';
import { WeddingLayout } from './WeddingLayout';

interface InvitationScreenContentProps {
  invitation: Invitation;
  isPreviewMode?: boolean;
}

const isDarkBackground = (hexColor: string): boolean => {
  if (!hexColor || typeof hexColor !== 'string') return false;
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
};

// ── Audio Preset Library ─────────────────────────────────────────────────────
// Audio files are hosted locally in /public/audio/ for fast loading and
// zero external dependency. Swap with licensed tracks before going live.
export const AUDIO_PRESETS = [
  { id: 'romantic-acoustic-wedding-waltz', name: 'Elegant Wedding Waltz (Piano)',             url: '/audio/wedding-waltz.mp3' },
  { id: 'arabic-oud-duff',                 name: 'Arabic Oud & Duff (Nikkah/Islamic)',        url: '/audio/arabic-oud.mp3' },
  { id: 'arabic-romantic-oud',             name: '🌙 Arabic Romantic Oud (Love Song)',        url: '/audio/arabic-romantic-oud.mp3' },
  { id: 'arabic-flute-nay',               name: '🪗 Mystical Arabic Nay Flute (Sufi)',        url: '/audio/arabic-nay-flute.mp3' },
  { id: 'quran-nasheed-soft',             name: '🕌 Gentle Nasheed (Islamic Devotional)',     url: '/audio/nasheed-soft.mp3' },
  { id: 'arabic-violin-tarab',            name: '🎻 Tarab Arabic Violin (Romance)',           url: '/audio/arabic-tarab-violin.mp3' },
  { id: 'oriental-romantic-qanun',        name: '🎵 Oriental Qanun Romance (Eastern)',        url: '/audio/oriental-qanun.mp3' },
  { id: 'arabic-maqam-soul',              name: '✨ Maqam Soul Arabic Piano (Emotional)',     url: '/audio/arabic-maqam-piano.mp3' },
  { id: 'happy-birthday-party',            name: 'Happy Birthday Party (Joyful)',             url: '/audio/birthday-party.mp3' },
  { id: 'romantic-anniversary-violin',     name: 'Romantic Violin (Anniversary)',             url: '/audio/romantic-violin.mp3' },
  { id: 'baby-lullaby-aqiqah',             name: 'Gentle Baby Lullaby (Aqiqah/Shower)',      url: '/audio/baby-lullaby.mp3' },
  { id: 'lively-jazz-party-beats',         name: 'Lively Party Beats (Gala/Celebration)',    url: '/audio/jazz-party.mp3' },
  { id: 'enchanted-forest-ambient',        name: 'Enchanted Forest Ambient (Nature)',         url: '/audio/forest-ambient.mp3' },
  { id: 'boho-acoustic-folk',              name: 'Boho Acoustic Folk (Rustic/Bohemian)',      url: '/audio/boho-folk.mp3' },
  { id: 'retro-80s-synth',                 name: 'Retro Synth Pop (80s/Arcade)',              url: '/audio/retro-synth.mp3' },
  { id: 'neon-edm-party',                  name: 'Neon EDM Dance (Club/Party)',               url: '/audio/neon-edm.mp3' },
  { id: 'kids-playful-fun',                name: 'Kids Playful Fun (Carnival)',               url: '/audio/kids-fun.mp3' },
  { id: 'vintage-jazz-lounge',             name: 'Vintage Jazz Lounge (Classic)',             url: '/audio/vintage-jazz.mp3' },
  { id: 'classical-orchestral',            name: 'Classical Orchestral (Formal Gala)',        url: '/audio/classical-orchestra.mp3' },
  { id: 'coastal-chill-waves',             name: 'Coastal Chill Waves (Nautical/Beach)',      url: '/audio/coastal-chill.mp3' },
  { id: 'soft-romantic-strings',           name: 'Warm Romantic Strings (Proposal/Sorry)',    url: '/audio/soft-strings.mp3' },
  { id: 'mehndi-dhol-beats',               name: 'Mehndi Dhol Beats (Traditional)',           url: '/audio/mehndi-dhol.mp3' },
];

// ── Per-template sound lookup table ─────────────────────────────────────────
// Maps every template ID to the most fitting audio preset ID.
const TEMPLATE_SOUND_MAP: Record<string, string> = {
  // Wedding templates
  'tpl-royal-gold':           'romantic-acoustic-wedding-waltz',
  'tpl-enchanted-forest':     'enchanted-forest-ambient',
  'tpl-blossom-pink':         'romantic-acoustic-wedding-waltz',
  'tpl-boho-sunset':          'boho-acoustic-folk',
  'tpl-vintage-crimson':      'vintage-jazz-lounge',
  'tpl-minimal-ivory':        'classical-orchestral',
  'tpl-nautical-coastal':     'coastal-chill-waves',
  'tpl-greenhouse-botanical': 'enchanted-forest-ambient',
  'tpl-champagne-ring':       'soft-romantic-strings',
  'tpl-sage-minimal':         'classical-orchestral',
  'tpl-rosy-bliss':           'romantic-acoustic-wedding-waltz',
  'tpl-sunset-skyline':       'boho-acoustic-folk',
  'tpl-violet-butterfly':     'soft-romantic-strings',
  // Nikkah / Islamic templates
  'tpl-nikkah-emerald':       'arabic-oud-duff',
  'tpl-nikkah-persian':       'arabic-oud-duff',
  'tpl-mehndi-traditional':   'mehndi-dhol-beats',
  // Birthday templates
  'tpl-midnight-party':       'neon-edm-party',
  'tpl-retro-arcade':         'retro-80s-synth',
  'tpl-kids-carnival':        'kids-playful-fun',
  'tpl-sweet-16':             'lively-jazz-party-beats',
  'tpl-jungle-safari':        'kids-playful-fun',
  'tpl-birthday-gif':         'happy-birthday-party',
  'tpl-teddy-bear':           'kids-playful-fun',
  'tpl-moon-stars':           'baby-lullaby-aqiqah',
  'tpl-floral-girl':          'kids-playful-fun',
  'tpl-prince-carriage':      'kids-playful-fun',
  // Anniversary templates
  'tpl-vintage-50th':         'vintage-jazz-lounge',
  'tpl-silver-jubilee':       'classical-orchestral',
  'tpl-golden-50th':          'classical-orchestral',
  'tpl-diamond-romance':      'romantic-anniversary-violin',
  'tpl-cozy-autumn':          'boho-acoustic-folk',
  // Aqiqah / Baby Shower templates
  'tpl-moon-stars-aqiqah':    'baby-lullaby-aqiqah',
  // Party / Gala templates
  'tpl-neon-dance':           'neon-edm-party',
  'tpl-black-tie':            'vintage-jazz-lounge',
  'tpl-summer-pool':          'lively-jazz-party-beats',
  // Apology / Proposal templates
  'tpl-apology-watercolor':   'soft-romantic-strings',
  'tpl-apology-letter':       'soft-romantic-strings',
  'tpl-apology-butterfly':    'soft-romantic-strings',
  'tpl-proposal-watercolor':  'soft-romantic-strings',
  'tpl-proposal-floral':      'romantic-anniversary-violin',
};

export const getAudioUrl = (musicUrl?: string, categoryId?: string, templateId?: string): string => {
  // No audio requested
  if (!musicUrl || musicUrl === 'none') return '';

  // User-uploaded or external URL — return as-is
  if (musicUrl.startsWith('http://') || musicUrl.startsWith('https://')) return musicUrl;

  // Explicit preset chosen by user in the builder
  const explicitPreset = AUDIO_PRESETS.find((p) => p.id === musicUrl);
  if (explicitPreset) return explicitPreset.url;

  // ── Auto-resolve by template ID (highest priority fallback) ──────────────
  if (templateId) {
    const mappedId = TEMPLATE_SOUND_MAP[templateId];
    if (mappedId) {
      return AUDIO_PRESETS.find((p) => p.id === mappedId)?.url || '';
    }

    // Keyword-based fallback for templates not in the map
    const tid = templateId.toLowerCase();
    if (tid.includes('nikkah') || tid.includes('arabic') || tid.includes('islamic') || tid.includes('mehndi')) {
      return AUDIO_PRESETS.find((p) => p.id === 'arabic-oud-duff')?.url || '';
    }
    if (tid.includes('birthday') || tid.includes('kids') || tid.includes('carnival') || tid.includes('retro')) {
      return AUDIO_PRESETS.find((p) => p.id === 'happy-birthday-party')?.url || '';
    }
    if (tid.includes('party') || tid.includes('gala') || tid.includes('neon') || tid.includes('dance')) {
      return AUDIO_PRESETS.find((p) => p.id === 'neon-edm-party')?.url || '';
    }
    if (tid.includes('apology') || tid.includes('proposal') || tid.includes('letter')) {
      return AUDIO_PRESETS.find((p) => p.id === 'soft-romantic-strings')?.url || '';
    }
    if (tid.includes('vintage') || tid.includes('black-tie') || tid.includes('lounge')) {
      return AUDIO_PRESETS.find((p) => p.id === 'vintage-jazz-lounge')?.url || '';
    }
    if (tid.includes('forest') || tid.includes('botanical') || tid.includes('garden')) {
      return AUDIO_PRESETS.find((p) => p.id === 'enchanted-forest-ambient')?.url || '';
    }
    if (tid.includes('coastal') || tid.includes('nautical') || tid.includes('beach')) {
      return AUDIO_PRESETS.find((p) => p.id === 'coastal-chill-waves')?.url || '';
    }
  }

  // ── Category-level fallback ───────────────────────────────────────────────
  if (categoryId) {
    if (categoryId === 'cat-1') return AUDIO_PRESETS.find((p) => p.id === 'romantic-acoustic-wedding-waltz')?.url || '';
    if (categoryId === 'cat-2') return AUDIO_PRESETS.find((p) => p.id === 'happy-birthday-party')?.url || '';
    if (categoryId === 'cat-3') return AUDIO_PRESETS.find((p) => p.id === 'romantic-anniversary-violin')?.url || '';
    if (categoryId === 'cat-4') return AUDIO_PRESETS.find((p) => p.id === 'arabic-oud-duff')?.url || '';
    if (categoryId === 'cat-5') return AUDIO_PRESETS.find((p) => p.id === 'baby-lullaby-aqiqah')?.url || '';
    if (categoryId === 'cat-6') return AUDIO_PRESETS.find((p) => p.id === 'lively-jazz-party-beats')?.url || '';
    if (categoryId === 'cat-7') return AUDIO_PRESETS.find((p) => p.id === 'romantic-anniversary-violin')?.url || '';
    if (categoryId === 'cat-8') return AUDIO_PRESETS.find((p) => p.id === 'romantic-acoustic-wedding-waltz')?.url || '';
    if (categoryId === 'cat-9') return AUDIO_PRESETS.find((p) => p.id === 'soft-romantic-strings')?.url || '';
  }

  // Ultimate fallback
  return AUDIO_PRESETS[0].url;
};


const ScrollAnimate: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const InvitationScreenContent: React.FC<InvitationScreenContentProps> = ({
  invitation: propInvitation,
  isPreviewMode = false
}) => {
  const invitation = {
    ...propInvitation,
    title: propInvitation.title || (isPreviewMode ? 'Special Celebration' : ''),
    locationName: propInvitation.locationName || (isPreviewMode ? 'Venue Location Name' : ''),
    locationAddress: propInvitation.locationAddress || (isPreviewMode ? 'Venue Address details' : ''),
    eventTime: propInvitation.eventTime || (isPreviewMode ? '04:00 PM - 10:00 PM' : ''),
    bride: {
      ...propInvitation.bride,
      name: propInvitation.bride.name || (isPreviewMode ? 'Star Name' : ''),
      bio: propInvitation.bride.bio || (isPreviewMode ? 'This is the bio description details.' : ''),
      avatar: propInvitation.bride.avatar || ''
    },
    groom: {
      ...propInvitation.groom,
      name: propInvitation.groom.name || (isPreviewMode ? 'Partner Name' : ''),
      bio: propInvitation.groom.bio || (isPreviewMode ? 'This is the bio description details.' : ''),
      avatar: propInvitation.groom.avatar || ''
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-open envelope in preview mode
  useEffect(() => {
    if (isPreviewMode) {
      setIsOpen(true);
    }
  }, [isPreviewMode]);
  
  // RSVP Form states
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<'attending' | 'declined' | 'tentative'>('attending');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpFood, setRsvpFood] = useState<'standard' | 'vegetarian' | 'vegan' | 'halal' | 'kosher'>('standard');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const { addRSVP } = useEventStore();
  const { addToast } = useNotificationStore();

  const isIslamic =
    invitation.templateId.includes('nikkah') ||
    invitation.templateId.includes('mehndi') ||
    invitation.templateId.includes('arabic') ||
    invitation.title.toLowerCase().includes('nikkah') ||
    invitation.slug.toLowerCase().includes('nikkah');

  const isBirthday =
    invitation.categoryId === 'cat-2' ||
    invitation.templateId.includes('birthday') ||
    invitation.title.toLowerCase().includes('birthday');

  const isGifTemplate =
    invitation.templateId === 'tpl-birthday-gif' ||
    invitation.templateId.includes('gif');

  const isDark = isDarkBackground(invitation.themeColor.background);

  const fontClass = isIslamic ? 'font-amiri' : ({
    playfair: 'font-playfair',
    cormorant: 'font-cormorant',
    greatvibes: 'font-greatvibes',
    sans: 'font-sans',
    amiri: 'font-amiri'
  }[invitation.fontFamily] || 'font-playfair');

  // Dynamic layout classification logic — category-aware routing for unique openings per template type
  const getTemplateStyle = (templateId: string, categoryId: string) => {
    const tid = templateId.toLowerCase();

    // ── Keyword-first overrides (highest priority) ─────────────────────
    if (tid.includes('nikkah') || tid.includes('royal') || tid.includes('persian')) {
      return { envelope: 'curtain', layout: 'royal' };
    }
    if (tid.includes('apology') || tid.includes('letter')) {
      return { envelope: 'letter', layout: 'letter' };
    }
    if (tid.includes('corporate') || tid.includes('gala') || tid.includes('neon') || tid.includes('modern')) {
      return { envelope: 'sparkle', layout: 'glass-grid' };
    }

    // ── Category-based routing — every event type gets its own opening ──
    switch (categoryId) {
      case 'cat-1':  // Wedding       → Royal curtain
        return { envelope: 'curtain', layout: 'parallax' };
      case 'cat-2':  // Birthday      → Confetti burst
        return { envelope: 'confetti', layout: 'split-screen' };
      case 'cat-3':  // Anniversary   → Floral bloom
        return { envelope: 'floral', layout: 'parallax' };
      case 'cat-4':  // Engagement    → Sparkle reveal
        return { envelope: 'sparkle', layout: 'glass-grid' };
      case 'cat-5':  // Baby Shower   → Confetti pastel
        return { envelope: 'confetti', layout: 'letter' };
      case 'cat-6':  // Party/Gala    → Midnight sparkle
        return { envelope: 'sparkle', layout: 'glass-grid' };
      case 'cat-7':  // Apology       → Letter flap
        return { envelope: 'letter', layout: 'letter' };
      case 'cat-8':  // Proposal      → Floral bloom
        return { envelope: 'floral', layout: 'parallax' };
      default: {
        // Deterministic hash fallback
        let sum = 0;
        for (let i = 0; i < tid.length; i++) sum += tid.charCodeAt(i);
        const envelopes = ['classic', 'curtain', 'letter', 'confetti', 'floral', 'sparkle'] as const;
        const layouts = ['parallax', 'royal', 'letter', 'glass-grid', 'split-screen'] as const;
        return {
          envelope: envelopes[sum % envelopes.length],
          layout: layouts[sum % layouts.length]
        };
      }
    }
  };

  const { envelope: envelopeStyle, layout: layoutStyle } = getTemplateStyle(invitation.templateId, invitation.categoryId);

  // Sync background audio loop
  useEffect(() => {
    const resolvedUrl = getAudioUrl(invitation.musicUrl, invitation.categoryId, invitation.templateId);
    
    if (resolvedUrl) {
      audioRef.current = new Audio(resolvedUrl);
      audioRef.current.loop = true;
      
      if (musicPlaying && isOpen) {
        audioRef.current.play().catch((e) => console.log('Audio blocked', e));
      }
    } else {
      audioRef.current = null;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [invitation.musicUrl, invitation.categoryId, invitation.templateId, musicPlaying, isOpen]);

  // Sync play/pause changes
  useEffect(() => {
    if (audioRef.current) {
      if (musicPlaying && isOpen) {
        audioRef.current.play().catch((e) => console.log('Audio blocked', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicPlaying, isOpen]);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    setMusicPlaying(true);
    addToast('Opening digital card...', 'success');
  };

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) {
      addToast('Please enter your name.', 'error');
      return;
    }

    if (rsvpPhone.trim()) {
      const phoneRegex = /^[+]?[0-9\s\-()]{7,18}$/;
      if (!phoneRegex.test(rsvpPhone.trim())) {
        setPhoneError('Please enter a valid phone number (min 7 digits).');
        return;
      }
    }

    addRSVP(invitation.slug, {
      name: rsvpName,
      status: rsvpStatus,
      guestsCount: rsvpStatus === 'attending' ? rsvpGuests : 0,
      foodPreference: rsvpFood,
      message: rsvpMessage,
      phone: rsvpPhone
    });

    setRsvpSubmitted(true);
  };

  const handleAddToCalendar = () => {
    try {
      const dateObj = new Date(invitation.eventDate);
      const formatToGCal = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const start = formatToGCal(dateObj);
      const endDateObj = new Date(dateObj.getTime() + 3 * 60 * 60 * 1000); // 3 hours duration
      const end = formatToGCal(endDateObj);
      
      const text = encodeURIComponent(invitation.title);
      const dates = `${start}/${end}`;
      const location = encodeURIComponent(`${invitation.locationName}, ${invitation.locationAddress}`);
      const details = encodeURIComponent(`You are cordially invited to celebrate with us. Manage your RSVP on Invitely.`);
      
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
      addToast('Opening Google Calendar...', 'info');
    } catch (e) {
      addToast('Could not generate calendar link', 'error');
    }
  };

  const tpl = mockTemplates.find((t) => t.id === invitation.templateId);
  const bgImage = tpl?.bgImage;
  const overlayColor = isDark ? 'rgba(9, 13, 22, 0.93)' : 'rgba(253, 251, 247, 0.93)';

  const pageBgStyle = {
    backgroundColor: invitation.themeColor.background,
    color: invitation.themeColor.text,
    backgroundImage: bgImage ? `linear-gradient(${overlayColor}, ${overlayColor}), url(${bgImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    backgroundRepeat: 'repeat-y'
  };

  const cardStyle = {
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.08)',
    color: invitation.themeColor.text
  };

  const textMutedStyle = {
    color: isDark ? 'rgba(255, 255, 255, 0.55)' : 'rgba(15, 23, 42, 0.55)'
  };

  const textHighlightStyle = {
    color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(15, 23, 42, 0.75)'
  };

  const renderRSVPBox = () => {
    if (rsvpSubmitted) {
      return (
        <div className="p-8 rounded-3xl text-center space-y-4 animate-scale-in" style={{ ...cardStyle, borderColor: '#10b981' }}>
          <Sparkles className="w-8 h-8 text-emerald-500 mx-auto fill-current" />
          <div className="space-y-1">
            <h4 className="font-bold text-base text-emerald-600 dark:text-emerald-455">RSVP Submitted</h4>
            <p className="text-xs" style={textMutedStyle}>
              Thank you! Your response has been securely logged.
            </p>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleRSVPSubmit} className="p-6 rounded-3xl shadow-md text-left space-y-5" style={cardStyle}>
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Charlotte Green"
            value={rsvpName}
            onChange={(e) => setRsvpName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all"
            style={{
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#ffffff',
              color: isDark ? invitation.themeColor.text : '#0f172a',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)'
            }}
          />
        </div>

        <div>
          <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            placeholder="e.g., +1 (234) 567-8900"
            value={rsvpPhone}
            onChange={(e) => {
              setRsvpPhone(e.target.value);
              if (phoneError) setPhoneError(null);
            }}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
              phoneError ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'focus:ring-2 focus:ring-rose-500/20'
            }`}
            style={{
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#ffffff',
              color: isDark ? invitation.themeColor.text : '#0f172a',
              borderColor: phoneError ? '#ef4444' : (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)')
            }}
          />
          {phoneError && (
            <p className="mt-1 text-[10px] text-rose-500 font-semibold">{phoneError}</p>
          )}
        </div>

        <div>
          <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Attendance
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['attending', 'declined', 'tentative'] as const).map((status) => {
              const isSelected = rsvpStatus === status;
              const statusLabels = {
                attending: 'Attending',
                declined: 'Declined',
                tentative: 'Maybe'
              };
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setRsvpStatus(status)}
                  className="py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                  style={{
                    backgroundColor: isSelected
                      ? invitation.themeColor.primary
                      : (isDark ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc'),
                    borderColor: isSelected
                      ? invitation.themeColor.primary
                      : (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)'),
                    color: isSelected
                      ? (isDarkBackground(invitation.themeColor.primary) ? '#ffffff' : '#000000')
                      : invitation.themeColor.text
                  }}
                >
                  {statusLabels[status]}
                </button>
              );
            })}
          </div>
        </div>

        {rsvpStatus === 'attending' && (
          <div className="animate-scale-in">
            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Guests Count
            </label>
            <select
              value={rsvpGuests}
              onChange={(e) => setRsvpGuests(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all cursor-pointer"
              style={{
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#ffffff',
                color: isDark ? invitation.themeColor.text : '#0f172a',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)'
              }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Dietary Requirements
          </label>
          <select
            value={rsvpFood}
            onChange={(e) => setRsvpFood(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all cursor-pointer"
            style={{
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#ffffff',
              color: isDark ? invitation.themeColor.text : '#0f172a',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)'
            }}
          >
            {[
              { value: 'standard', label: 'Standard Menu' },
              { value: 'vegetarian', label: 'Vegetarian' },
              { value: 'vegan', label: 'Vegan' },
              { value: 'halal', label: 'Halal Menu' },
              { value: 'kosher', label: 'Kosher' }
            ].map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Greeting Message
          </label>
          <textarea
            rows={3}
            placeholder="Send warm wishes..."
            value={rsvpMessage}
            onChange={(e) => setRsvpMessage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all resize-none"
            style={{
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#ffffff',
              color: isDark ? invitation.themeColor.text : '#0f172a',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)'
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-transform hover:scale-[1.01]"
          style={{
            backgroundColor: invitation.themeColor.primary,
            color: isDarkBackground(invitation.themeColor.primary) ? '#ffffff' : '#000000'
          }}
        >
          <Send className="w-4 h-4" />
          Confirm RSVP
        </button>
      </form>
    );
  };

  const renderVignette = () => {
    const isButterfly = 
      invitation.templateId.includes('butterfly') || 
      invitation.title.toLowerCase().includes('butterfly') || 
      invitation.slug.toLowerCase().includes('butterfly');

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex flex-col justify-center items-center py-6 px-4 space-y-4"
      >
        <div 
          className="relative max-w-[200px] aspect-[4/5] overflow-hidden rounded-2xl border shadow-sm p-4"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, rgba(30, 27, 75, 0.2), rgba(15, 23, 42, 0.1))'
              : 'linear-gradient(to bottom, #ffffff, rgba(245, 243, 255, 0.35))',
            borderColor: isButterfly ? 'rgba(124, 58, 237, 0.25)' : 'rgba(244, 63, 94, 0.2)'
          }}
        >
          <img
            src={isButterfly ? '/purple-flowers.png' : '/watercolor-couple.png'}
            alt="Vignette Illustration"
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal opacity-95 drop-shadow-md"
          />
        </div>
        <p className="text-[10px] tracking-wider uppercase text-slate-400 font-bold italic" style={{ color: invitation.themeColor.primary }}>
          {isButterfly 
            ? 'Royal Violet Butterfly Edition' 
            : (invitation.categoryId === 'cat-8' ? 'The Marriage Proposal' : 'Bonded in Love')}
        </p>
      </motion.div>
    );
  };

  const renderGifBox = () => {
    if (!isGifTemplate) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-[320px] mx-auto p-5 bg-[#faf5f0] dark:bg-slate-900 border border-amber-200/40 rounded-[36px] shadow-lg relative flex flex-col items-center gap-3 select-none overflow-hidden my-4"
      >
        <img src="/gifs/flower.gif" className="absolute w-20 -left-6 bottom-2 opacity-50 pointer-events-none" alt="" />
        <img src="/gifs/flower.gif" className="absolute w-20 -right-6 bottom-2 opacity-50 pointer-events-none" alt="" />
        
        <div className="relative w-full h-36 bg-gradient-to-b from-white/90 to-rose-100 rounded-[28px] flex items-center justify-center shadow-inner">
          <img src="/gifs/second.gif" className="h-24 drop-shadow-md" alt="Happy Birthday Panda" />
        </div>
        
        <p className="text-[10px] text-amber-900 dark:text-amber-250 font-bold uppercase tracking-wider">Happy Celebration Time!</p>
      </motion.div>
    );
  };

  // ── Dedicated layouts for Apology, Proposal & Wedding (no envelope, no event details) ──
  if (invitation.categoryId === 'cat-7') {
    return (
      <div className="w-full h-full min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden" style={pageBgStyle}>
        <FallingPetals enabled={false} />
        {isPreviewMode && (
          <div className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center">
            <div className="absolute inset-0 bg-white/5" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, currentColor 80px, currentColor 82px)', color: invitation.themeColor.primary }} />
            <span className="relative text-6xl sm:text-8xl font-black uppercase tracking-[0.3em] opacity-[0.06] select-none" style={{ color: invitation.themeColor.primary, transform: 'rotate(-25deg)' }}>INVITELY</span>
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center py-10">
          <ApologyLayout invitation={invitation} fontClass={fontClass} isDark={isDark} />
        </div>
      </div>
    );
  }

  if (invitation.categoryId === 'cat-8') {
    return (
      <div className="w-full h-full min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden" style={pageBgStyle}>
        <FallingPetals enabled={false} />
        {isPreviewMode && (
          <div className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center">
            <div className="absolute inset-0 bg-white/5" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, currentColor 80px, currentColor 82px)', color: invitation.themeColor.primary }} />
            <span className="relative text-6xl sm:text-8xl font-black uppercase tracking-[0.3em] opacity-[0.06] select-none" style={{ color: invitation.themeColor.primary, transform: 'rotate(-25deg)' }}>INVITELY</span>
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center py-10">
          <ProposalLayout invitation={invitation} fontClass={fontClass} isDark={isDark} />
        </div>
      </div>
    );
  }

  if (invitation.categoryId === 'cat-1') {
    return (
      <div className="w-full h-full min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden" style={pageBgStyle}>
        <FallingPetals primaryColor={invitation.themeColor.primary} />
        {isPreviewMode && (
          <div className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center">
            <div className="absolute inset-0 bg-white/5" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, currentColor 80px, currentColor 82px)', color: invitation.themeColor.primary }} />
            <span className="relative text-6xl sm:text-8xl font-black uppercase tracking-[0.3em] opacity-[0.06] select-none" style={{ color: invitation.themeColor.primary, transform: 'rotate(-25deg)' }}>INVITELY</span>
          </div>
        )}
        <WeddingLayout
          invitation={invitation}
          fontClass={fontClass}
          isDark={isDark}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          musicPlaying={musicPlaying}
          setMusicPlaying={setMusicPlaying}
          handleAddToCalendar={handleAddToCalendar}
          renderRSVPBox={renderRSVPBox}
          lightboxImage={lightboxImage}
          setLightboxImage={setLightboxImage}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden" style={pageBgStyle}>
      
      {/* Guest Preview Watermark */}
      {isPreviewMode && (
        <div className="fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-white/5" />
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, currentColor 80px, currentColor 82px)',
              color: invitation.themeColor.primary
            }}
          />
          <span 
            className="relative text-6xl sm:text-8xl font-black uppercase tracking-[0.3em] opacity-[0.06] select-none"
            style={{ color: invitation.themeColor.primary, transform: 'rotate(-25deg)' }}
          >
            INVITELY
          </span>
        </div>
      )}

      {/* STYLE A: Wax Seal Envelope Reveal */}
      {envelopeStyle === 'classic' && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              key="envelope-classic"
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8 space-y-6"
              style={{
                backgroundColor: isDark ? invitation.themeColor.background : '#0b1329',
                backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 80%)'
              }}
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] tracking-widest text-amber-500 font-bold uppercase">You are Invited</span>
                <h1 className={`text-4xl sm:text-5xl text-white font-normal ${fontClass} leading-tight`}>
                  {invitation.title}
                </h1>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenEnvelope}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow-xl shadow-rose-950/50 flex items-center justify-center text-white relative group cursor-pointer border border-rose-450"
              >
                <div className="absolute inset-2.5 rounded-full border border-dashed border-rose-350/40 opacity-70 group-hover:rotate-45 transition-transform duration-700" />
                <Heart className="w-8 h-8 fill-current text-amber-100 animate-pulse" />
                <span className="absolute bottom-2.5 text-[8px] font-bold tracking-wider uppercase text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity">Open</span>
              </motion.button>

              <p className="text-slate-400 text-xs tracking-wide">Tap seal to open envelope</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* STYLE B: Royal Curtain Reveal */}
      {envelopeStyle === 'curtain' && (
        <AnimatePresence>
          {!isOpen && (
            <div className="absolute inset-0 z-50 flex overflow-hidden">
              {/* Left Pleated Velvet Curtain */}
              <motion.div
                exit={{ x: '-100%' }}
                transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
                className="w-1/2 h-full border-r border-amber-500/35 relative flex items-center justify-end shadow-inner"
                style={{
                  backgroundColor: '#3b0764', // Velvet violet base
                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.08) 12%, rgba(0,0,0,0.4) 25%, rgba(255,255,255,0.08) 38%, rgba(0,0,0,0.55) 50%, rgba(255,255,255,0.08) 62%, rgba(0,0,0,0.4) 75%, rgba(255,255,255,0.08) 88%, rgba(0,0,0,0.6) 100%)'
                }}
              />
              {/* Right Pleated Velvet Curtain */}
              <motion.div
                exit={{ x: '100%' }}
                transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
                className="w-1/2 h-full border-l border-amber-500/35 relative flex items-center justify-start shadow-inner"
                style={{
                  backgroundColor: '#3b0764',
                  backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.08) 12%, rgba(0,0,0,0.4) 25%, rgba(255,255,255,0.08) 38%, rgba(0,0,0,0.55) 50%, rgba(255,255,255,0.08) 62%, rgba(0,0,0,0.4) 75%, rgba(255,255,255,0.08) 88%, rgba(0,0,0,0.6) 100%)'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.button
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={handleOpenEnvelope}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-2xl border-4 border-amber-350 pointer-events-auto flex flex-col items-center justify-center cursor-pointer ring-4 ring-amber-500/25 animate-pulse"
                >
                  <Heart className="w-6 h-6 text-white fill-current animate-bounce" />
                  <span className="text-[8px] font-bold text-amber-100 tracking-widest mt-1 uppercase">REVEAL</span>
                </motion.button>
              </div>
            </div>
          )}
        </AnimatePresence>
      )}

      {/* STYLE C: Letter Flap Reveal */}
      {envelopeStyle === 'letter' && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 z-50 bg-[#f4f3ee] dark:bg-slate-950 flex flex-col items-center justify-center p-8 space-y-6"
            >
              <div className="relative w-80 aspect-[4/3] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl flex flex-col justify-between p-6">
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-slate-100 to-transparent dark:from-slate-800/40 rounded-t-xl pointer-events-none border-b border-dashed border-slate-200/60 dark:border-slate-700/60" />
                
                <div className="text-center space-y-2 mt-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Heartfelt Invitation</span>
                  <h3 className={`text-xl font-bold ${fontClass} leading-tight text-slate-800 dark:text-slate-100`}>{invitation.title}</h3>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleOpenEnvelope}
                  className="mx-auto w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md cursor-pointer border border-rose-400 z-10"
                >
                  <Heart className="w-5 h-5 fill-current animate-bounce" />
                </motion.button>
                <span className="text-[9px] uppercase tracking-wider text-center text-slate-455 font-bold">Tap heart to read letter</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* STYLE D: Confetti Burst Reveal (Birthday / Baby Shower) */}
      {envelopeStyle === 'confetti' && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              key="envelope-confetti"
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 overflow-hidden"
              style={{
                background: invitation.categoryId === 'cat-5'
                  ? 'linear-gradient(135deg, #fdf2f8 0%, #ede9fe 50%, #dbeafe 100%)'
                  : 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #ede9fe 100%)'
              }}
            >
              {/* Animated confetti particles */}
              {Array.from({ length: 24 }).map((_, i) => {
                const colors = ['#f43f5e', '#eab308', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];
                const left = (i * 4.2) % 100;
                const delay = (i * 0.15) % 2;
                const size = 6 + (i % 4) * 3;
                const rot = (i * 37) % 360;
                return (
                  <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 0, rotate: 0 }}
                    animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: rot + 360 }}
                    transition={{ duration: 2.5 + (i % 3) * 0.5, delay, repeat: Infinity, ease: 'linear' }}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${left}%`,
                      width: size,
                      height: size,
                      borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '0',
                      backgroundColor: colors[i % colors.length],
                      transform: `rotate(${rot}deg)`
                    }}
                  />
                );
              })}

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="text-center space-y-4 z-10"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                  {invitation.categoryId === 'cat-5' ? <Baby className="w-8 h-8 text-pink-400" /> : <Cake className="w-8 h-8 text-amber-400" />}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest font-bold uppercase" style={{ color: invitation.themeColor.primary }}>
                    {invitation.categoryId === 'cat-5' ? 'A Little Miracle' : 'Happy Birthday'}
                  </span>
                  <h1 className={`text-3xl sm:text-4xl ${fontClass}`} style={{ color: invitation.themeColor.primary }}>
                    {invitation.title}
                  </h1>
                </div>
              </motion.div>

              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenEnvelope}
                className="mt-6 px-8 py-3.5 rounded-full text-sm font-bold text-white shadow-xl cursor-pointer z-10 border-2 border-white/30"
                style={{ background: `linear-gradient(135deg, ${invitation.themeColor.primary}, ${invitation.themeColor.secondary || invitation.themeColor.primary})` }}
              >
                <PartyPopper className="w-4 h-4 mr-1.5" />
                Open Celebration
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* STYLE E: Floral Bloom Reveal (Anniversary / Proposal / Romantic) */}
      {envelopeStyle === 'floral' && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              key="envelope-floral"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-50 bg-gradient-to-b from-[#1a0a1e] via-[#0f0a1a] to-[#1a0a1e] flex flex-col items-center justify-center p-8 overflow-hidden"
            >
              {/* Floating petal particles */}
              {Array.from({ length: 18 }).map((_, i) => {
                const left = 5 + (i * 5.5) % 90;
                const delay = (i * 0.3) % 3;
                const size = 12 + (i % 3) * 6;
                return (
                  <motion.div
                    key={i}
                    initial={{ y: '80vh', opacity: 0, x: 0 }}
                    animate={{ y: '-10vh', opacity: [0, 0.8, 0.8, 0], x: Math.sin(i) * 30 }}
                    transition={{ duration: 4 + (i % 2), delay, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute pointer-events-none"
                    style={{ left: `${left}%` }}
                  >
                    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 0C10 0 12 4 10 8C8 4 10 0 10 0ZM10 0C10 0 14 2 12 6C10 2 10 0 10 0ZM10 20C10 20 8 16 10 12C12 16 10 20 10 20ZM0 10C0 10 4 8 8 10C4 12 0 10 0 10ZM20 10C20 10 16 12 12 10C16 8 20 10 20 10Z"
                        fill={i % 3 === 0 ? '#fda4af' : i % 3 === 1 ? '#c084fc' : '#fdba74'}
                        opacity="0.6"
                      />
                    </svg>
                  </motion.div>
                );
              })}

              {/* Center bloom */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.1 }}
                className="relative z-10 text-center space-y-5"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-28 h-28 mx-auto rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, rgba(192,132,252,0.1) 60%, transparent 100%)',
                    border: '1px solid rgba(244,63,94,0.2)'
                  }}
                >
                  <Heart className="w-10 h-10 text-rose-400 fill-rose-400/20" />
                </motion.div>

                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest font-bold uppercase text-rose-400/80">
                    {invitation.categoryId === 'cat-8' ? 'A Question from the Heart' : 'Celebrating Love'}
                  </span>
                  <h1 className={`text-3xl sm:text-4xl ${fontClass} text-rose-100`}>
                    {invitation.title}
                  </h1>
                </div>

                <p className="text-xs text-rose-300/60 italic max-w-xs mx-auto">
                  {invitation.categoryId === 'cat-8'
                    ? 'Someone special has a question for you...'
                    : 'Every love story is beautiful, but ours is our favorite.'}
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.08, boxShadow: '0 0 30px rgba(244,63,94,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenEnvelope}
                className="mt-4 px-8 py-3 rounded-full text-sm font-bold text-white shadow-xl cursor-pointer z-10 bg-gradient-to-r from-rose-500 to-pink-600 border border-rose-400/30"
              >
                <Flower2 className="w-4 h-4 mr-1.5" />
                Unveil Our Story
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* STYLE F: Midnight Sparkle Reveal (Engagement / Modern Gala) */}
      {envelopeStyle === 'sparkle' && (
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              key="envelope-sparkle"
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0 z-50 bg-[#050a18] flex flex-col items-center justify-center p-8 overflow-hidden"
            >
              {/* Twinkling stars */}
              {Array.from({ length: 30 }).map((_, i) => {
                const left = (i * 3.3) % 100;
                const top = (i * 3.7) % 100;
                const size = 1.5 + (i % 3);
                const delay = (i * 0.2) % 4;
                return (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.5 + (i % 2), delay, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: size,
                      height: size,
                      backgroundColor: i % 4 === 0 ? '#eab308' : i % 4 === 1 ? '#c084fc' : i % 4 === 2 ? '#f472b6' : '#ffffff'
                    }}
                  />
                );
              })}

              {/* Shooting star */}
              <motion.div
                animate={{ x: ['-20vw', '120vw'], y: ['-10vh', '50vh'] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 4, ease: 'easeIn' }}
                className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(234,179,8,0.6)] pointer-events-none"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative z-10 text-center space-y-5"
              >
                <motion.div
                  animate={{ boxShadow: ['0 0 20px rgba(234,179,8,0.2)', '0 0 40px rgba(234,179,8,0.5)', '0 0 20px rgba(234,179,8,0.2)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 mx-auto rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-amber-500/5"
                >
                  <Diamond className="w-8 h-8 text-amber-400" />
                </motion.div>

                <div className="space-y-1">
                  <span className="text-[10px] tracking-widest font-bold uppercase text-amber-400/80">Exclusive Invitation</span>
                  <h1 className={`text-3xl sm:text-4xl ${fontClass} text-white`}>
                    {invitation.title}
                  </h1>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/40" />
                  <Sparkles className="w-3.5 h-3.5 text-amber-500/60" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/40" />
                </div>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.08, boxShadow: '0 0 30px rgba(234,179,8,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenEnvelope}
                className="mt-4 px-8 py-3 rounded-full text-sm font-bold shadow-xl cursor-pointer z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-400/30"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Reveal Invitation
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Floating Audio controller — fixed to viewport so it stays visible while scrolling */}
      {isOpen && getAudioUrl(invitation.musicUrl, invitation.categoryId, invitation.templateId) && (
        <motion.button
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={() => setMusicPlaying(!musicPlaying)}
          className="fixed bottom-6 right-4 z-[9999] px-3.5 py-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 cursor-pointer select-none"
          title={musicPlaying ? 'Mute Background Music' : 'Play Background Music'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {musicPlaying ? (
              <motion.div key="mute" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-rose-500 animate-bounce" />
                <span className="text-[9px] font-bold tracking-wider uppercase">Mute</span>
              </motion.div>
            ) : (
              <motion.div key="play" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} className="flex items-center gap-1.5">
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="text-[9px] font-bold tracking-wider uppercase">Play</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      {/* Main card panels content */}
      {isOpen && (
        <div className="flex-grow">
          {/* Falling Flower Petals Animation Canvas */}
          <FallingPetals primaryColor={invitation.themeColor.primary} />
          
          {/* ---------------------------------------------------- */}
          {/* LAYOUT 1: Gold arabesque framed center-scroll (Royal) */}
          {layoutStyle === 'royal' && (
            <div className="max-w-md mx-auto my-6 p-6 rounded-3xl border-4 border-double border-amber-500/40 relative bg-slate-950 text-white space-y-12 shadow-2xl">
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-500/65" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-500/65" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-500/65" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-500/65" />
              
              <ScrollAnimate className="text-center space-y-4 pt-6">
                {isIslamic ? (
                  <div className="space-y-2">
                    <p className="font-amiri text-3xl text-amber-400 font-bold leading-relaxed" dir="rtl" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    <p className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">In the Name of Allah, the Most Gracious, the Most Merciful</p>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-amber-500/45 mx-auto flex items-center justify-center text-amber-400 font-serif italic text-lg shadow-inner">
                    {isBirthday ? invitation.bride.name[0] : `${invitation.bride.name[0]}${invitation.groom.name[0]}`}
                  </div>
                )}
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  {isBirthday ? 'Happy Birthday' : 'Save the Date'}
                </span>
                <h1 className={`text-3xl sm:text-4xl ${fontClass}`} style={{ color: invitation.themeColor.primary }}>
                  {isBirthday ? invitation.bride.name : `${invitation.bride.name} & ${invitation.groom.name}`}
                </h1>
                {renderGifBox()}
                <p className="text-[11px] text-slate-400 italic max-w-xs mx-auto">
                  {isBirthday ? 'Please join us in celebrating this wonderful birthday occasion.' : 'We request the honor of your presence to celebrate our marriage.'}
                </p>
                <div className="text-amber-500/40 text-sm">❦ ❦ ❦</div>
              </ScrollAnimate>

              <ScrollAnimate delay={0.1}>{renderVignette()}</ScrollAnimate>

              <ScrollAnimate delay={0.15} className="space-y-4">
                <div className="p-4 rounded-xl border border-amber-500/25 bg-slate-900/50 text-center space-y-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400">Wedding Date Reveal</span>
                  <ScratchCard
                    revealText={new Date(invitation.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    themeColor={invitation.themeColor}
                    onReveal={() => addToast('Event date revealed!', 'success')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-900/40 text-center space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400">Time</span>
                    <p className="text-xs font-bold">{invitation.eventTime}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-900/40 text-center space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400">Venue</span>
                    <p className="text-[10px] font-bold truncate">{invitation.locationName}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/25 bg-slate-900/50 text-center space-y-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400">Days Remaining</span>
                  <div className="flex items-center justify-center">
                    <CountdownTimer targetDate={invitation.eventDate} themeColor={invitation.themeColor} />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/25 bg-slate-900/50 text-center space-y-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400">Venue Details</span>
                  <p className="text-[11px] text-slate-400 leading-normal">{invitation.locationAddress}</p>
                  {invitation.locationMapsUrl && (
                    <div className="pt-1.5">
                      <a
                        href={invitation.locationMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 text-[8px] font-bold uppercase tracking-wider text-amber-400 hover:bg-amber-500/10 transition-colors shadow-sm"
                      >
                        <MapPin className="w-2.5 h-2.5" />
                        Navigate on Maps
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleAddToCalendar}
                    className="px-5 py-2 rounded-full border border-amber-500/30 text-[9px] font-bold uppercase tracking-wider text-amber-400 hover:bg-amber-500/10 transition-colors shadow-sm cursor-pointer select-none"
                  >
                    Add to Calendar
                  </button>
                </div>
              </ScrollAnimate>

              <ScrollAnimate delay={0.2} className="pt-6 border-t border-amber-500/20">
                <h3 className={`text-xl text-center italic mb-4 ${fontClass}`} style={{ color: invitation.themeColor.primary }}>
                  Will You Attend?
                </h3>
                {renderRSVPBox()}
              </ScrollAnimate>
              {/* Credit Footer */}
              <div className="w-full py-6 text-center space-y-1.5 border-t border-amber-500/15 mt-6">
                <p className="text-[9px] tracking-wider uppercase font-semibold text-slate-500">
                  Made with Love on <span className="font-playfair italic text-rose-400 font-bold">Invitely</span>
                </p>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest leading-none">
                  Crafted by <a href="https://nextorastudio.tech" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-rose-400 transition-colors">Salah Uddin Kader</a> & Nextora Studio
                </p>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* LAYOUT 2: Clean Vintage letter format (Letter) */}
          {layoutStyle === 'letter' && (
            <div className="max-w-md mx-auto my-6 p-8 rounded-2xl bg-[#faf9f6] text-stone-900 border border-stone-200 shadow-md space-y-8 font-serif leading-relaxed relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-stone-150 to-transparent pointer-events-none rounded-tr-2xl" />
              
              <ScrollAnimate className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block text-center">Heartfelt Invitation Letter</span>
                <h1 className={`text-2xl font-bold font-playfair text-center ${fontClass}`} style={{ color: invitation.themeColor.primary }}>
                  {invitation.title}
                </h1>
                <div className="border-b border-stone-200 w-12 mx-auto" />
              </ScrollAnimate>

              <ScrollAnimate delay={0.1} className="space-y-4 text-sm text-stone-850 text-left font-cormorant leading-relaxed">
                <p>Dearest Guest,</p>
                <p>
                  We are delighted to share the coordinates of our upcoming event. Every moment is a memory we hold close, 
                  and we request the pleasure of your presence to witness our vows and walk with us into a new beginning.
                </p>
                {invitation.categoryId === 'cat-7' && (
                  <p className="italic text-rose-800 font-semibold bg-rose-50 p-4 rounded-xl border border-rose-100">
                    "Please accept my sincere apologies. Every flower here stands for a memory we cherish. Let's make things right."
                  </p>
                )}
                {renderGifBox()}
                <p className="text-right italic font-bold mt-4">
                  — Sincerely, {isBirthday ? invitation.bride.name.split(' ')[0] : `${invitation.bride.name.split(' ')[0]} & ${invitation.groom.name.split(' ')[0]}`}
                </p>
              </ScrollAnimate>

              <ScrollAnimate delay={0.15}>{renderVignette()}</ScrollAnimate>

              <ScrollAnimate delay={0.2} className="space-y-4 text-stone-850 pt-4 border-t border-stone-200">
                <div className="p-4 rounded-xl border border-stone-200 bg-white text-center space-y-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400">Scratch to Reveal Date</span>
                  <ScratchCard
                    revealText={new Date(invitation.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    themeColor={{
                      primary: '#a78bfa',
                      secondary: '#7c3aed',
                      background: '#ffffff',
                      text: '#1c1917'
                    }}
                    onReveal={() => addToast('Event date revealed!', 'success')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-stone-200 bg-white text-center">
                    <span className="text-[9px] uppercase font-bold tracking-widest block text-stone-450">Time</span>
                    <span className="font-bold">{invitation.eventTime}</span>
                  </div>
                  <div className="p-3 rounded-xl border border-stone-200 bg-white text-center flex items-center justify-center">
                    <CountdownTimer targetDate={invitation.eventDate} themeColor={{
                      primary: '#ef4444',
                      text: '#1c1917'
                    }} />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-white text-center space-y-1.5">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400">Location Coordinates</span>
                  <p className="font-bold text-xs">{invitation.locationName}</p>
                  <p className="text-[11px] text-stone-500 leading-normal">{invitation.locationAddress}</p>
                  {invitation.locationMapsUrl && (
                    <div className="pt-1.5">
                      <a
                        href={invitation.locationMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-stone-300 text-[8px] font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-100 transition-colors shadow-sm"
                      >
                        <MapPin className="w-2.5 h-2.5 text-stone-500" />
                        Navigate on Maps
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleAddToCalendar}
                    className="px-5 py-2 rounded-full border border-stone-300 text-[9px] font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-50 transition-colors shadow-sm cursor-pointer select-none"
                  >
                    Add to Calendar
                  </button>
                </div>
              </ScrollAnimate>

              <ScrollAnimate delay={0.25} className="pt-6 border-t border-stone-200">
                <h3 className="text-lg text-center font-playfair italic mb-4">
                  Will You Attend?
                </h3>
                {renderRSVPBox()}
              </ScrollAnimate>
              {/* Credit Footer */}
              <div className="w-full py-6 text-center space-y-1.5 border-t border-stone-200 mt-6">
                <p className="text-[9px] tracking-wider uppercase font-semibold text-stone-400">
                  Made with Love on <span className="font-playfair italic text-rose-400 font-bold">Invitely</span>
                </p>
                <p className="text-[8px] text-stone-400 uppercase tracking-widest leading-none">
                  Crafted by <a href="https://nextorastudio.tech" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-rose-400 transition-colors">Salah Uddin Kader</a> & Nextora Studio
                </p>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* LAYOUT 3: Glassmorphic Floating Cards Grid (Modern/Neon) */}
          {layoutStyle === 'glass-grid' && (
            <div 
              className="w-full min-h-screen relative p-6 space-y-8 flex flex-col justify-start"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${invitation.coverPhoto || invitation.gallery[0] || ''})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
              }}
            >
              {/* Main glowing glass card */}
              <ScrollAnimate className="max-w-md mx-auto w-full bg-white/10 dark:bg-black/35 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-3xl p-6 text-center space-y-6 shadow-2xl text-white">
                <span className="text-[9px] uppercase font-bold tracking-widest text-violet-300">Modern Invitation</span>
                <h1 className={`text-4xl ${fontClass}`} style={{ color: invitation.themeColor.primary }}>
                  {invitation.title}
                </h1>
                
                <div className="flex justify-center">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
                </div>

                {isBirthday ? (
                  <div className="flex justify-center items-center">
                    <div className="text-center">
                      <img src={invitation.bride.avatar} alt="Birthday Star" className="w-20 h-20 rounded-full border-2 border-white/30 mx-auto object-cover" />
                      <span className="text-sm font-bold block mt-2">{invitation.bride.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-6">
                    <div className="text-center">
                      <img src={invitation.bride.avatar} alt="Bride" className="w-16 h-16 rounded-full border-2 border-white/30 mx-auto object-cover" />
                      <span className="text-xs font-bold block mt-1">{invitation.bride.name.split(' ')[0]}</span>
                    </div>
                    <Heart className="w-5 h-5 text-rose-500 fill-current" />
                    <div className="text-center">
                      <img src={invitation.groom.avatar} alt="Groom" className="w-16 h-16 rounded-full border-2 border-white/30 mx-auto object-cover" />
                      <span className="text-xs font-bold block mt-1">{invitation.groom.name.split(' ')[0]}</span>
                    </div>
                  </div>
                )}
                {renderGifBox()}
              </ScrollAnimate>

              <ScrollAnimate delay={0.1}>{renderVignette()}</ScrollAnimate>

              {/* Coordinates floating card */}
              <ScrollAnimate delay={0.15} className="max-w-md mx-auto w-full bg-white/10 dark:bg-black/35 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-3xl p-6 space-y-4 text-white">
                <div className="text-center space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-violet-350">Event Schedule</span>
                  <ScratchCard
                    revealText={new Date(invitation.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    themeColor={{
                      primary: '#c084fc',
                      secondary: '#8b5cf6',
                      background: 'rgba(0,0,0,0.5)',
                      text: '#ffffff'
                    }}
                    onReveal={() => addToast('Event date revealed!', 'success')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-[8px] uppercase tracking-wider block text-violet-300">Time</span>
                    <span className="text-xs font-bold">{invitation.eventTime}</span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-[8px] uppercase tracking-wider block text-violet-300">Venue</span>
                    <span className="text-xs font-bold block truncate">{invitation.locationName}</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center space-y-2">
                  <span className="text-[8px] uppercase tracking-wider block text-violet-300">Remaining Time</span>
                  <div className="flex items-center justify-center">
                    <CountdownTimer targetDate={invitation.eventDate} themeColor={{
                      primary: '#c084fc',
                      text: '#ffffff'
                    }} />
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-center space-y-1.5">
                  <span className="text-[8px] uppercase tracking-wider block text-violet-300 font-bold">Venue Address</span>
                  <span className="text-[10px] text-slate-300 block">{invitation.locationAddress}</span>
                  {invitation.locationMapsUrl && (
                    <div className="pt-1">
                      <a
                        href={invitation.locationMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[8px] font-bold uppercase tracking-wider text-violet-350 hover:bg-white/10 transition-colors shadow-sm"
                      >
                        <MapPin className="w-2.5 h-2.5 text-violet-400" />
                        Navigate on Maps
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleAddToCalendar}
                    className="px-5 py-2 rounded-full border border-white/20 bg-white/5 text-[9px] font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors shadow-sm cursor-pointer select-none"
                  >
                    Add to Calendar
                  </button>
                </div>
              </ScrollAnimate>

              {/* RSVP Form Card */}
              <ScrollAnimate delay={0.2} className="max-w-md mx-auto w-full">
                {renderRSVPBox()}
              </ScrollAnimate>
              {/* Credit Footer */}
              <div className="max-w-md mx-auto w-full py-8 text-center space-y-1.5 border-t border-white/10 mt-8">
                <p className="text-[9px] tracking-wider uppercase font-semibold text-white/50">
                  Made with Love on <span className="font-playfair italic text-rose-400 font-bold">Invitely</span>
                </p>
                <p className="text-[8px] text-white/40 uppercase tracking-widest leading-none">
                  Crafted by <a href="https://nextorastudio.tech" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-rose-400 transition-colors">Salah Uddin Kader</a> & Nextora Studio
                </p>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* LAYOUT 4: Split Screen Wave Layout (Split Screen) */}
          {layoutStyle === 'split-screen' && (
            <div className="w-full flex flex-col relative bg-white dark:bg-slate-950">
              {/* Fixed Left Cover Column */}
              <div 
                className="w-full h-[360px] bg-slate-900 text-white flex flex-col justify-end p-8 relative"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.85)), url(${invitation.coverPhoto || invitation.gallery[0] || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="space-y-2 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-350">Invitation</span>
                  <h1 className={`text-3xl ${fontClass} leading-tight text-white`}>{invitation.title}</h1>
                  <p className="text-[11px] text-slate-200">A special celebration of love, life, and family.</p>
                </div>
              </div>

              {/* Scrollable Right Details Column */}
              <div className="w-full p-6 space-y-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                <ScrollAnimate className="text-center space-y-6">
                  <h2 className={`text-2xl ${fontClass} italic`} style={{ color: invitation.themeColor.primary }}>
                    {isBirthday ? 'Birthday Star' : 'The Ceremony'}
                  </h2>
                  {isBirthday ? (
                    <div className="flex justify-center">
                      <div className="text-center space-y-2">
                        <img src={invitation.bride.avatar} alt="Birthday Star" className="w-20 h-20 rounded-full mx-auto object-cover border-2 shadow-md" style={{ borderColor: invitation.themeColor.primary }} />
                        <div>
                          <h4 className="font-bold text-sm">{invitation.bride.name}</h4>
                          <p className="text-[10px] text-slate-400 block mt-0.5">{invitation.bride.parentGroomBride}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <img src={invitation.bride.avatar} alt="Bride" className="w-16 h-16 rounded-full mx-auto object-cover border-2 shadow-sm" style={{ borderColor: invitation.themeColor.primary }} />
                        <h4 className="font-bold text-xs mt-2">{invitation.bride.name.split(' ')[0]}</h4>
                        <p className="text-[9px] text-slate-400 block mt-0.5">{invitation.bride.parentGroomBride}</p>
                      </div>
                      <div className="text-center">
                        <img src={invitation.groom.avatar} alt="Groom" className="w-16 h-16 rounded-full mx-auto object-cover border-2 shadow-sm" style={{ borderColor: invitation.themeColor.primary }} />
                        <h4 className="font-bold text-xs mt-2">{invitation.groom.name.split(' ')[0]}</h4>
                        <p className="text-[9px] text-slate-400 block mt-0.5">{invitation.groom.parentGroomBride}</p>
                      </div>
                    </div>
                  )}
                  {renderGifBox()}
                </ScrollAnimate>

                <ScrollAnimate delay={0.1}>{renderVignette()}</ScrollAnimate>

                {/* Event particulars */}
                <ScrollAnimate delay={0.15} className="space-y-4">
                  <div className="p-4 rounded-2xl border" style={cardStyle}>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block text-center mb-2">Scratch to Reveal Date</span>
                    <ScratchCard
                      revealText={new Date(invitation.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      themeColor={invitation.themeColor}
                      onReveal={() => addToast('Event date revealed!', 'success')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-4 rounded-2xl border flex flex-col justify-center items-center" style={cardStyle}>
                      <span className="text-[8px] uppercase tracking-wider block text-slate-400">Time</span>
                      <span className="text-xs font-bold">{invitation.eventTime}</span>
                    </div>
                    <div className="p-4 rounded-2xl border flex flex-col justify-center items-center" style={cardStyle}>
                      <span className="text-[8px] uppercase tracking-wider block text-slate-400">Venue</span>
                      <span className="text-xs font-bold block truncate">{invitation.locationName}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border text-center space-y-2" style={cardStyle}>
                    <span className="text-[8px] uppercase tracking-wider block text-slate-400">Time Remaining</span>
                    <div className="flex items-center justify-center">
                      <CountdownTimer targetDate={invitation.eventDate} themeColor={invitation.themeColor} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border text-center space-y-1.5" style={cardStyle}>
                    <span className="text-[8px] uppercase tracking-wider block text-slate-400">Venue Address</span>
                    <span className="text-[10px] text-slate-450 block">{invitation.locationAddress}</span>
                    {invitation.locationMapsUrl && (
                      <div className="pt-1">
                        <a
                          href={invitation.locationMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[8px] font-bold uppercase tracking-wider transition-opacity hover:opacity-85 shadow-sm"
                          style={{ borderColor: invitation.themeColor.primary, color: invitation.themeColor.text }}
                        >
                          <MapPin className="w-2.5 h-2.5 text-rose-550" />
                          Navigate on Maps
                        </a>
                      </div>
                    )}
                  </div>
                </ScrollAnimate>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleAddToCalendar}
                    className="px-5 py-2 rounded-full border text-[9px] font-bold uppercase tracking-wider transition-opacity hover:opacity-85 shadow-sm cursor-pointer select-none"
                    style={{ borderColor: invitation.themeColor.primary, color: invitation.themeColor.text }}
                  >
                    Add to Calendar
                  </button>
                </div>

                {/* RSVP section */}
                <ScrollAnimate delay={0.2} className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg text-center italic mb-4 font-playfair">Will You Attend?</h3>
                  {renderRSVPBox()}
                </ScrollAnimate>
                {/* Credit Footer */}
                <div className="w-full py-6 text-center space-y-1.5 border-t border-slate-100 dark:border-slate-800 mt-6">
                  <p className="text-[9px] tracking-wider uppercase font-semibold text-slate-400">
                    Made with Love on <span className="font-playfair italic text-rose-500 font-bold">Invitely</span>
                  </p>
                  <p className="text-[8px] text-slate-400 uppercase tracking-widest leading-none">
                    Crafted by <a href="https://nextorastudio.tech" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-rose-400 transition-colors">Salah Uddin Kader</a> & Nextora Studio
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* LAYOUT 5: Parallax Cover Visual Scroll Layout (Default) */}
          {layoutStyle === 'parallax' && (
            <div className="space-y-16 pb-20">
              <section className="relative aspect-[3/4] sm:aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={invitation.coverPhoto || invitation.gallery[0] || ''}
                  alt="Cover Photo"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
                
                <div className="absolute bottom-10 left-6 right-6 text-center text-white space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                    Save the Date
                  </span>
                  <h2 className={`text-4xl sm:text-6xl ${fontClass} font-normal text-amber-100`}>
                    {invitation.bride.name.split(' ')[0]} & {invitation.groom.name.split(' ')[0]}
                  </h2>
                  <p className="text-xs sm:text-sm font-light text-slate-200 max-w-sm mx-auto opacity-90">
                    Join us in celebrating our beautiful union.
                  </p>
                </div>
              </section>

              {renderVignette()}

              <ScrollAnimate className="max-w-xl mx-auto px-6 text-center space-y-10">
                <div className="space-y-3">
                  <h3 className={`text-3xl ${fontClass} italic`} style={{ color: invitation.themeColor.primary }}>
                    {isBirthday ? 'Birthday Star' : 'The Couple'}
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    {isBirthday ? 'Celebrating this special milestone' : 'Together with our families'}
                  </p>
                </div>

                {isBirthday ? (
                  <div className="space-y-4 max-w-sm mx-auto text-center">
                    <img src={invitation.bride.avatar} alt={invitation.bride.name} className="w-32 h-32 rounded-full mx-auto object-cover border-2 shadow-md" style={{ borderColor: invitation.themeColor.primary }} />
                    <div className="space-y-1">
                      <h4 className="font-bold text-base font-playfair">{invitation.bride.name}</h4>
                      <p className="text-xs" style={textMutedStyle}>{invitation.bride.parentGroomBride}</p>
                    </div>
                    <p className="text-xs leading-relaxed font-light" style={textHighlightStyle}>{invitation.bride.bio}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <img src={invitation.bride.avatar} alt={invitation.bride.name} className="w-28 h-28 rounded-full mx-auto object-cover border-2 shadow-md" style={{ borderColor: invitation.themeColor.primary }} />
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm font-playfair">{invitation.bride.name}</h4>
                        <p className="text-[10px]" style={textMutedStyle}>{invitation.bride.parentGroomBride}</p>
                      </div>
                      <p className="text-xs leading-relaxed font-light" style={textHighlightStyle}>{invitation.bride.bio}</p>
                    </div>

                    <div className="space-y-4">
                      <img src={invitation.groom.avatar} alt={invitation.groom.name} className="w-28 h-28 rounded-full mx-auto object-cover border-2 shadow-md" style={{ borderColor: invitation.themeColor.primary }} />
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm font-playfair">{invitation.groom.name}</h4>
                        <p className="text-[10px]" style={textMutedStyle}>{invitation.groom.parentGroomBride}</p>
                      </div>
                      <p className="text-xs leading-relaxed font-light" style={textHighlightStyle}>{invitation.groom.bio}</p>
                    </div>
                  </div>
                )}
                {renderGifBox()}
              </ScrollAnimate>

              <ScrollAnimate className="max-w-md mx-auto px-6 text-center space-y-8">
                <h3 className={`text-2xl ${fontClass} italic`} style={{ color: invitation.themeColor.primary }}>
                  Event Details
                </h3>

                <div className="space-y-5">
                  <div className="p-5 rounded-2xl shadow-sm space-y-3" style={cardStyle}>
                    <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-amber-500/10 text-amber-500">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Date Reveal</h4>
                      <ScratchCard
                        revealText={new Date(invitation.eventDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        themeColor={invitation.themeColor}
                        onReveal={() => addToast('Event date revealed!', 'success')}
                      />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl shadow-sm space-y-3" style={cardStyle}>
                    <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-amber-500/10 text-amber-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Time</h4>
                      <p className="text-sm font-semibold">{invitation.eventTime}</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl shadow-sm space-y-3" style={cardStyle}>
                    <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-amber-500/10 text-amber-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Venue</h4>
                      <div>
                        <p className="text-sm font-bold">{invitation.locationName}</p>
                        <p className="text-xs px-3 mt-1 leading-normal" style={textHighlightStyle}>{invitation.locationAddress}</p>
                      </div>
                      {invitation.locationMapsUrl && (
                        <div className="pt-1">
                          <a
                            href={invitation.locationMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-wider transition-opacity hover:opacity-85 shadow-sm"
                            style={{ borderColor: invitation.themeColor.primary, color: invitation.themeColor.text }}
                          >
                            <MapPin className="w-3 h-3 text-rose-500" />
                            Navigate on Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCalendar}
                  className="px-6 py-2.5 rounded-full border text-xs font-semibold hover:opacity-85 transition-opacity shadow-sm cursor-pointer select-none"
                  style={{ borderColor: invitation.themeColor.primary, color: invitation.themeColor.text }}
                >
                  Add to Calendar
                </button>
              </ScrollAnimate>

              <ScrollAnimate className="max-w-xl mx-auto px-6 text-center space-y-6">
                <h3 className={`text-xl ${fontClass}`} style={{ color: invitation.themeColor.primary }}>
                  Days Remaining
                </h3>
                <CountdownTimer targetDate={invitation.eventDate} themeColor={invitation.themeColor} />
              </ScrollAnimate>

              <ScrollAnimate className="max-w-xl mx-auto px-6 text-center space-y-8">
                <h3 className={`text-2xl ${fontClass} italic`} style={{ color: invitation.themeColor.primary }}>
                  Love Story Photos
                </h3>

                <div className="grid grid-cols-2 gap-3.5">
                  {invitation.gallery.map((imgUrl, i) => (
                    <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm relative group cursor-zoom-in" style={cardStyle} onClick={() => setLightboxImage(imgUrl)}>
                      <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350" />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollAnimate>

              <ScrollAnimate className="max-w-md mx-auto px-6 text-center space-y-8">
                <h3 className={`text-3xl ${fontClass} italic`} style={{ color: invitation.themeColor.primary }}>
                  Will You Attend?
                </h3>
                {renderRSVPBox()}
              </ScrollAnimate>
              {/* Subtle Premium Footer Credits */}
              <div className="w-full py-8 text-center space-y-1.5 border-t border-slate-200/10 dark:border-slate-900/40 mt-10">
                <p className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500">
                  Made with Love on <span className="font-playfair italic text-rose-500 font-bold">Invitely</span>
                </p>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                  Crafted by <a href="https://nextorastudio.tech" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-rose-400 transition-colors">Salah Uddin Kader</a> & Nextora Studio
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            <button onClick={() => setLightboxImage(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/60 text-white border border-slate-700">
              <X className="w-5 h-5" />
            </button>
            <motion.img initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} src={lightboxImage} alt="Expanded view" className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
