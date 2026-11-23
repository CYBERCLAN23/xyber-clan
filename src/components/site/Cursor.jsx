import { useRef, useState } from 'react';
import { gsap, useGSAP, finePointer, reducedMotion } from '../../lib/motion';

/**
 * The clan figure's head follows the pointer. Over anything with
 * data-cursor="Label" it grows and shows the label. Fine pointers only; the
 * native cursor stays visible.
 */
export default function Cursor() {
  const dot = useRef(null);
  const [label, setLabel] = useState('');
  const [enabled] = useState(() => finePointer() && !reducedMotion());

  useGSAP(() => {
    if (!enabled) return undefined;
    const el = dot.current;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    let shown = false;
    let current = '';
    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) { shown = true; gsap.to(el, { scale: 1, duration: 0.4 }); }
      const target = e.target.closest?.('[data-cursor]');
      const next = target ? target.getAttribute('data-cursor') : '';
      if (next !== current) {
        current = next;
        setLabel(next);
        gsap.to(el, { scale: next ? 1 : 1, width: next ? 84 : 12, height: next ? 84 : 12, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
      }
    };
    const leave = () => { shown = false; gsap.to(el, { scale: 0, duration: 0.3 }); };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, { dependencies: [enabled] });

  if (!enabled) return null;
  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1500] grid h-3 w-3 place-items-center overflow-hidden rounded-full bg-blue text-center text-[0.8rem] font-medium leading-none text-white"
    >
      <span className={`px-2 transition-opacity duration-200 ${label ? 'opacity-100 delay-150' : 'opacity-0'}`}>{label}</span>
    </div>
  );
}
