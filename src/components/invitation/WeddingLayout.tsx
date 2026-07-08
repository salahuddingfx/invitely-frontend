import React, { useState, useEffect } from 'react';
import { Invitation } from '../../mock/invitation';
import { CountdownTimer } from './CountdownTimer';
import { ScratchCard } from './ScratchCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Maximize2,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Music,
  Gift,
  Info,
  BookOpen,
  Map,
  Copy,
  Check
} from 'lucide-react';

interface WeddingLayoutProps {
  invitation: Invitation;
  fontClass: string;
  isDark: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  musicPlaying: boolean;
  setMusicPlaying: (playing: boolean) => void;
  handleAddToCalendar: () => void;
  renderRSVPBox: () => React.ReactNode;
  lightboxImage: string | null;
  setLightboxImage: (img: string | null) => void;
}

const TypingText: React.FC<{ text: string; className?: string; delay?: number; speed?: number }> = ({
  text,
  className = '',
  delay = 0,
  speed = 60
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  return <span className={className}>{displayedText}</span>;
};

const renderProfileAvatar = (url: string, name: string, isBride: boolean) => {
  const isPlaceholder = !url || url.includes('placeholder') || url.includes('avatar-placeholder');
  
  if (isPlaceholder) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-amber-100/30 to-amber-200/20 dark:from-slate-850 dark:to-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
        {isBride ? (
          <svg className="w-16 h-16 text-rose-500/60 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9yM12 3a9 9 0 000 18z" />
          </svg>
        ) : (
          <svg className="w-16 h-16 text-sky-500/60 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9yM12 3a9 9 0 000 18z" />
          </svg>
        )}
        <span className="absolute bottom-3 text-[10px] font-bold tracking-[0.2em] text-amber-500 uppercase font-serif">
          {name.split(' ')[0]}
        </span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
    />
  );
};

