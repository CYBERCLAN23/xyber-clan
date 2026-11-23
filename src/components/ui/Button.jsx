import { useRef } from 'react';
import Link from './Link';
import { gsap, useGSAP, finePointer, reducedMotion } from '../../lib/motion';

/** Arrow that slides out and back in on hover. */
export function Arrow({ className = '' }) {
  return (
    <span className={`relative inline-flex h-[1em] w-[1em] overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 16 16" className="xc-arrow absolute inset-0 h-full w-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-[120%]">
        <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 16 16" className="xc-arrow absolute inset-0 h-full w-full -translate-x-[120%] transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0">
        <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const VARIANTS = {
  // Ink pill, cyan floods in from the left on hover (the spark).
  primary: 'bg-ink text-paper [--fill:var(--brand-cyan)] hover:text-on-cyan',
  // On a cyan or blue field.
  onColor: 'bg-[#0d1a1c] text-white [--fill:#ffffff] hover:text-[#0d1a1c]',
  // Quiet tone-step pill.
  secondary: 'bg-paper-2 text-ink [--fill:var(--paper-3)]',
  // Light pill for dark surfaces.
  light: 'bg-white text-[#0d1a1c] [--fill:var(--brand-cyan)]',
};

const SIZES = {
  md: 'h-12 px-6 text-[0.98rem] gap-2.5',
  lg: 'h-14 px-7 text-[1.05rem] gap-3 md:h-16 md:px-8 md:text-[1.1rem]',
  sm: 'h-10 px-4.5 text-[0.92rem] gap-2',
};

/**
 * Pill button (the shape of the X's strokes). Magnetic on fine pointers.
 * Renders a <Link> when `to`/`href` is given, otherwise a <button>.
 */
export default function Button({ to, href, children, variant = 'primary', size = 'md', arrow = true, magnetic = true, className = '', ...rest }) {
  const wrap = useRef(null);
  const inner = useRef(null);

  useGSAP(() => {
    if (!magnetic || !finePointer() || reducedMotion()) return undefined;
    const el = wrap.current;
    const xTo = gsap.quickTo(inner.current, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    const yTo = gsap.quickTo(inner.current, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, { scope: wrap });

  const cls = `group relative isolate inline-flex select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-500 ease-[var(--ease-out)] ${VARIANTS[variant]} ${SIZES[size]}`;
  const content = (
    <>
      <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 rounded-full bg-[var(--fill)] transition-transform duration-[650ms] ease-[var(--ease-out)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      <span className="relative">{children}</span>
      {arrow && <Arrow />}
    </>
  );

  const target = to ?? href;
  return (
    <span ref={wrap} className={`inline-flex ${className}`}>
      <span ref={inner} className="inline-flex">
        {target ? (
          <Link to={target} className={cls} {...rest}>{content}</Link>
        ) : (
          <button type="button" className={cls} {...rest}>{content}</button>
        )}
      </span>
    </span>
  );
}
