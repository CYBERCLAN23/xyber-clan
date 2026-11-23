import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reducedMotion } from './motion';

const LenisContext = createContext(null);

/** Smooth scrolling for the whole site, wired into GSAP's ticker and ScrollTrigger. */
export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // New route: start at the top (or at the anchor), then let triggers re-measure.
  useLayoutEffect(() => {
    const go = () => {
      const target = hash ? document.querySelector(hash) : null;
      if (target) {
        if (lenis) lenis.scrollTo(target, { offset: -80, immediate: false, duration: 1.2 });
        else target.scrollIntoView();
      } else if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    };
    if (hash) {
      const id = requestAnimationFrame(go);
      return () => cancelAnimationFrame(id);
    }
    go();
    return undefined;
  }, [pathname, hash, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** The Lenis instance (null when reduced motion is on). */
export const useLenis = () => useContext(LenisContext);

/** Scroll to an element, selector or y position, smooth when possible. */
export function useScrollTo() {
  const lenis = useLenis();
  const ref = useRef(lenis);
  ref.current = lenis;
  return (target, opts = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (ref.current) ref.current.scrollTo(el ?? target, { offset: -80, duration: 1.2, ...opts });
    else if (el?.scrollIntoView) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: Number(target) || 0, behavior: 'smooth' });
  };
}
