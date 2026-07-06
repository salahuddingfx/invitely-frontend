import React, { useState, useEffect, useRef } from 'react';
import { Invitation } from '../../mock/invitation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

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

interface ProposalLayoutProps {
  invitation: Invitation;
  fontClass: string;
  isDark: boolean;
}

const MESSAGES = [
  {
    title: 'When I See You',
    text: "My heart skips a beat, the world fades away, and there's nothing but your smile. You make ordinary moments feel magical.",
    cover: 'Tap to reveal'
  },
  {
    title: "When I'm With You",
    text: "Time stops. Laughter comes easy. Silence feels comfortable. You're my favorite place to be when the world gets too loud.",
    cover: 'Tap to reveal'
  },
  {
    title: 'When I Think Of You',
    text: "I smile like an idiot. I imagine our future together. I realize that no matter what happens, I want you in my life forever.",
    cover: 'Tap to reveal'
  }
];

const TIMELINE = [
  { title: 'The Beginning', text: 'The moment I first saw you, I knew my life was about to change forever.', color: '#f06292' },
  { title: 'Falling For You', text: 'Every laugh, every smile, every moment with you made me fall deeper.', color: '#ce93d8' },
  { title: 'Today', text: 'I gathered the courage to ask you, and my heart has never been happier.', color: '#f48fb1' },
  { title: 'Forever', text: "I promise to love you, cherish you, and make you smile every single day.", color: '#e91e63' },
];

const NO_RESPONSES = [
  "I'll wait...",
  "Take your time, I'm not going anywhere",
  "My heart is patient when it comes to you",
  "I'll ask again tomorrow, and the day after...",
  "You're worth every second of waiting",
  "I knew you'd need time. I have all the time in the world for you.",
  "That's okay. I'm not giving up.",
  "Every 'no' just makes the 'yes' sweeter",
  "I'm still here. Still loving you.",
  "Maybe next time? I'll keep trying.",
];

