import { useEffect, useRef, useState } from 'react';
import { isHolidaySeason } from '../utils/festive';

/**
 * Festive snowfall (active only in the holiday season, see utils/festive).
 * A few small soft dots drifting down a single canvas: white and brand cyan
 * on dark grounds, cyan and blue on paper. Never intercepts clicks, pauses
 * when the tab is hidden, and is off for reduced motion.
 */
const COUNT_DESKTOP = 34;
const COUNT_MOBILE = 18;

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Snowfall() {
  const canvasRef = useRef(null);
  const [enabled] = useState(() => isHolidaySeason() && !reduced());

  useEffect(() => {
    if (!enabled) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let flakes = [];
    let raf = 0;
    let last = 0;

    const make = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -10,
      r: 0.8 + Math.random() * 1.8,
      speed: 12 + Math.random() * 22, // px per second
      drift: 6 + Math.random() * 14,
      phase: Math.random() * Math.PI * 2,
      tone: Math.random() < 0.6 ? 0 : 1,
      alpha: 0.35 + Math.random() * 0.4,
    });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 768 ? COUNT_MOBILE : COUNT_DESKTOP;
      if (flakes.length !== count) flakes = Array.from({ length: count }, () => make(true));
    };

    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      // ~30fps is plenty for a slow drift and halves the work.
      if (t - last < 32) return;
      const dt = Math.min((t - last) / 1000, 0.1);
      last = t;
      const dark = document.documentElement.classList.contains('dark');
      const tones = dark ? ['255,255,255', '34,196,210'] : ['34,196,210', '39,133,183'];
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.speed * dt;
        f.phase += dt * 0.6;
        const x = f.x + Math.sin(f.phase) * f.drift;
        if (f.y > h + 10) Object.assign(f, make(false));
        ctx.beginPath();
        ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tones[f.tone]},${dark ? f.alpha : f.alpha * 0.7})`;
        ctx.fill();
      }
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };

    resize();
    start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[40] select-none"
      style={{ pointerEvents: 'none' }}
    />
  );
}
