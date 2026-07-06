import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore';
import { InvitationScreenContent } from '../components/invitation/InvitationScreenContent';
import { Invitation } from '../mock/invitation';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

// Helper to update a <meta> tag dynamically
const setMeta = (attr: string, key: string, value: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

export const PublicInvitation: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { fetchPublicInvitation } = useEventStore();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      setLoading(true);
      fetchPublicInvitation(slug).then((data) => {
        if (isMounted) {
          setInvitation(data);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [slug, fetchPublicInvitation]);

  // ── Inject dynamic OG / Twitter meta for this invitation ────────────────
  useEffect(() => {
    if (!invitation) return;

    const pageTitle = `${invitation.title} — Invitely`;
    const couple = [invitation.bride?.name, invitation.groom?.name].filter(Boolean).join(' & ');
    const description = couple
      ? `You're invited to ${couple}'s ${invitation.title}! ${invitation.eventDate ? `on ${new Date(invitation.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''} ${invitation.locationName ? `at ${invitation.locationName}` : ''}`.trim()
      : `You are cordially invited! ${invitation.title}`;

    // Update page title
    document.title = pageTitle;

    // OG tags
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', window.location.href);
    // Use the OG image — or the first gallery photo if available
    const ogImage = invitation.gallery?.[0] || invitation.bride?.avatar || '/og-image.png';
    setMeta('property', 'og:image', ogImage);

    // Twitter Card
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);
    setMeta('name', 'twitter:card', 'summary_large_image');

    // Restore defaults on unmount
    return () => {
      document.title = 'Invitely — Premium Digital Invitations Builder';
      setMeta('property', 'og:title', 'Invitely — Premium Digital Invitations');
      setMeta('property', 'og:description', 'Stunning digital invitations for weddings, birthdays, Nikkah, engagements & more.');
      setMeta('property', 'og:image', '/og-image.png');
    };
  }, [invitation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1329] flex flex-col items-center justify-center relative overflow-hidden p-6 select-none">
        {/* Glowing gold circular halo */}
        <div className="absolute w-[360px] h-[360px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute w-[240px] h-[240px] rounded-full bg-rose-500/5 blur-[80px] pointer-events-none" />

        {/* Orbiting Ring Visuals */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer Gold Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/40"
          />
          {/* Inner Golden Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-3 rounded-full border border-dashed border-rose-500/30"
          />
          
          {/* Pulsing seal */}
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-950/40 flex items-center justify-center border border-rose-400"
          >
            <Heart className="w-6 h-6 text-amber-150 fill-current" />
          </motion.div>
        </div>

        {/* Elegant typography details */}
        <div className="text-center space-y-4 mt-8 z-10 max-w-xs">
          <div className="flex items-center justify-center gap-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest leading-none">Invitely Gold</span>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-white text-base font-serif italic font-medium leading-none">Preparing your golden card...</h3>
            <p className="text-slate-400 text-[10px] font-medium tracking-wide">Connecting to secure invitation ledger</p>
          </div>

          {/* Golden Progress Bar loading simulation */}
          <div className="w-40 h-1 bg-slate-800 rounded-full overflow-hidden mx-auto border border-slate-800/40">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between invitation-guard select-none">
      <div className="flex-1 w-full max-w-lg mx-auto bg-white dark:bg-slate-950 shadow-2xl relative">
        <InvitationScreenContent invitation={invitation} isPreviewMode={false} />
      </div>
    </div>
  );
};
