import { useEffect, useId, useRef, useState } from 'react';
import Logo from '../../brand/Logo';
import Button from '../../components/ui/Button';
import { T, useT } from '../../lib/content';
import { useLenis } from '../../lib/SmoothScroll';
import { gsap, EASE, reducedMotion } from '../../lib/motion';

const exitCopy = {
  en: { close: 'Close', preview: 'Preview exit offer' },
  fr: { close: 'Fermer', preview: 'Aperçu de l’offre de sortie' },
};

/**
 * Exit-intent offer. Same trigger as before: once per session (sessionStorage
 * "exitPopupShown"), armed 5 s after load, fires when the pointer leaves
 * through the top of the window. Shown as a calm bottom sheet.
 */
export default function ExitOffer() {
  const { lang, isEditing } = useT();
  const copy = exitCopy[lang] || exitCopy.en;
  const lenis = useLenis();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [rendered, setRendered] = useState(false);
  const sheet = useRef(null);
  const scrim = useRef(null);
  const lastFocus = useRef(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem('exitPopupShown')) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e) => {
      // Only trigger when mouse leaves from top of screen (attempting to close tab)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Add small delay before enabling exit detection
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000); // Wait 5 seconds before enabling

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  // Mount when asked to show; on hide, slide away first, then unmount.
  useEffect(() => {
    if (isVisible) setRendered(true);
  }, [isVisible]);

  useEffect(() => {
    if (!rendered) return undefined;
    const still = reducedMotion();
    if (isVisible) {
      lastFocus.current = document.activeElement;
      lenis?.stop();
      sheet.current?.focus({ preventScroll: true });
      if (!still) {
        gsap.fromTo(scrim.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: EASE.soft });
        gsap.fromTo(sheet.current, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: EASE.out });
        gsap.from(sheet.current.querySelectorAll('[data-in]'), { y: 18, autoAlpha: 0, duration: 0.8, ease: EASE.out, stagger: 0.07, delay: 0.2 });
      }
      return undefined;
    }
    lenis?.start();
    const done = () => {
      setRendered(false);
      if (lastFocus.current?.focus) lastFocus.current.focus({ preventScroll: true });
    };
    if (still) { done(); return undefined; }
    gsap.to(scrim.current, { autoAlpha: 0, duration: 0.4, ease: EASE.soft });
    gsap.to(sheet.current, { yPercent: 110, duration: 0.55, ease: 'power3.in', onComplete: done });
    return undefined;
  }, [isVisible, rendered, lenis]);

  // Keyboard: Esc closes, Tab stays inside the sheet.
  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); handleClose(); return; }
    if (e.key !== 'Tab') return;
    const items = [...sheet.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === sheet.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return (
    <>
      {isEditing && !rendered && (
        <button
          type="button"
          onClick={() => setIsVisible(true)}
          className="fixed bottom-5 left-5 z-[900] inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.92rem] font-medium text-paper shadow-[0_10px_30px_-10px_rgb(0_0_0/0.4)]"
        >
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cyan" />
          {copy.preview}
        </button>
      )}

      {rendered && (
        <div className="fixed inset-0 z-[9998]" onKeyDown={onKeyDown}>
          <div ref={scrim} onClick={handleClose} aria-hidden="true" className="absolute inset-0 bg-[rgb(11_12_13/0.5)]" />
          <div
            ref={sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            tabIndex={-1}
            className="absolute inset-x-3 bottom-3 mx-auto max-h-[calc(100svh-24px)] max-w-[640px] overflow-y-auto rounded-media bg-paper p-[clamp(20px,3vw,36px)] text-ink shadow-[0_40px_100px_-30px_rgb(0_0_0/0.45)] outline-none md:bottom-6"
            data-lenis-prevent
          >
            <div data-in className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <Logo variant="symbol" decorative className="h-9 w-auto" />
                <span className="t-small inline-flex items-center gap-2 rounded-full bg-paper-2 px-3.5 py-1.5 text-ink-2">
                  <span aria-hidden="true" className="h-1.5 w-4 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-cyan))' }} />
                  <T k="exitPopup.badge" />
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={copy.close}
                className="group relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper-2 transition-colors duration-300 hover:bg-ink hover:text-paper"
              >
                <span aria-hidden="true" className="absolute h-[3px] w-4 rotate-45 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-[135deg]" />
                <span aria-hidden="true" className="absolute h-[3px] w-4 -rotate-45 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45" />
              </button>
            </div>

            <div data-in className="mt-7">
              <T id={titleId} k="exitPopup.title" as="h2" className="t-title" />
              <T k="exitPopup.subtitle" as="p" className="t-small mt-1.5 text-ink-2" />
            </div>

            <div data-in className="mt-6 rounded-card bg-cyan p-[clamp(20px,2.4vw,28px)] text-on-cyan">
              <T k="exitPopup.offerTitle" as="p" className="text-[clamp(1.6rem,3.2vw,2.3rem)] font-semibold leading-[1.02] tracking-[-0.035em]" />
              <T id={bodyId} k="exitPopup.offerBody" as="p" className="t-body mt-3 max-w-[48ch]" />
            </div>

            <div data-in className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <Button to="/start-project" size="lg" onClick={handleClose}><T k="exitPopup.ctaButton" /></Button>
              <button
                type="button"
                onClick={handleClose}
                className="t-small h-12 rounded-full px-5 text-ink-2 transition-colors duration-300 hover:bg-paper-2 hover:text-ink"
              >
                <T k="exitPopup.dismiss" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
