import React, { useState } from 'react';
import { Invitation } from '../../mock/invitation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RotateCcw } from 'lucide-react';

const ScrollAnimate: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ApologyLayoutProps {
  invitation: Invitation;
  fontClass: string;
  isDark: boolean;
}

const MESSAGES = [
  {
    title: 'I Know I Messed Up',
    text: "I'm not here to make excuses. I'm here because losing you hurts more than being wrong ever could. You deserve better, and I want to be better.",
    cover: 'Tap to reveal'
  },
  {
    title: 'You Mean Everything',
    text: "Every laugh we've shared, every late-night conversation, every silent moment together — they're all treasures I'd never want to lose. You're not just someone I love, you're my whole world.",
    cover: 'Tap to reveal'
  },
  {
    title: 'My Promise to You',
    text: "I can't undo what happened, but I can promise you this: I'll spend every day making sure you never regret giving me another chance. You're worth every effort, every change, every tear.",
    cover: 'Tap to reveal'
  }
];

export const ApologyLayout: React.FC<ApologyLayoutProps> = ({ invitation, fontClass, isDark }) => {
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [showFinal, setShowFinal] = useState(false);

  const toggleCard = (index: number) => {
    setRevealedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const allRevealed = revealedCards.length === MESSAGES.length;

  return (
    <div className="space-y-12 pb-20">
      {/* Hero / Greeting */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Floating hearts */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${15 + (i * 17) % 70}%`,
              color: invitation.themeColor.primary,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <Heart className="w-6 h-6 fill-current" />
          </motion.div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 px-6 z-10"
        >
          {/* GIF box */}
          <div className="flex justify-center gap-4 mb-6">
            <img src="/gifs/flower.gif" alt="" className="h-16 opacity-70" />
            <img src="/gifs/first.gif" alt="" className="h-24 drop-shadow-lg" />
            <img src="/gifs/flower.gif" alt="" className="h-16 opacity-70" />
          </div>

          <h1
            className={`text-4xl sm:text-5xl ${fontClass} font-bold`}
            style={{ color: invitation.themeColor.primary }}
          >
            Hey {invitation.bride.name.split(' ')[0]}!
          </h1>

          <p className="text-base sm:text-lg max-w-sm mx-auto leading-relaxed" style={{ color: invitation.themeColor.text }}>
            Can we talk for a moment? There's something important I want to tell you.
          </p>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart
              className="w-10 h-10 mx-auto fill-current"
              style={{ color: invitation.themeColor.primary }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Messages - Tap to Reveal */}
      <ScrollAnimate className="max-w-md mx-auto px-6 space-y-6">
        <h2
          className={`text-2xl sm:text-3xl ${fontClass} text-center italic`}
          style={{ color: invitation.themeColor.primary }}
        >
          What's In My Heart
        </h2>
        <p className="text-xs text-center opacity-60">Tap each card to reveal my feelings</p>

        <div className="space-y-4">
          {MESSAGES.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative cursor-pointer"
              onClick={() => toggleCard(i)}
              style={{ perspective: '1000px' }}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-md"
                style={{
                  transformStyle: 'preserve-3d',
                  minHeight: revealedCards.includes(i) ? '120px' : '64px',
                }}
                animate={{
                  rotateX: revealedCards.includes(i) ? 0 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                {/* Cover */}
                <AnimatePresence>
                  {!revealedCards.includes(i) && (
                    <motion.div
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 flex items-center justify-center rounded-2xl backdrop-blur-md border"
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(255,255,255,0.7)',
                        borderColor: isDark
                          ? 'rgba(255,255,255,0.12)'
                          : 'rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Heart
                          className="w-4 h-4 fill-current"
                          style={{ color: invitation.themeColor.primary }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: invitation.themeColor.primary }}
                        >
                          {msg.cover}
                        </span>
                        <Heart
                          className="w-4 h-4 fill-current"
                          style={{ color: invitation.themeColor.primary }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content */}
                <div
                  className="p-5 space-y-2"
                  style={{
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.9)',
                    borderRadius: '16px',
                    border: `1px solid ${
                      isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    }`,
                  }}
                >
                  <h3
                    className="text-sm font-bold"
                    style={{ color: invitation.themeColor.primary }}
                  >
                    {msg.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: invitation.themeColor.text }}
                  >
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </ScrollAnimate>

      {/* Final Apology */}
      {allRevealed && !showFinal && (
        <ScrollAnimate className="max-w-md mx-auto px-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowFinal(true)}
            className="w-full py-3 rounded-full text-white font-semibold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: invitation.themeColor.primary }}
          >
            I'm Not Done Yet...
          </motion.button>
        </ScrollAnimate>
      )}

      <AnimatePresence>
        {showFinal && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto px-6 text-center space-y-8"
          >
            <div className="space-y-4">
              <img src="/gifs/holding-heart.gif" alt="" className="h-20 mx-auto drop-shadow-lg" />

              <h2
                className={`text-3xl sm:text-4xl ${fontClass} font-bold`}
                style={{ color: invitation.themeColor.primary }}
              >
                I'm Sorry
              </h2>

              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: invitation.themeColor.text }}
              >
                I can't undo the past, but I can promise you a future filled with love, respect, and all the happiness you deserve.
              </p>

              <p
                className="text-sm italic"
                style={{ color: invitation.themeColor.primary }}
              >
                Please forgive me. I love you more than words can say.
              </p>
            </div>

            {/* GIFs row */}
            <div className="flex justify-center gap-4">
              <img src="/gifs/first.gif" alt="" className="h-16 drop-shadow-md" />
              <img src="/gifs/second.gif" alt="" className="h-16 drop-shadow-md" />
              <img src="/gifs/flower.gif" alt="" className="h-16 drop-shadow-md" />
            </div>

            {/* Retry button */}
            <button
              onClick={() => {
                setRevealedCards([]);
                setShowFinal(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors"
              style={{
                borderColor: invitation.themeColor.primary,
                color: invitation.themeColor.primary,
              }}
            >
              <RotateCcw className="w-3 h-3" />
              Read Again
            </button>

            {/* Credit */}
            <div className="pt-6 border-t space-y-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
              <p className="text-[9px] tracking-wider uppercase font-semibold opacity-40">
                Made with Love on <span className="font-playfair italic font-bold">Invitely</span>
              </p>
              <p className="text-[8px] opacity-30 uppercase tracking-widest">
                Crafted by <a href="https://nextorastudio.tech" target="_blank" rel="noopener noreferrer" className="font-bold hover:opacity-60 transition-opacity">Salah Uddin Kader</a> & Nextora Studio
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};
