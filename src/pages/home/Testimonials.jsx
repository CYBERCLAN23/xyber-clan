import { useCallback, useEffect, useRef, useState } from 'react';
import { G } from '../../brand/geometry';
import { Reveal, Words } from '../../components/ui/Reveal';
import { T, Img, useT } from '../../lib/content';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { testimonials, testimonialsCopy } from './testimonialsData';

const SECONDS = 8;

/**
 * The client's photo set as the head of the clan figure (the mark's cyan body
 * with the head ellipse), so every voice reads as one of the clan.
 */
function ClanAvatar({ n, className = '' }) {
  const { tr } = useT();
  return (
    <span className={`relative block shrink-0 ${className}`} style={{ aspectRatio: '420 / 350' }}>
      <svg viewBox="1580 582 420 350" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        <path d={G.body} fill="var(--brand-cyan)" />
      </svg>
      <span
        className="absolute overflow-hidden rounded-[50%] bg-blue outline outline-[3px] outline-[var(--paper)]"
        style={{ left: '42.4%', top: 0, width: '57.4%', height: '63.1%', transform: 'rotate(-5.8deg)' }}
      >
        <Img
          k={`testimonials.list.${n}.avatar`}
          src={testimonials[n].avatar}
          alt={tr(`testimonials.list.${n}.author`)}
          className="h-full w-full scale-110 object-cover"
        />
      </span>
    </span>
  );
}

function Attribution({ n }) {
  return (
    <div className="flex items-center gap-5">
      <ClanAvatar n={n} className="w-[76px] md:w-[92px]" />
      <div className="min-w-0">
        <T k={`testimonials.list.${n}.author`} as="p" className="t-title" />
        <p className="t-small text-ink-2">
          <T k={`testimonials.list.${n}.role`} />
          <span aria-hidden="true">, </span>
          <T k={`testimonials.list.${n}.company`} className="text-accent" />
        </p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="flex flex-col gap-4">
      <T k="testimonials.badge" as="p" className="t-small text-ink-3" />
      <T id="testimonials-title" k="testimonials.title" as="h2" className="t-title max-w-[14ch]" />
      <T k="testimonials.subtitle" as="p" className="t-small max-w-[30ch] text-ink-2" />
    </div>
  );
}

function PillArrow({ dir }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`h-4 w-4 transition-transform duration-500 ease-[var(--ease-out)] ${dir === 'prev' ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`}>
      <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Testimonials: one voice at a time, large; the spark fills while it speaks. */
