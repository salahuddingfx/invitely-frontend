import React, { useEffect, useRef } from 'react';

interface FallingPetalsProps {
  primaryColor: string;
}

interface Petal {
  x: number;
  y: number;
  r: number;
  d: number;
  horizontalSpeed: number;
  verticalSpeed: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

export const FallingPetals: React.FC<FallingPetalsProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const petals: Petal[] = [];
    const maxPetals = 40;

    // Premium romantic watercolor petal palettes
    const petalColors = [
      '244, 63, 94',    // Rose Pink
      '251, 113, 133',  // Sakura Pink
      '254, 205, 211',  // Soft Peach
      '255, 240, 245'   // Lavender Blush
    ];

    for (let i = 0; i < maxPetals; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 5 + 5, // size radius
        d: Math.random() * maxPetals,
        horizontalSpeed: Math.random() * 1.2 - 0.6,
        verticalSpeed: Math.random() * 1.3 + 0.6,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 0.03 - 0.015,
        opacity: Math.random() * 0.45 + 0.35,
        color: petalColors[Math.floor(Math.random() * petalColors.length)]
      });
    }

    const drawPetals = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        // Draw organic tapered curved flower petal leaf shape instead of flat ellipse
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(p.r / 1.5, -p.r, p.r, 0);
        ctx.quadraticCurveTo(p.r / 1.5, p.r, 0, 0);
        
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.shadowColor = `rgba(${p.color}, 0.25)`;
        ctx.shadowBlur = 3;
        ctx.fill();
        ctx.restore();

        // Update movement physics
        p.y += p.verticalSpeed;
        p.x += p.horizontalSpeed + Math.sin(p.d) * 0.2;
        p.rotation += p.rotationSpeed;

        // Reset positions if falling off viewport limits
        if (p.y > height || p.x > width || p.x < -p.r) {
          p.x = Math.random() * width;
          p.y = -20;
          p.verticalSpeed = Math.random() * 1.3 + 0.6;
          p.horizontalSpeed = Math.random() * 1.2 - 0.6;
          p.opacity = Math.random() * 0.45 + 0.35;
        }
      });

      animationFrameId = requestAnimationFrame(drawPetals);
    };

    drawPetals();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
};