export const WeddingLayout: React.FC<WeddingLayoutProps> = ({
  invitation,
  fontClass,
  isDark,
  isOpen,
  setIsOpen,
  musicPlaying,
  setMusicPlaying,
  handleAddToCalendar,
  renderRSVPBox,
  lightboxImage,
  setLightboxImage,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);

  // Identify specific styles
  const tid = invitation.templateId.toLowerCase();
  const isIslamic =
    tid.includes('nikkah') ||
    tid.includes('emerald') ||
    tid.includes('persian') ||
    invitation.title.toLowerCase().includes('nikkah') ||
    invitation.slug.toLowerCase().includes('nikkah');

  const isMehndi =
    tid.includes('mehndi') ||
    tid.includes('henna') ||
    invitation.title.toLowerCase().includes('mehndi');

  const isTraditionalGold =
    tid.includes('royal') ||
    tid.includes('gold') ||
    invitation.title.toLowerCase().includes('royal') ||
    invitation.title.toLowerCase().includes('golden');

  // Copy helper
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Default timeline milestones
  const defaultMilestones = [
    {
      title: 'How We Met',
      date: 'Autumn 2023',
      description: `A chance encounter that turned into endless conversations, laughter, and a spark that couldn't be ignored.`,
      icon: '✨'
    },
    {
      title: 'First Date',
      date: 'December 2023',
      description: `A quiet coffee afternoon that stretched into dinner. We lost track of time and knew it was something special.`,
      icon: '☕'
    },
    {
      title: 'The Proposal',
      date: 'Spring 2025',
      description: `Under a beautiful sunset canopy, with hearts beating fast, he asked and she joyfully said "Yes" to forever.`,
      icon: '💍'
    },
    {
      title: 'The Big Day',
      date: new Date(invitation.eventDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      description: `The start of our absolute forever. We are thrilled to celebrate our love and marriage vows with you.`,
      icon: '🏰'
    }
  ];

  // Default Event Schedule (Nikkah/Mehndi specific details to look extremely complete)
  const defaultSchedule = isIslamic
    ? [
        { time: '04:00 PM', title: 'Barat & Welcome', desc: 'Greeting the groom side with flowers and traditional sharbat.' },
        { time: '05:00 PM', title: 'The Nikkah Ceremony', desc: 'The solemn signing of the marriage contract in presence of witnesses.' },
        { time: '06:30 PM', title: 'Photoshoot & Milad', desc: 'Beautiful family portraits, congratulations, and blessings.' },
        { time: '07:30 PM', title: 'Royal Dinner Feast', desc: 'Enjoying traditional Mughlai cuisine and dessert delicacies.' }
      ]
    : isMehndi
    ? [
        { time: '05:00 PM', title: 'Henna Application', desc: 'Intricate mehndi styling for the bride and guests.' },
        { time: '06:30 PM', title: 'Traditional Dhol & Songs', desc: 'Singing festive folk songs, dhol, and pre-wedding dances.' },
        { time: '08:00 PM', title: 'Festive Buffet Dinner', desc: 'A rich spread of delicious, aromatic traditional appetizers & meals.' }
      ]
    : [
        { time: '04:30 PM', title: 'Ceremony / Vows', desc: 'Exchange of vows, rings, and official marriage blessings.' },
        { time: '05:30 PM', title: 'Cocktail Hour & Photos', desc: 'Sip on signature cocktails while the couple captures portraits.' },
        { time: '07:00 PM', title: 'Grand Reception & Toast', desc: 'First dance, cutting the cake, toasts, and dancing.' },
        { time: '08:00 PM', title: 'Dinner & Celebrations', desc: 'A luxurious multi-course meal followed by floor-wide celebrations.' }
      ];

  const primaryColor = invitation.themeColor.primary || '#d4af37';
  const secondaryColor = invitation.themeColor.secondary || '#1e293b';
  const accentColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.04)';
  
  const textMutedStyle = {
    color: isDark ? 'rgba(255, 255, 255, 0.55)' : 'rgba(15, 23, 42, 0.55)'
  };

  const textHighlightStyle = {
    color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.85)'
  };

  const sectionHeadingStyle = {
    color: primaryColor,
    textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.4)' : 'none'
  };

  // Scroll helper animation
  const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Floating Vinyl Music Player Widget ───────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <div className="glass-card flex items-center gap-3 p-2.5 rounded-full border border-amber-500/25 shadow-xl select-none">
              {/* Rotating Record */}
              <div className="relative w-11 h-11 flex items-center justify-center">
                <motion.div
                  animate={musicPlaying ? { rotate: 360 } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center relative shadow-md"
                >
                  {/* Vinyl Lines */}
                  <div className="absolute inset-1 rounded-full border border-slate-800/40" />
                  <div className="absolute inset-2 rounded-full border border-slate-800/60" />
                  {/* Center Sticker */}
                  <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] text-white font-bold" 
                    style={{ backgroundColor: primaryColor }}
                  >
                    💖
                  </div>
                </motion.div>
                {/* Floating Note indicator */}
                {musicPlaying && (
                  <motion.div
                    animate={{ y: [-5, -25], x: [0, -10], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute text-rose-500 text-xs font-bold"
                  >
                    ♫
                  </motion.div>
                )}
              </div>
              
              {/* Controls */}
              <div className="flex flex-col pr-3">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Wedding Music</span>
                <span className="text-[9px] font-medium max-w-[85px] truncate text-slate-200 dark:text-slate-100">
                  {invitation.musicUrl === 'none' ? 'Muted' : 'Elegant Waltz'}
                </span>
              </div>
              
              <button
                onClick={() => setMusicPlaying(!musicPlaying)}
                className="w-8 h-8 rounded-full bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center transition-colors cursor-pointer"
                style={{ color: primaryColor }}
              >
                {musicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STYLE A: Royal Velvet Curtain Envelope Cover ─────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <div className="absolute inset-0 z-50 flex overflow-hidden">
            {/* Left Pleated Velvet Curtain */}
            <motion.div
              exit={{ x: '-100%', skewX: -4 }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
              className="w-1/2 h-full border-r border-amber-500/35 relative flex items-center justify-end shadow-inner"
              style={{
                backgroundColor: isIslamic ? '#064e3b' : isMehndi ? '#7c2d12' : '#3b0764',
                backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(255,255,255,0.06) 12%, rgba(0,0,0,0.45) 25%, rgba(255,255,255,0.06) 38%, rgba(0,0,0,0.55) 50%, rgba(255,255,255,0.06) 62%, rgba(0,0,0,0.45) 75%, rgba(255,255,255,0.06) 88%, rgba(0,0,0,0.65) 100%)'
              }}
            >
              {/* Left curtain gold trim tassel */}
              <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 opacity-60" />
            </motion.div>

            {/* Right Pleated Velvet Curtain */}
            <motion.div
              exit={{ x: '100%', skewX: 4 }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
              className="w-1/2 h-full border-l border-amber-500/35 relative flex items-center justify-start shadow-inner"
              style={{
                backgroundColor: isIslamic ? '#064e3b' : isMehndi ? '#7c2d12' : '#3b0764',
                backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(255,255,255,0.06) 12%, rgba(0,0,0,0.45) 25%, rgba(255,255,255,0.06) 38%, rgba(0,0,0,0.55) 50%, rgba(255,255,255,0.06) 62%, rgba(0,0,0,0.45) 75%, rgba(255,255,255,0.06) 88%, rgba(0,0,0,0.65) 100%)'
              }}
            >
              {/* Right curtain gold trim tassel */}
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 opacity-60" />
            </motion.div>

            {/* Central Opening Seal Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <motion.div
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-4"
              >
                {/* Gold Seal Pattern */}
                <motion.button
                  whileHover={{ scale: 1.06, rotate: 5 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setIsOpen(true);
                    setMusicPlaying(true);
                  }}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_35px_rgba(212,175,55,0.45)] border-4 border-amber-200 pointer-events-auto flex flex-col items-center justify-center cursor-pointer ring-8 ring-amber-500/20 animate-pulse"
                >
                  <Heart className="w-8 h-8 text-white fill-current animate-bounce" />
                  <span className="text-[9px] font-extrabold text-amber-100 tracking-[0.25em] mt-1.5 uppercase font-serif">REVEAL</span>
                </motion.button>
                <div className="px-5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/80 text-[10px] uppercase font-bold tracking-widest leading-none">
                  {invitation.bride.name.split(' ')[0]} & {invitation.groom.name.split(' ')[0]}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT (ONLY VISIBLE ON OPEN) ──────────────────────────────── */}
      {isOpen && (
        <div className="space-y-16 pb-20">
          
          {/* Section 1: Hero visual section */}
          <section className="relative aspect-[3/4] sm:aspect-video w-full overflow-hidden bg-slate-900 border-b-4 border-amber-500/30">
            <img
              src={invitation.coverPhoto || '/placeholder-couple.svg'}
              alt="Wedding Cover"
              className="w-full h-full object-cover opacity-80"
            />
            {/* Elegant vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/20" />
            
            {/* Thematic Islamic / Traditional Overlay frame */}
            {isIslamic && (
              <div className="absolute inset-4 border border-amber-500/25 pointer-events-none flex flex-col justify-between p-4">
                <div className="w-full flex justify-between">
                  <div className="w-6 h-6 border-t border-l border-amber-500/50" />
                  <div className="w-6 h-6 border-t border-r border-amber-500/50" />
                </div>
                <div className="w-full flex justify-between">
                  <div className="w-6 h-6 border-b border-l border-amber-500/50" />
                  <div className="w-6 h-6 border-b border-r border-amber-500/50" />
                </div>
              </div>
            )}

            <div className="absolute bottom-10 left-6 right-6 text-center text-white space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-8 bg-amber-500/60" />
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-amber-300">
                  {isIslamic ? 'The Holy Union' : isMehndi ? 'Mehndi Festival' : 'Save the Date'}
                </span>
                <div className="h-[1px] w-8 bg-amber-500/60" />
              </div>
              <h1 className={`text-4xl sm:text-6xl ${fontClass} font-normal text-amber-100 tracking-wide min-h-[50px] sm:min-h-[70px]`}>
                <TypingText text={`${invitation.bride.name.split(' ')[0]} & ${invitation.groom.name.split(' ')[0]}`} delay={0.5} speed={70} />
              </h1>
              <p className="text-xs sm:text-sm font-light text-slate-200 max-w-sm mx-auto opacity-95 min-h-[36px]">
                <TypingText
                  text={isIslamic
                    ? 'We request the honor of your presence to bless our Nikkah.'
                    : 'Join us to celebrate our love and beautiful wedding union.'}
                  delay={1.8}
                  speed={45}
                />
              </p>
              <div className="text-amber-500/50 text-sm">❦</div>
            </div>
          </section>

          {/* Custom Dome/Bismillah Block for Islamic Nikkah */}
          {isIslamic && (
            <ScrollReveal className="max-w-md mx-auto px-6 text-center space-y-3">
              <div className="w-24 h-6 mx-auto flex items-center justify-center relative">
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                <div className="bg-slate-950 px-2 text-xs text-amber-500">⚜</div>
              </div>
              <p className="font-amiri text-3xl text-amber-400 font-bold leading-relaxed" dir="rtl" lang="ar">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-bold">
                In the Name of Allah, the Most Gracious, the Most Merciful
              </p>
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 italic text-xs leading-relaxed max-w-sm mx-auto animate-pulse" style={textHighlightStyle}>
                "And among His signs is that He created for you mates from among yourselves that you may find tranquility in them; and He placed between you affection and mercy."
                <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-500/80 mt-1.5">— Surah Ar-Rum 30:21</span>
              </div>
            </ScrollReveal>
          )}

          {/* Section 2: The Couple (Portraits) */}
          <ScrollReveal className="max-w-xl mx-auto px-6 text-center space-y-8">
            <div className="space-y-2">
              <h3 className={`text-3xl ${fontClass} italic`} style={sectionHeadingStyle}>
                The Couple
              </h3>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                Together with our beloved families
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Bride profile */}
              <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/10 transition-colors" />
                
                {/* Image Frame */}
                <div className="relative w-36 h-48 mx-auto overflow-hidden rounded-t-full border-4 border-amber-500/20 group-hover:border-amber-500/45 transition-colors shadow-lg">
                  {renderProfileAvatar(invitation.bride.avatar, invitation.bride.name, true)}
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base font-serif text-slate-800 dark:text-white">
                    {invitation.bride.name}
                  </h4>
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                    Bride
                  </p>
                  <p className="text-[10px] font-semibold italic text-slate-400" style={textMutedStyle}>
                    {invitation.bride.parentGroomBride}
                  </p>
                </div>
                <p className="text-xs leading-normal font-light pt-1.5" style={textHighlightStyle}>
                  {invitation.bride.bio}
                </p>
              </div>

              {/* Groom profile */}
              <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/40 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                
                {/* Image Frame */}
                <div className="relative w-36 h-48 mx-auto overflow-hidden rounded-t-full border-4 border-amber-500/20 group-hover:border-amber-500/45 transition-colors shadow-lg">
                  {renderProfileAvatar(invitation.groom.avatar, invitation.groom.name, false)}
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base font-serif text-slate-800 dark:text-white">
                    {invitation.groom.name}
                  </h4>
                  <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">
                    Groom
                  </p>
                  <p className="text-[10px] font-semibold italic text-slate-400" style={textMutedStyle}>
                    {invitation.groom.parentGroomBride}
                  </p>
                </div>
                <p className="text-xs leading-normal font-light pt-1.5" style={textHighlightStyle}>
                  {invitation.groom.bio}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 3: Event Details */}
          <ScrollReveal className="max-w-md mx-auto px-6 text-center space-y-8">
            <div className="space-y-2">
              <h3 className={`text-2xl ${fontClass} italic`} style={sectionHeadingStyle}>
                Wedding Day Reveal
              </h3>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                Scratch the card below to reveal the date
              </p>
            </div>

            <div className="space-y-5">
              {/* Date Card with Scratch Reveal */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-lg space-y-4">
                <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-amber-500/10 text-amber-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="space-y-3">
                  <ScratchCard
                    revealText={new Date(invitation.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    themeColor={invitation.themeColor}
                    onReveal={() => {}}
                  />
                </div>
              </div>

              {/* Time & Venue Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-lg text-center space-y-2">
                  <div className="w-9 h-9 rounded-full mx-auto flex items-center justify-center bg-amber-500/10 text-amber-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Time</span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-100">{invitation.eventTime}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-lg text-center space-y-2">
                  <div className="w-9 h-9 rounded-full mx-auto flex items-center justify-center bg-amber-500/10 text-amber-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Venue</span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-100 truncate">{invitation.locationName}</p>
                </div>
              </div>

              {/* Venue Address Card with Map Direction */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-lg text-center space-y-3">
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Venue Address</span>
                <p className="text-xs leading-normal" style={textHighlightStyle}>{invitation.locationAddress}</p>
                
                {invitation.locationMapsUrl && (
                  <div className="pt-2">
                    <a
                      href={invitation.locationMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-slate-50 dark:hover:bg-slate-850 shadow-sm cursor-pointer select-none"
                      style={{ borderColor: primaryColor, color: primaryColor }}
                    >
                      <Map className="w-3.5 h-3.5" />
                      Navigate on Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleAddToCalendar}
                className="px-6 py-2.5 rounded-full border text-xs font-semibold hover:opacity-85 transition-opacity shadow-sm cursor-pointer select-none"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Add to Calendar
              </button>
            </div>
          </ScrollReveal>

          {/* Section 4: Event Schedule (Detailed Timeline) */}
          <ScrollReveal className="max-w-md mx-auto px-6 text-center space-y-8">
            <div className="space-y-2">
              <h3 className={`text-2xl ${fontClass} italic`} style={sectionHeadingStyle}>
                The Schedule
              </h3>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                Program workflow for our celebrations
              </p>
            </div>

            <div className="space-y-4">
              {defaultSchedule.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-4 items-start p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-md text-left transition-all hover:translate-x-1 duration-200"
                >
                  <div className="text-[10px] font-bold font-serif whitespace-nowrap py-0.5" style={{ color: primaryColor }}>
                    {item.time}
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 font-light" style={textMutedStyle}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Section 5: Love Story Milestones */}
          <ScrollReveal className="max-w-lg mx-auto px-6 text-center space-y-10">
            <div className="space-y-2">
              <h3 className={`text-2xl ${fontClass} italic`} style={sectionHeadingStyle}>
                Our Love Story
              </h3>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                Chapters of our journey towards forever
              </p>
            </div>

            {/* Vertical Milestones */}
            <div className="relative border-l-2 border-dashed border-amber-500/20 pl-6 space-y-8 text-left max-w-md mx-auto">
              {defaultMilestones.map((stone, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline Bullet Node */}
                  <span 
                    className="absolute -left-[37px] top-1.5 w-6 h-6 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs shadow-md"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {stone.icon}
                  </span>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500">
                      {stone.date}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                      {stone.title}
                    </h4>
                    <p className="text-xs font-light leading-relaxed text-slate-400" style={textMutedStyle}>
                      {stone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Section 6: Countdown Clock */}
          <ScrollReveal className="max-w-xl mx-auto px-6 text-center space-y-6">
            <h3 className={`text-xl ${fontClass} italic`} style={sectionHeadingStyle}>
              The Countdown
            </h3>
            <div className="flex items-center justify-center">
              <CountdownTimer targetDate={invitation.eventDate} themeColor={invitation.themeColor} />
            </div>
          </ScrollReveal>

          {/* Section 7: Love Story Polaroid Photo Gallery */}
          <ScrollReveal className="max-w-xl mx-auto px-6 text-center space-y-8">
            <div className="space-y-2">
              <h3 className={`text-3xl ${fontClass} italic`} style={sectionHeadingStyle}>
                Moments Captured
              </h3>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                A glimpse into our beautiful moments
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {invitation.gallery.map((imgUrl, i) => (
                <div 
                  key={i} 
                  className="p-3 bg-white border border-slate-200/60 shadow-xl rounded-sm transform rotate-1 hover:rotate-0 hover:scale-[1.02] transition-all duration-350 cursor-zoom-in"
                  onClick={() => setLightboxImage(imgUrl)}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 rounded-sm">
                    <img 
                      src={imgUrl || '/placeholder-couple.svg'} 
                      alt={`Gallery ${i}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  {/* Polaroid text spacer */}
                  <div className="pt-2 pb-0.5 text-[10px] text-center font-playfair italic text-slate-650">
                    Memories {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Section 8: RSVP & Wedding Gifts Section */}
          <ScrollReveal className="max-w-md mx-auto px-6 text-center space-y-8">
            <div className="space-y-2">
              <h3 className={`text-3xl ${fontClass} italic`} style={sectionHeadingStyle}>
                Will You Attend?
              </h3>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                Please honor us with your presence
              </p>
            </div>

            {/* RSVP Form */}
            {renderRSVPBox()}

            {/* Premium Gifts Blessings Box */}
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-md space-y-4">
              <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-amber-500/10 text-amber-500 animate-pulse">
                <Gift className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                Wedding Gifts & Blessings
              </h4>
              <p className="text-xs font-light leading-relaxed" style={textHighlightStyle}>
                Your presence and prayers are the greatest gift we could receive. Should you wish to send a token of love, you can contribute digitally.
              </p>
              <button
                onClick={() => setShowGiftModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold text-xs rounded-full shadow-lg transition-transform hover:scale-103 cursor-pointer"
              >
                Send Gift / Blessings
              </button>
            </div>
          </ScrollReveal>

          {/* Elegant Footer Credits */}
          <ScrollReveal className="w-full py-8 text-center space-y-1.5 border-t border-slate-200/10 dark:border-slate-900/40 mt-10">
            <p className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500">
              Made with Love on <span className="font-playfair italic text-rose-500 font-bold">Invitely</span>
            </p>
            <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
              Crafted by <a href="https://nextorastudio.tech" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-rose-400 transition-colors">Salah Uddin Kader</a> & Nextora Studio
            </p>
          </ScrollReveal>
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
            <button 
              onClick={() => setLightboxImage(null)} 
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/60 text-white border border-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }} 
              src={lightboxImage} 
              alt="Expanded view" 
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gifts & Blessings Modal */}
      <AnimatePresence>
        {showGiftModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setShowGiftModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-250 hover:bg-slate-800/20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2">
                <Heart className="w-8 h-8 text-rose-500 fill-current mx-auto" />
                <h4 className="font-extrabold text-base font-serif text-slate-800 dark:text-white">
                  Send Love & Blessings
                </h4>
                <p className="text-xs font-light" style={textMutedStyle}>
                  You can contribute to the couple's new beginning using bKash, Nagad or Bank Transfer.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* bKash Payment option */}
                <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center">b</span>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">bKash Personal</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-100">01712-345678</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('01712345678', 'bkash')}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer flex-row"
                  >
                    {copiedText === 'bkash' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[8px] font-bold uppercase">{copiedText === 'bkash' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Nagad Payment option */}
                <div className="p-3 rounded-xl border border-orange-500/20 bg-orange-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center">n</span>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Nagad Personal</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-100">01812-345678</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('01812345678', 'nagad')}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer flex-row"
                  >
                    {copiedText === 'nagad' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[8px] font-bold uppercase">{copiedText === 'nagad' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Bank account option */}
                <div className="p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-slate-50 dark:bg-slate-900/60 text-left space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Bank Account (City Bank)</span>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-100">Sarah & Alex Union</div>
                  <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                    <span>A/C: 1209384756201</span>
                    <button 
                      onClick={() => handleCopy('1209384756201', 'bank')} 
                      className="text-amber-500 hover:underline text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      {copiedText === 'bank' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-250 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
