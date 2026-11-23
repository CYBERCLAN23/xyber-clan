import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap, EASE, reducedMotion } from '../../../lib/motion';
import { useLenis } from '../../../lib/SmoothScroll';
import { useCMS } from '../../../context/CMSContext';
import { RoundIcon, ICON } from './people';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"], input, textarea';

/**
 * Side drawer for one person: portrait on the left, details on the right.
 * Opening from a card, the card's portrait travels into the drawer (FLIP).
 * role="dialog", Esc closes, focus is trapped and returned, scroll is locked.
 *
 *   <PersonDrawer itemKey={id} titleId="…" label={…} labels={{ close, prev, next }}
 *     origin={cardMediaEl} media={<Portrait … />} onClose onPrev onNext>…</PersonDrawer>
 */
export default function PersonDrawer({ itemKey, titleId, label, labels, origin, media, onClose, onPrev, onNext, children }) {
  const root = useRef(null);
  const backdrop = useRef(null);
  const panel = useRef(null);
  const slot = useRef(null);
  const content = useRef(null);
  const closeBtn = useRef(null);
  const closing = useRef(false);
  const first = useRef(true);
  const lenis = useLenis();
  const { isEditing } = useCMS();
  const animate = !isEditing && !reducedMotion();

  // Scroll lock + focus in / focus back.
  useEffect(() => {
    const last = document.activeElement;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    if (lenis) lenis.stop();
    else html.style.overflow = 'hidden';
    closeBtn.current?.focus({ preventScroll: true });
    return () => {
      if (lenis) lenis.start();
      html.style.overflow = prevOverflow;
      if (last && typeof last.focus === 'function') last.focus({ preventScroll: true });
    };
  }, [lenis]);

  // Entrance; the portrait flies from the card when there is one in view.
  useLayoutEffect(() => {
    if (!animate) return undefined;
    const target = slot.current;
    const r1 = target.getBoundingClientRect();
    const tl = gsap.timeline();
    tl.from(backdrop.current, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 0)
      .from(panel.current, { xPercent: 100, duration: 0.95, ease: EASE.out }, 0)
      .from(content.current.querySelectorAll('[data-stagger]'), { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.07, ease: EASE.out }, 0.3);

    let ghost = null;
    const wide = window.matchMedia('(min-width: 768px)').matches;
    const r0 = origin?.getBoundingClientRect?.();
    const visible = r0 && r0.width > 0 && r0.bottom > 0 && r0.top < window.innerHeight;
    if (wide && visible) {
      ghost = document.createElement('div');
      ghost.className = target.className;
      ghost.setAttribute('aria-hidden', 'true');
      Object.assign(ghost.style, {
        position: 'fixed', left: `${r1.left}px`, top: `${r1.top}px`, width: `${r1.width}px`, height: `${r1.height}px`,
        margin: '0', zIndex: '1000', pointerEvents: 'none', willChange: 'transform',
      });
      [...target.childNodes].forEach((n) => ghost.appendChild(n.cloneNode(true)));
      document.body.appendChild(ghost);
      gsap.set(target, { autoAlpha: 0 });
      gsap.set(origin, { autoAlpha: 0 });
      gsap.fromTo(
        ghost,
        { x: r0.left - r1.left, y: r0.top - r1.top, scaleX: r0.width / r1.width, scaleY: r0.height / r1.height, transformOrigin: '0 0' },
        {
          x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1.05, ease: EASE.inOut,
          onComplete: () => { gsap.set(target, { autoAlpha: 1 }); ghost?.remove(); ghost = null; },
        },
      );
    } else {
      tl.from(target, { autoAlpha: 0, scale: 1.04, duration: 1, ease: EASE.out }, 0.25);
    }
    return () => {
      tl.kill();
      ghost?.remove();
      if (origin) gsap.set(origin, { autoAlpha: 1 });
      gsap.set(target, { autoAlpha: 1 });
    };
    // Runs once per opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Next / previous: the details cross-fade in place.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    panel.current?.scrollTo?.({ top: 0 });
    if (!animate) return;
    gsap.fromTo(slot.current, { autoAlpha: 0, scale: 1.03 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: EASE.out });
    gsap.fromTo(content.current.querySelectorAll('[data-stagger]'), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, ease: EASE.out });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemKey]);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (origin) gsap.set(origin, { autoAlpha: 1 });
    if (!animate) { onClose(); return; }
    gsap.timeline({ onComplete: onClose })
      .to(panel.current, { xPercent: 100, duration: 0.6, ease: EASE.inOut }, 0)
      .to(backdrop.current, { autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0.12);
  }, [animate, onClose, origin]);

  // Keyboard: Esc, Tab trap, arrows for previous / next.
  useEffect(() => {
    const onKey = (e) => {
      const editing = e.target?.isContentEditable;
      if (e.key === 'Escape' && !editing) { e.preventDefault(); requestClose(); return; }
      if (e.key === 'Tab') {
        const nodes = [...root.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement);
        if (!nodes.length) return;
        const firstEl = nodes[0];
        const lastEl = nodes[nodes.length - 1];
        if (e.shiftKey && (document.activeElement === firstEl || !root.current.contains(document.activeElement))) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
        return;
      }
      if (editing || /^(INPUT|TEXTAREA)$/.test(e.target?.tagName)) return;
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [requestClose, onNext, onPrev]);

  const pad = 'px-[clamp(20px,3vw,48px)]';
  const round = 'grid h-11 w-11 place-items-center rounded-full bg-paper-2 text-ink transition-colors duration-300 hover:bg-paper-3 active:scale-95';

  return createPortal(
    <div ref={root} className="fixed inset-0 z-[900]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div ref={backdrop} className="absolute inset-0 bg-[rgba(6,8,9,0.55)]" onClick={requestClose} aria-hidden="true" />
      <div
        ref={panel}
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto overscroll-contain bg-paper text-ink shadow-[-40px_0_120px_-40px_rgba(0,0,0,0.45)] md:w-[min(1120px,92vw)] md:rounded-l-[var(--r-media)]"
      >
        <div className={`sticky top-0 z-10 flex items-center justify-between gap-4 bg-paper py-4 ${pad}`}>
          <span className="t-small text-ink-3">{label}</span>
          <div className="flex items-center gap-2">
            {onPrev && (
              <button type="button" onClick={onPrev} aria-label={labels.prev} className={round}>
                <RoundIcon d={ICON.prev} />
              </button>
            )}
            {onNext && (
              <button type="button" onClick={onNext} aria-label={labels.next} className={round}>
                <RoundIcon d={ICON.next} />
              </button>
            )}
            <button
              ref={closeBtn}
              type="button"
              onClick={requestClose}
              className="group ml-1 inline-flex h-11 items-center gap-2 rounded-full bg-ink pl-5 pr-4 text-[0.95rem] text-paper transition-transform duration-300 active:scale-95"
            >
              {labels.close}
              <RoundIcon d={ICON.close} className="transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-90" />
            </button>
          </div>
        </div>

        <div className={`grid flex-1 gap-[clamp(28px,3.4vw,64px)] pb-[clamp(40px,5vw,80px)] pt-2 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] ${pad}`}>
          <div className="md:sticky md:top-[84px] md:self-start">
            <div ref={slot} className="overflow-hidden rounded-media">{media}</div>
          </div>
          <div ref={content} className="flex min-w-0 flex-col gap-8 md:pt-2">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
