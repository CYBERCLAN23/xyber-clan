import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../components/ui/Button';
import { useLenis } from '../../lib/SmoothScroll';
import { gsap, EASE, reducedMotion } from '../../lib/motion';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <path d={dir === 'left' ? 'M10 3.5 5.5 8l4.5 4.5' : 'M6 3.5 10.5 8 6 12.5'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Photos of one event, cross-fading; arrows, keys and swipe move between them. */
function Gallery({ images, title, objectPosition, c, index, setIndex }) {
  const start = useRef(null);
  const n = images.length;
  const go = (d) => setIndex((i) => (i + d + n) % n);
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      role="group"
      aria-roledescription="carousel"
      aria-label={title}
      onPointerDown={(e) => { start.current = e.clientX; }}
      onPointerUp={(e) => {
        if (start.current == null || n < 2) return;
        const dx = e.clientX - start.current;
        start.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      {images.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`${title} - ${i + 1}`}
          aria-hidden={i !== index}
          decoding="async"
          draggable="false"
          style={{ objectPosition }}
          className={`absolute inset-0 h-full w-full select-none object-contain p-5 transition-[opacity,transform] duration-700 ease-[var(--ease-out)] md:p-10 ${i === index ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'}`}
        />
      ))}
      {n > 1 && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2 md:bottom-6 md:left-6">
          <button type="button" onClick={() => go(-1)} aria-label={c.prev} className="grid h-11 w-11 place-items-center rounded-full bg-paper text-ink transition-[background-color,color,transform] duration-300 hover:bg-cyan hover:text-on-cyan active:scale-95">
            <Chevron dir="left" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={c.next} className="grid h-11 w-11 place-items-center rounded-full bg-paper text-ink transition-[background-color,color,transform] duration-300 hover:bg-cyan hover:text-on-cyan active:scale-95">
            <Chevron dir="right" />
          </button>
          <span className="t-small tabular rounded-full bg-paper px-3.5 py-2 text-ink" aria-live="polite">
            {c.photo} {index + 1} / {n}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Full detail of one event: its photos, type, date, status, focus, the whole
 * description and, when there is one, the link to the external post.
 */
export default function EventDialog({ ev, onClose, c, calendar }) {
  const overlay = useRef(null);
  const panel = useRef(null);
  const closeBtn = useRef(null);
  const closing = useRef(false);
  const lenis = useLenis();
  const [index, setIndex] = useState(0);
  const titleId = `event-dialog-title-${ev.id}`;
  const n = ev.images.length;

  useEffect(() => {
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus({ preventScroll: true });
    if (!reducedMotion()) {
      gsap.fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(panel.current, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: EASE.out, delay: 0.04 });
      gsap.from(panel.current.querySelectorAll('[data-dpart]'), { y: 18, autoAlpha: 0, duration: 0.75, stagger: 0.06, delay: 0.22, ease: EASE.out });
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus({ preventScroll: true });
    };
    // Runs once per opened event.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (reducedMotion()) {
      onClose();
      return;
    }
    gsap.to(panel.current, { y: 40, autoAlpha: 0, duration: 0.35, ease: 'power2.in' });
    gsap.to(overlay.current, { autoAlpha: 0, duration: 0.4, delay: 0.05, onComplete: onClose });
  }, [onClose]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key === 'ArrowRight' && n > 1) setIndex((i) => (i + 1) % n);
    if (e.key === 'ArrowLeft' && n > 1) setIndex((i) => (i - 1 + n) % n);
    if (e.key === 'Tab') {
      const nodes = [...panel.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const meta = [
    [c.metaType, ev.type],
    [c.metaDate, ev.date],
    [c.metaStatus, ev.upcoming ? c.statusUpcoming : c.statusCompleted],
    [c.metaFocus, c.focusValue],
  ];

  return createPortal(
    <div
      ref={overlay}
      className="fixed inset-0 z-[1000] flex bg-[rgba(8,10,11,0.6)] md:p-4 lg:p-6"
      onMouseDown={(e) => { if (e.target === overlay.current) close(); }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        className="relative mx-auto flex h-full w-full max-w-[1520px] flex-col overflow-hidden bg-paper shadow-[0_40px_120px_-30px_rgba(0,0,0,0.55)] md:rounded-card"
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          className="t-small absolute right-4 top-4 z-10 inline-flex h-11 items-center gap-2 rounded-full bg-paper-2 pl-3.5 pr-4 font-medium text-ink transition-[background-color,transform] duration-300 hover:bg-paper-3 active:scale-95 md:right-6 md:top-6"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {c.close}
        </button>

        <div className="flex-1 overflow-y-auto lg:grid lg:grid-cols-2 lg:overflow-hidden" data-lenis-prevent>
          <div className="relative h-[46vh] bg-paper-2 lg:h-full">
            <Gallery images={ev.images} title={ev.title} objectPosition={ev.objectPosition} c={c} index={index} setIndex={setIndex} />
          </div>

          <div className="flex flex-col px-6 pb-12 pt-8 md:px-12 md:pt-24 lg:overflow-y-auto lg:px-16 lg:pb-16" data-lenis-prevent>
            <p data-dpart className="t-small text-ink-3">{c.panelLabel}</p>
            <h2 id={titleId} data-dpart className="t-title mt-4 max-w-[28ch] lg:text-[clamp(1.75rem,2.3vw,2.4rem)] lg:leading-[1.08]">
              {ev.title}
            </h2>

            <dl data-dpart className="mt-9 grid grid-cols-2 gap-2">
              {meta.map(([label, value]) => (
                <div key={label} className="rounded-card bg-paper-2 px-4 py-3.5 md:px-5 md:py-4">
                  <dt className="t-small text-ink-3">{label}</dt>
                  <dd className="t-body mt-1 font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            <p data-dpart className="t-body mt-9 max-w-[62ch] whitespace-pre-line text-ink-2">{ev.description}</p>

            {(ev.url || calendar) && (
              <div data-dpart className="mt-10 flex flex-wrap gap-3">
                {calendar && <Button href={calendar} size="md">{c.addToCalendar}</Button>}
                {ev.url && <Button href={ev.url} variant="secondary" size="md">{c.externalPost}</Button>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
