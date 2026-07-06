import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScratchCardProps {
  width?: number;
  height?: number;
  revealText: string;
  themeColor: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  onReveal?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  width = 280,
  height = 100,
  revealText,
  themeColor,
  onReveal
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  // Use refs for drawing state to avoid stale closure issues in native event listeners
  const isDrawingRef = useRef(false);
  const isScratchedRef = useRef(false);
  const [size, setSize] = useState({ w: width, h: height });

  // Update canvas bounds to match parent dimensions dynamically
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      setSize({ w: rect.width || width, h: rect.height || height });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [width, height]);

  // Draw the golden foil overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setIsScratched(false);
    isScratchedRef.current = false;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    ctx.scale(dpr, dpr);

    const w = size.w;
    const h = size.h;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#d4af37');
    grad.addColorStop(0.2, '#f9f5d7');
    grad.addColorStop(0.4, '#b8860b');
    grad.addColorStop(0.6, '#f3e5ab');
    grad.addColorStop(0.8, '#aa7c11');
    grad.addColorStop(1, '#d4af37');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 35; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 1.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, 5, w - 10, h - 10);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.strokeRect(8, 8, w - 16, h - 16);

    const sealX = w / 2;
    const sealY = h / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.beginPath();
    ctx.arc(sealX, sealY + 1, 20, 0, Math.PI * 2);
    ctx.fill();

    const sealGrad = ctx.createRadialGradient(sealX, sealY, 2, sealX, sealY, 18);
    sealGrad.addColorStop(0, '#fef08a');
    sealGrad.addColorStop(0.8, '#d4af37');
    sealGrad.addColorStop(1, '#a16207');
    ctx.fillStyle = sealGrad;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const hx = sealX, hy = sealY - 2;
    ctx.moveTo(hx, hy + 3);
    ctx.bezierCurveTo(hx, hy, hx - 4, hy - 3, hx - 6, hy - 1);
    ctx.bezierCurveTo(hx - 8, hy + 2, hx, hy + 6, hx, hy + 8);
    ctx.bezierCurveTo(hx, hy + 6, hx + 8, hy + 2, hx + 6, hy - 1);
    ctx.bezierCurveTo(hx + 4, hy - 3, hx, hy, hx, hy + 3);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH WITH LOVE', sealX, h - 14);
  }, [size, themeColor]);

  // ── Register touchmove with { passive: false } imperatively ──────────────
  // React's synthetic onTouchMove is always passive in modern browsers, which
  // prevents calling e.preventDefault(). We bypass it by attaching the native
  // listener directly with passive:false so we can stop scroll while scratching.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDrawingRef.current || isScratchedRef.current) return;
      e.preventDefault();

      const ctx = canvas.getContext('2d');
      if (!ctx || e.touches.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) * (size.w / rect.width);
      const y = (touch.clientY - rect.top) * (size.h / rect.height);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 26;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparent = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
      }
      if (transparent / (pixels.length / 4) > 0.4) {
        isScratchedRef.current = true;
        setIsScratched(true);
        if (onReveal) onReveal();
      }
    };

    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => canvas.removeEventListener('touchmove', handleTouchMove);
  }, [size, onReveal]);

  const getCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (size.w / rect.width),
      y: (e.clientY - rect.top) * (size.h / rect.height)
    };
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawingRef.current || isScratchedRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const coords = getCoordinates(e);
    if (!canvas || !ctx || !coords) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 26;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    checkPercentage();
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isScratchedRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let x = 0, y = 0;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      x = (e.touches[0].clientX - rect.left) * (size.w / rect.width);
      y = (e.touches[0].clientY - rect.top) * (size.h / rect.height);
    } else {
      x = (e.clientX - rect.left) * (size.w / rect.width);
      y = (e.clientY - rect.top) * (size.h / rect.height);
    }

    isDrawingRef.current = true;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    setIsDrawing(false);
  };

  const checkPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    if (transparent / (pixels.length / 4) > 0.4) {
      isScratchedRef.current = true;
      setIsScratched(true);
      if (onReveal) onReveal();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100px] overflow-hidden select-none touch-none rounded-2xl bg-gradient-to-br from-amber-50 to-[#fcfaf2] border border-amber-200/50 shadow-inner flex flex-col items-center justify-center p-4"
    >
      {/* Revealed content underneath */}
      <div className="text-center space-y-1 z-0">
        <span className="block text-[8px] font-bold tracking-wider text-amber-600 uppercase">Revealed Event Date</span>
        <div className="font-serif font-bold text-xs text-amber-955 uppercase tracking-widest leading-snug px-3">
          {revealText}
        </div>
      </div>

      {/* Scratch canvas overlay — onTouchMove intentionally omitted; handled via native listener */}
      <AnimatePresence>
        {!isScratched && (
          <motion.canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
          />
        )}
      </AnimatePresence>

      {/* Swipe Guide Hand Overlay */}
      {!isDrawing && !isScratched && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.div
            animate={{ x: [-35, 35, -35], y: [-3, 3, -3], rotate: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
            className="text-amber-600 bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded-full border border-amber-200/50 shadow-md flex items-center justify-center gap-1.5 backdrop-blur-xs select-none scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v9" />
              <path d="M6 15v-1.5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2V18a6 6 0 0 0 6 6h4a8 8 0 0 0 8-8v-3a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2" />
            </svg>
            <span className="text-[8px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-250">Scratch Here</span>
          </motion.div>
        </div>
      )}
    </div>
  );
};
