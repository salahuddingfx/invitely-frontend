import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: string; // ISO date string
  themeColor: {
    primary: string;
    text: string;
  };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, themeColor }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60) % 24));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds }
  ];

  if (timeLeft.isExpired) {
    return (
      <div className="text-center py-6">
        <p className="text-lg font-bold uppercase tracking-wider font-playfair animate-pulse-slow" style={{ color: themeColor.primary }}>
          The Big Day Has Arrived!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 max-w-[280px] mx-auto text-center">
      {units.map((unit, idx) => (
        <div
          key={idx}
          className="p-3 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/5 flex flex-col items-center justify-center shadow-md relative overflow-hidden h-20"
        >
          {/* Animated Value Box with Framer Motion slide-fade */}
          <div className="h-8 overflow-hidden relative w-full flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className="text-2xl font-bold tracking-tight leading-none absolute"
                style={{ color: themeColor.primary }}
              >
                {String(unit.value).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="text-[9px] uppercase font-bold tracking-wider opacity-60 mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};
