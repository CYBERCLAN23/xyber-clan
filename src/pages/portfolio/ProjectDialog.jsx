import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../components/ui/Button';
import { T, useT } from '../../lib/content';
import { useLenis } from '../../lib/SmoothScroll';
import { gsap, EASE, reducedMotion } from '../../lib/motion';
import { metaLabels } from './data';
import ProjectMedia from './ProjectMedia';
import { say } from './copy';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Project detail: a panel that slides over the page with the project's picture
 * large, its facts and description, the live link and the next project.
 */
export default function ProjectDialog({ project, next, onClose, onNext, c }) {
  const { lang } = useT();
  const lenis = useLenis();
  const scrim = useRef(null);
  const panel = useRef(null);
  const closeBtn = useRef(null);
  const closing = useRef(false);
  const returnTo = useRef(null);

  // Open: lock the page, move focus in, animate the panel.
  useEffect(() => {
    returnTo.current = document.activeElement;
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    closeBtn.current?.focus({ preventScroll: true });
    if (!reducedMotion()) {
      const desk = window.matchMedia('(min-width: 768px)').matches;
      gsap.fromTo(scrim.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: EASE.soft });
      gsap.fromTo(panel.current, desk ? { xPercent: 100 } : { yPercent: 100 }, { xPercent: 0, yPercent: 0, duration: 0.9, ease: EASE.out });
    }
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
      if (returnTo.current?.focus) returnTo.current.focus({ preventScroll: true });
    };
  }, [lenis]);

  // Switching project inside the panel: bring the new content in.
  useEffect(() => {
    if (reducedMotion() || !panel.current) return;
    panel.current.scrollTop = 0;
    gsap.fromTo(panel.current.querySelectorAll('[data-in]'), { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, delay: 0.15, ease: EASE.out });
  }, [project.id]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (reducedMotion()) { onClose(); return; }
    const desk = window.matchMedia('(min-width: 768px)').matches;
    gsap.to(scrim.current, { autoAlpha: 0, duration: 0.45, ease: EASE.soft });
    gsap.to(panel.current, { ...(desk ? { xPercent: 100 } : { yPercent: 100 }), duration: 0.55, ease: EASE.inOut, onComplete: onClose });
  }, [onClose]);

  // Esc closes; Tab stays inside the panel.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = [...panel.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const rows = [
    { label: metaLabels.Category[lang], value: say(c, project.category) },
    { label: metaLabels.Status[lang], value: say(c, project.status) },
    { label: metaLabels.Geography[lang], value: say(c, project.geography) },
    { label: metaLabels.Industry[lang], value: say(c, project.industry) },
  ];
  const hasLink = project.url && project.url !== '#';

  return createPortal(
    <div className="fixed inset-0 z-[1000]">
      <div ref={scrim} onClick={close} aria-hidden="true" className="absolute inset-0 bg-[rgba(8,12,14,0.55)]" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        data-lenis-prevent
        className="absolute inset-x-0 bottom-0 top-[max(48px,6vh)] overflow-y-auto overscroll-contain rounded-t-card bg-paper text-ink shadow-[0_-24px_80px_rgba(0,0,0,0.25)] md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[min(880px,94vw)] md:rounded-l-card md:rounded-tr-none md:shadow-[-24px_0_80px_rgba(0,0,0,0.25)]"
      >
        <div className="sticky top-0 z-[2] flex items-center justify-between gap-4 bg-paper px-[clamp(20px,3.2vw,48px)] py-4">
          <p className="t-small text-ink-3">{say(c, project.category)}</p>
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-paper-2 pl-5 pr-4 text-[0.95rem] font-medium transition-colors duration-300 hover:bg-paper-3 active:scale-[0.97]"
          >
            <T k="portfolioPage.close" fb={c.close} />
            <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-90" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-[clamp(20px,3.2vw,48px)] pb-[clamp(32px,4vw,56px)]">
          <div data-in className="aspect-[4/3] overflow-hidden rounded-media sm:aspect-[16/10]">
            <ProjectMedia key={project.id} project={project} size="dialog" eager />
          </div>

          <h2 id="project-title" data-in className="t-headline mt-[clamp(28px,3.5vw,48px)]">{project.client}</h2>
          <p data-in className="t-lead mt-5 max-w-[52ch] text-ink-2">{project.description}</p>

          <dl data-in className="mt-8 grid grid-cols-2 gap-3">
            {rows.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1 rounded-card bg-paper-2 px-5 py-4">
                <dt className="t-small text-ink-3">{label}</dt>
                <dd className="text-[1.08rem] font-medium tracking-[-0.01em]">{value}</dd>
              </div>
            ))}
          </dl>

          {hasLink && (
            <div data-in className="mt-8">
              <Button href={project.url} size="lg"><T k="portfolioPage.visitSite" /></Button>
            </div>
          )}

          {next && next.id !== project.id && (
            <button
              data-in
              type="button"
              onClick={onNext}
              data-cursor={c.view}
              className="group mt-[clamp(40px,5vw,72px)] flex w-full items-center gap-5 rounded-card bg-paper-2 p-3 pr-6 text-left transition-colors duration-500 hover:bg-paper-3 active:scale-[0.99]"
            >
              <span className="h-20 w-28 shrink-0 overflow-hidden rounded-[14px] sm:h-24 sm:w-36">
                <ProjectMedia key={next.id} project={next} size="thumb" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <T k="portfolioPage.nextProject" fb={c.next} className="t-small text-ink-3" />
                <span className="t-title truncate">{next.client}</span>
              </span>
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
                <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0.5">
                  <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