export default function Testimonials() {
  const { lang, tr, isEditing } = useT();
  const copy = testimonialsCopy[lang] || testimonialsCopy.en;
  const root = useRef(null);
  const tween = useRef(null);
  const holdRef = useRef(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const count = testimonials.length;

  useEffect(() => {
    const ok = !reducedMotion();
    setCanAnimate(ok);
    if (!ok) setPlaying(false);
  }, []);

  const go = useCallback((n) => setActive(((n % count) + count) % count), [count]);

  // Progress pill for the active quote; when it fills, the next quote comes in.
  useEffect(() => {
    if (isEditing || !root.current) return undefined;
    const fills = root.current.querySelectorAll('[data-fill]');
    fills.forEach((el, idx) => gsap.set(el, { scaleX: idx < active ? 1 : 0 }));
    const fill = fills[active];
    if (!fill) return undefined;
    if (!playing) {
      gsap.set(fill, { scaleX: 1 });
      return undefined;
    }
    tween.current = gsap.fromTo(fill, { scaleX: 0 }, {
      scaleX: 1,
      duration: SECONDS,
      ease: 'none',
      paused: holdRef.current,
      onComplete: () => go(active + 1),
    });
    return () => { tween.current?.kill(); tween.current = null; };
  }, [active, playing, isEditing, go]);

  useEffect(() => {
    holdRef.current = hold;
    if (!tween.current) return;
    if (hold) tween.current.pause();
    else tween.current.resume();
  }, [hold]);

  // The incoming quote rises out of its line masks.
  useGSAP(() => {
    if (isEditing || !canAnimate) return;
    const slide = root.current.querySelector(`[data-slide="${active}"]`);
    if (!slide) return;
    gsap.fromTo(slide.querySelectorAll('.xc-word'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: EASE.out, stagger: 0.018 });
    gsap.fromTo(slide.querySelector('[data-attr]'), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, delay: 0.25, ease: EASE.out });
  }, { scope: root, dependencies: [active, isEditing, canAnimate, lang] });

  if (isEditing) {
    return (
      <section aria-labelledby="testimonials-title" className="section">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-3"><Heading /></div>
          <ol className="flex flex-col gap-16 lg:col-span-9">
            {testimonials.map((_, n) => (
              <li key={n} className="flex flex-col gap-8">
                <T k={`testimonials.list.${n}.quote`} as="p" className="t-headline" multiline />
                <Attribution n={n} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };

  return (
    <section
      ref={root}
      aria-labelledby="testimonials-title"
      aria-roledescription={copy.carousel}
      className="section"
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHold(false); }}
    >
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
        <Reveal className="flex flex-col justify-between gap-12 lg:col-span-3">
          <Heading />
        </Reveal>

        <div className="lg:col-span-9">
          <div className="grid" aria-live={playing && !hold ? 'off' : 'polite'}>
            {testimonials.map((_, n) => {
              const on = n === active;
              return (
                <figure
                  key={n}
                  data-slide={n}
                  role="group"
                  aria-roledescription={copy.slide}
                  aria-label={`${n + 1} ${copy.of} ${count}`}
                  aria-hidden={on ? undefined : true}
                  inert={on ? undefined : ''}
                  className={`col-start-1 row-start-1 flex flex-col justify-between gap-10 transition-opacity duration-500 ease-[var(--ease-out)] md:gap-14 ${on ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                >
                  <blockquote>
                    <p className="text-[clamp(1.75rem,3.4vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.032em] [text-wrap:balance] -indent-[0.42em]">
                      <span aria-hidden="true" className="text-accent">“</span>
                      <Words text={tr(`testimonials.list.${n}.quote`)} />
                      <span aria-hidden="true" className="text-accent">”</span>
                    </p>
                  </blockquote>
                  <figcaption data-attr><Attribution n={n} /></figcaption>
                </figure>
              );
            })}
          </div>

          {/* Controls: the spark pills are the progress and the picker. */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 md:mt-16" onKeyDown={onKeyDown}>
            <ol className="flex items-center gap-2.5">
              {testimonials.map((_, n) => (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => go(n)}
                    aria-label={`${copy.show} ${n + 1} ${copy.of} ${count}`}
                    aria-current={n === active ? 'true' : undefined}
                    className="group relative grid h-11 place-items-center"
                  >
                    <span className={`relative block h-2 overflow-hidden rounded-full bg-paper-3 transition-[width] duration-700 ease-[var(--ease-out)] group-hover:bg-ink-3/40 ${n === active ? 'w-24 md:w-32' : 'w-8 md:w-10'}`}>
                      <span
                        data-fill
                        className="absolute inset-0 origin-left rounded-full"
                        style={{ background: 'linear-gradient(90deg, color-mix(in oklab, var(--brand-cyan) 25%, transparent), var(--brand-cyan))', transform: 'scaleX(0)' }}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="flex items-center gap-2">
              {canAnimate && (
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? copy.pause : copy.play}
                  className="grid h-12 w-12 place-items-center rounded-full bg-paper-2 text-ink transition-colors duration-300 hover:bg-paper-3"
                >
                  {playing ? (
                    <span aria-hidden="true" className="flex gap-[5px]"><span className="h-3.5 w-[3px] rounded-full bg-current" /><span className="h-3.5 w-[3px] rounded-full bg-current" /></span>
                  ) : (
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="ml-0.5 h-3.5 w-3.5"><path d="M4 2.5v11l9-5.5z" fill="currentColor" strokeLinejoin="round" /></svg>
                  )}
                </button>
              )}
              <button type="button" onClick={() => go(active - 1)} aria-label={copy.prev} className="group inline-flex h-12 items-center rounded-full bg-paper-2 px-6 transition-colors duration-300 hover:bg-ink hover:text-paper active:scale-[0.97]">
                <PillArrow dir="prev" />
              </button>
              <button type="button" onClick={() => go(active + 1)} aria-label={copy.next} className="group inline-flex h-12 items-center rounded-full bg-ink px-6 text-paper transition-colors duration-300 hover:bg-cyan hover:text-on-cyan active:scale-[0.97]">
                <PillArrow dir="next" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