export const ProposalLayout: React.FC<ProposalLayoutProps> = ({ invitation, fontClass, isDark }) => {
  const [currentStep, setCurrentStep] = useState<'greeting' | 'ring' | 'messages' | 'question' | 'yes' | 'timeline'>('greeting');
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [ringOpen, setRingOpen] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [noResponse, setNoResponse] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const allRevealed = revealedCards.length === MESSAGES.length;

  const toggleCard = (index: number) => {
    setRevealedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleNo = () => {
    setNoClicks((prev) => prev + 1);
    setNoResponse(NO_RESPONSES[Math.min(noClicks, NO_RESPONSES.length - 1)]);
    if (noClicks >= 6) {
      setTimeout(() => setCurrentStep('yes'), 1500);
    }
  };

  // Typing effect for the big question
  useEffect(() => {
    if (currentStep === 'question') {
      const fullText = "Will You Be Mine?";
      setTypedText('');
      setIsTyping(true);
      let i = 0;
      const type = () => {
        if (i < fullText.length) {
          setTypedText(fullText.slice(0, i + 1));
          i++;
          typeTimerRef.current = setTimeout(type, 100);
        } else {
          setIsTyping(false);
        }
      };
      typeTimerRef.current = setTimeout(type, 800);
      return () => {
        if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
      };
    }
  }, [currentStep]);

  const renderGreeting = () => (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
          style={{
            left: `${10 + (i * 14) % 80}%`,
            top: `${15 + (i * 19) % 70}%`,
            color: invitation.themeColor.primary,
          }}
          animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        >
          <Heart className="w-5 h-5 fill-current" />
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 px-6 z-10">
        <div className="flex justify-center gap-4 mb-6">
          <img src="/gifs/flower.gif" alt="" className="h-16 opacity-70" />
          <img src="/gifs/first.gif" alt="" className="h-24 drop-shadow-lg" />
          <img src="/gifs/flower.gif" alt="" className="h-16 opacity-70" />
        </div>

        <h1 className={`text-4xl sm:text-5xl ${fontClass} font-bold`} style={{ color: invitation.themeColor.primary }}>
          Hey You!
        </h1>

        <p className="text-base sm:text-lg max-w-sm mx-auto leading-relaxed" style={{ color: invitation.themeColor.text }}>
          I have something really important to tell you... Will you hear me out?
        </p>

        <button
          onClick={() => setCurrentStep('ring')}
          className="px-8 py-3 rounded-full text-white font-semibold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          style={{ backgroundColor: invitation.themeColor.primary }}
        >
          <Heart className="w-4 h-4 fill-current" />
          Of Course
        </button>
      </motion.div>
    </section>
  );

  const renderRingBox = () => (
    <ScrollAnimate className="max-w-md mx-auto px-6 text-center space-y-8">
      <h2 className={`text-2xl sm:text-3xl ${fontClass} italic`} style={{ color: invitation.themeColor.primary }}>
        Something Special For You
      </h2>
      <p className="text-xs opacity-60">Tap the box to open it</p>

      <motion.div
        className="relative mx-auto w-32 h-32 cursor-pointer"
        onClick={() => setRingOpen(!ringOpen)}
        whileTap={{ scale: 0.95 }}
      >
        {/* Box base */}
        <div
          className="absolute bottom-0 w-full h-20 rounded-b-2xl"
          style={{ backgroundColor: invitation.themeColor.primary }}
        />
        {/* Box lid */}
        <motion.div
          className="absolute top-0 w-full h-16 rounded-t-2xl origin-bottom"
          style={{ backgroundColor: invitation.themeColor.primary, filter: 'brightness(0.85)' }}
          animate={{ rotateX: ringOpen ? -120 : 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        />
        {/* Ring glow */}
        <AnimatePresence>
          {ringOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <Sparkles className="w-12 h-12 animate-pulse" style={{ color: '#ffd700' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="text-xs italic" style={{ color: invitation.themeColor.primary }}>
        A promise of my love
      </p>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setCurrentStep('messages')}
          className="px-6 py-2.5 rounded-full text-white font-semibold text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: invitation.themeColor.primary }}
        >
          Read My Heart
        </button>
        <button
          onClick={() => setCurrentStep('greeting')}
          className="px-4 py-2.5 rounded-full text-xs font-semibold border opacity-60"
          style={{ borderColor: invitation.themeColor.primary, color: invitation.themeColor.primary }}
        >
          Back
        </button>
      </div>
    </ScrollAnimate>
  );

  const renderMessages = () => (
    <ScrollAnimate className="max-w-md mx-auto px-6 space-y-6">
      <h2 className={`text-2xl sm:text-3xl ${fontClass} text-center italic`} style={{ color: invitation.themeColor.primary }}>
        What I Feel About You
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
          >
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <AnimatePresence>
                {!revealedCards.includes(i) && (
                  <motion.div
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 flex items-center justify-center rounded-2xl backdrop-blur-md border z-10"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
                      borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 fill-current" style={{ color: invitation.themeColor.primary }} />
                      <span className="text-sm font-medium" style={{ color: invitation.themeColor.primary }}>
                        {msg.cover}
                      </span>
                      <Heart className="w-4 h-4 fill-current" style={{ color: invitation.themeColor.primary }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className="p-5 space-y-2"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                  borderRadius: '16px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                }}
              >
                <h3 className="text-sm font-bold" style={{ color: invitation.themeColor.primary }}>
                  {msg.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: invitation.themeColor.text }}>
                  {msg.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3 justify-center pt-4">
        {allRevealed && (
          <button
            onClick={() => setCurrentStep('question')}
            className="px-6 py-2.5 rounded-full text-white font-semibold text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: invitation.themeColor.primary }}
          >
            The Big Question
          </button>
        )}
        <button
          onClick={() => setCurrentStep('ring')}
          className="px-4 py-2.5 rounded-full text-xs font-semibold border opacity-60"
          style={{ borderColor: invitation.themeColor.primary, color: invitation.themeColor.primary }}
        >
          Back
        </button>
      </div>
    </ScrollAnimate>
  );

  const renderQuestion = () => (
    <ScrollAnimate className="max-w-md mx-auto px-6 text-center space-y-8">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <Heart className="w-14 h-14 mx-auto fill-current" style={{ color: invitation.themeColor.primary }} />
      </motion.div>

      <h2 className={`text-3xl sm:text-4xl ${fontClass} font-bold`} style={{ color: invitation.themeColor.primary }}>
        One Last Thing...
      </h2>

      <div className="min-h-[60px] flex items-center justify-center">
        <p className="text-2xl sm:text-3xl font-bold" style={{ color: invitation.themeColor.primary }}>
          {typedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </p>
      </div>

      {!isTyping && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentStep('yes')}
            className="px-8 py-3 rounded-full text-white font-bold text-base shadow-lg transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            style={{ backgroundColor: invitation.themeColor.primary }}
          >
            <Heart className="w-5 h-5 fill-current" />
            YES!
          </button>
          <button
            onClick={handleNo}
            className="px-6 py-3 rounded-full text-sm font-semibold border transition-all"
            style={{
              borderColor: invitation.themeColor.primary,
              color: invitation.themeColor.primary,
              transform: `translateX(${Math.random() * (noClicks > 3 ? 30 : 10)}px)`,
            }}
          >
            Not yet...
          </button>
        </motion.div>
      )}

      {noResponse && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs italic"
          style={{ color: invitation.themeColor.primary }}
        >
          {noResponse}
        </motion.p>
      )}
    </ScrollAnimate>
  );

  const renderYes = () => (
    <ScrollAnimate className="max-w-md mx-auto px-6 text-center space-y-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
        <Heart className="w-16 h-16 mx-auto fill-current" style={{ color: invitation.themeColor.primary }} />
      </motion.div>

      <h2 className={`text-3xl sm:text-4xl ${fontClass} font-bold`} style={{ color: invitation.themeColor.primary }}>
        I Knew You'd Say Yes!
      </h2>

      <div className="flex justify-center gap-4">
        <img src="/gifs/holding-heart.gif" alt="" className="h-20 drop-shadow-lg" />
        <img src="/gifs/second.gif" alt="" className="h-20 drop-shadow-lg" />
      </div>

      <p className="text-sm sm:text-base leading-relaxed" style={{ color: invitation.themeColor.text }}>
        This is the beginning of our beautiful story.<br />
        I promise to make every day worth remembering.<br />
        Thank you for saying yes. I love you.
      </p>

      <button
        onClick={() => setCurrentStep('timeline')}
        className="px-8 py-3 rounded-full text-white font-semibold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
        style={{ backgroundColor: invitation.themeColor.primary }}
      >
        <Sparkles className="w-4 h-4" />
        Our Journey Begins
      </button>
    </ScrollAnimate>
  );

  const renderTimeline = () => (
    <ScrollAnimate className="max-w-md mx-auto px-6 space-y-10">
      <div className="text-center space-y-2">
        <h2 className={`text-3xl ${fontClass} font-bold`} style={{ color: invitation.themeColor.primary }}>
          Our Love Story
        </h2>
      </div>

      <div className="relative space-y-8">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: `${invitation.themeColor.primary}30` }} />

        {TIMELINE.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="relative pl-12"
          >
            <div
              className="absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: item.color }}
            />
            <div
              className="p-4 rounded-xl space-y-1"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}`,
              }}
            >
              <h3 className="text-sm font-bold" style={{ color: item.color }}>
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: invitation.themeColor.text }}>
                {item.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <img src="/gifs/holding-heart.gif" alt="" className="h-16 drop-shadow-md" />
        <img src="/gifs/first.gif" alt="" className="h-16 drop-shadow-md" />
        <img src="/gifs/second.gif" alt="" className="h-16 drop-shadow-md" />
      </div>

      <p className="text-sm text-center leading-relaxed italic" style={{ color: invitation.themeColor.primary }}>
        I can't wait to create a lifetime of memories with you.<br />
        Every day with you is a gift I'll never take for granted.<br />
        I love you more than words can say.
      </p>

      {/* Credit */}
      <div className="pt-6 border-t text-center space-y-1.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
        <p className="text-[9px] tracking-wider uppercase font-semibold opacity-40">
          Made with Love on <span className="font-playfair italic font-bold">Invitely</span>
        </p>
        <p className="text-[8px] opacity-30 uppercase tracking-widest">
          Crafted by <a href="https://nextorastudio.tech" target="_blank" rel="noopener noreferrer" className="font-bold hover:opacity-60 transition-opacity">Salah Uddin Kader</a> & Nextora Studio
        </p>
      </div>
    </ScrollAnimate>
  );

  return (
    <div className="space-y-12 pb-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'greeting' && renderGreeting()}
          {currentStep === 'ring' && renderRingBox()}
          {currentStep === 'messages' && renderMessages()}
          {currentStep === 'question' && renderQuestion()}
          {currentStep === 'yes' && renderYes()}
          {currentStep === 'timeline' && renderTimeline()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
