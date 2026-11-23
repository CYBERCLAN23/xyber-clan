import { useRef, useState } from 'react';
import Logo from '../../brand/Logo';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { isHolidaySeason } from '../../utils/festive';

const KEY = 'xc-intro-v3';

/**
 * First visit of a session: the five pieces of the mark assemble, then the
 * curtain lifts. Skipped for reduced motion and on return visits.
 */
export default function Preloader() {
  const [show, setShow] = useState(() => {
    try {
      const play = !sessionStorage.getItem(KEY) && !reducedMotion() && !window.location.pathname.startsWith('/xypanel-');
      window.__xcIntroPlaying = play;
      return play;
    } catch {
      return false;
    }
  });
  const root = useRef(null);

  useGSAP(() => {
    if (!show) return;
    try { sessionStorage.setItem(KEY, '1'); } catch { /* private mode */ }
    const q = (p) => root.current.querySelector(`[data-part="${p}"]`);
    document.documentElement.style.overflow = 'hidden';

    const tl = gsap.timeline({
      defaults: { ease: EASE.out },
      onComplete: () => {
        document.documentElement.style.overflow = '';
        window.__xcIntroPlaying = false;
        setShow(false);
      },
    });
    tl.set(root.current.querySelector('svg'), { autoAlpha: 1 })
      .from(q('x-long'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.9, ease: EASE.snap }, 0.15)
      .from(q('x-short'), { scaleX: 0, transformOrigin: '100% 50%', duration: 0.8, ease: EASE.snap }, 0.45)
      .from(q('spark'), { x: -260, y: 260, autoAlpha: 0, duration: 0.9 }, 0.6)
      .from(q('body'), { scaleY: 0, scaleX: 0.6, transformOrigin: '50% 100%', duration: 1.1, ease: 'elastic.out(1, 0.6)' }, 0.75)
      .from(q('head-group'), { y: -520, duration: 1, ease: 'bounce.out' }, 0.95)
      .from(root.current.querySelector('[data-pre-word]'), { yPercent: 120, duration: 0.8 }, 1.35)
      .to(root.current.querySelector('[data-pre-mark]'), { scale: 0.92, autoAlpha: 0, duration: 0.6, ease: EASE.inOut }, 2.25)
      .to(root.current, { clipPath: 'inset(0% 0% 100% 0% round 0px 0px 56px 56px)', duration: 1, ease: EASE.inOut }, 2.35);
  }, { scope: root, dependencies: [show] });

  if (!show) return null;
  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[2000] grid place-items-center bg-paper" style={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}>
      <div data-pre-mark className="flex flex-col items-center gap-8">
        <Logo variant="symbol" festive={isHolidaySeason()} decorative className="invisible h-auto w-[min(46vw,340px)]" />
        <div className="overflow-hidden">
          <Logo data-pre-word variant="wordmark" decorative className="h-[clamp(18px,2.4vw,26px)] w-auto" />
        </div>
      </div>
    </div>
  );
}
