import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScrollMaskSectionProps {
  children: React.ReactNode;
  className?: string;
  maskType?: 'circle-reveal' | 'slide-reveal' | 'fade-scale' | 'diagonal-wipe';
  direction?: 'up' | 'down' | 'left' | 'right';
  parallaxOffset?: number;
  delay?: number;
}

export const ScrollMaskSection: React.FC<ScrollMaskSectionProps> = ({
  children,
  className = '',
  maskType = 'circle-reveal',
  direction = 'up',
  parallaxOffset = 0.15,
  delay = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const windowHeight = window.innerHeight;
            // Progress: 0 when element just enters bottom, 1 when fully visible
            const rawProgress = 1 - (rect.top / windowHeight);
            const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);
            setProgress(clampedProgress);
          }
        });
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );

    observer.observe(el);

    const handleScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const rawProgress = 1 - (rect.top / windowHeight);
      const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);
      setProgress(clampedProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getMaskStyle = (): React.CSSProperties => {
    const p = Math.min(Math.max(progress * 1.5 - 0.1, 0), 1);

    switch (maskType) {
      case 'circle-reveal':
        return {
          clipPath: `circle(${p * 110}% at 50% 50%)`
        };
      case 'slide-reveal': {
        const offsets: Record<string, string> = {
          up: `inset(${(1 - p) * 100}% 0 0 0)`,
          down: `inset(0 0 ${(1 - p) * 100}% 0)`,
          left: `inset(0 ${(1 - p) * 100}% 0 0)`,
          right: `inset(0 0 0 ${(1 - p) * 100}%)`
        };
        return { clipPath: offsets[direction] };
      }
      case 'fade-scale':
        return {
          clipPath: `inset(${(1 - p) * 5}% round ${12 - p * 12}px)`,
          transform: `scale(${0.92 + p * 0.08})`
        };
      case 'diagonal-wipe':
        return {
          clipPath: `polygon(0 ${100 - p * 100}%, ${p * 100}% 0, 100% 0, 100% ${p * 100}%, ${100 - p * 100}% 100%, 0 100%)`
        };
      default:
        return {};
    }
  };

  const parallaxY = progress * parallaxOffset * -60;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        style={{
          ...getMaskStyle(),
          transform: parallaxOffset ? `translateY(${parallaxY}px)` : undefined,
          transition: 'clip-path 0.05s ease-out, transform 0.05s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Decorative image wrapper with scroll-based mask and parallax
export const MaskedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  maskType?: ScrollMaskSectionProps['maskType'];
  parallaxOffset?: number;
}> = ({ src, alt, className = '', maskType = 'circle-reveal', parallaxOffset = 0.2 }) => {
  return (
    <ScrollMaskSection maskType={maskType} parallaxOffset={parallaxOffset} className={className}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </ScrollMaskSection>
  );
};
