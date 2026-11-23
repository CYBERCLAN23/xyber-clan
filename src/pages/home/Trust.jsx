import { useRef } from 'react';
import { Reveal, Words } from '../../components/ui/Reveal';
import { T, useT } from '../../lib/content';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { partners, trustCopy } from './trustData';

const STATS = ['stat1', 'stat2', 'stat3'];

function PartnerChip({ p, hidden, visit }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={hidden ? -1 : undefined}
      aria-label={hidden ? undefined : `${visit} ${p.name}`}
      data-cursor="Open"
      className="group flex h-[clamp(84px,8vw,116px)] shrink-0 items-center gap-5 rounded-full bg-paper-2 pl-[clamp(12px,1vw,16px)] pr-[clamp(28px,3vw,48px)] transition-colors duration-500 ease-[var(--ease-out)] hover:bg-paper-3"
    >
      {p.logo ? (
        <span className="grid aspect-square h-[calc(100%-24px)] place-items-center overflow-hidden rounded-full bg-white">
          <img src={p.logo} alt="" loading="lazy" decoding="async" className="h-[86%] w-[86%] object-contain" />
        </span>
      ) : (
        <span aria-hidden="true" className="ml-[clamp(16px,2vw,32px)]" />
      )}
      <span className="t-title whitespace-nowrap">{p.name}</span>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 -translate-x-1 text-accent opacity-0 transition-all duration-500 ease-[var(--ease-out)] group-hover:translate-x-0 group-hover:opacity-100">
        <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/** Trusted by: the partners pass by, the numbers stand, then the network statement. */
export default function Trust() {
  const { lang, tr, isEditing } = useT();
  const copy = trustCopy[lang] || trustCopy.en;
  const root = useRef(null);
  const text = tr('trust.transitionText', copy.transitionText);

  useGSAP(() => {
    if (isEditing || reducedMotion()) return undefined;
    const q = (s) => root.current.querySelector(s);

    // Marquee: glides; slows to a stop under the pointer or keyboard focus.
    const strip = q('[data-strip]');
    const loop = gsap.to(q('[data-track]'), { xPercent: -50, ease: 'none', duration: 46, repeat: -1 });
    const slow = () => gsap.to(loop, { timeScale: 0, duration: 0.8, ease: EASE.soft, overwrite: true });
    const go = () => gsap.to(loop, { timeScale: 1, duration: 0.8, ease: EASE.soft, overwrite: true });
    strip.addEventListener('pointerenter', slow);
    strip.addEventListener('pointerleave', go);
    strip.addEventListener('focusin', slow);
    strip.addEventListener('focusout', go);

    // Statement: lines rise out of their masks as the page moves; the spark runs underneath.
    const words = root.current.querySelectorAll('[data-statement] .xc-word');
    gsap.timeline({ scrollTrigger: { trigger: q('[data-statement]'), start: 'top 82%', end: 'bottom 52%', scrub: 0.7 } })
      .fromTo(words, { yPercent: 105, opacity: 0.2 }, { yPercent: 0, opacity: 1, stagger: 0.06, ease: 'none' }, 0)
      .fromTo(q('[data-spark]'), { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);

    return () => {
      strip.removeEventListener('pointerenter', slow);
      strip.removeEventListener('pointerleave', go);
      strip.removeEventListener('focusin', slow);
      strip.removeEventListener('focusout', go);
    };
  }, { scope: root, dependencies: [isEditing, lang, text] });

  const still = isEditing || (typeof window !== 'undefined' && reducedMotion());

  return (
    <section ref={root} aria-labelledby="trust-title" className="pb-[var(--section)]">
      <div className="shell grid gap-y-10 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <T id="trust-title" k="trust.title" fb={copy.title} as="h2" className="t-small text-ink-3 lg:col-span-3 lg:pt-3" />
        <Reveal as="dl" className="grid grid-cols-3 gap-[var(--gap)] lg:col-span-9">
          {STATS.map((s) => (
            <div key={s} className="flex flex-col gap-2">
              <dt className="t-small order-2 text-ink-2"><T k={`trust.${s}.label`} fb={copy[s].label} /></dt>
              <dd className="order-1 m-0 text-[clamp(2rem,4.4vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] tabular">
                <T k={`trust.${s}.value`} fb={copy[s].value} />
              </dd>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Partner marquee: full bleed; the copy is aria-hidden and out of the tab order. */}
      <div data-strip className="mt-[clamp(48px,6vw,96px)] overflow-hidden">
        {still ? (
          <ul className="shell flex flex-wrap gap-3">
            {partners.map((p) => <li key={p.name}><PartnerChip p={p} visit={copy.visit} /></li>)}
          </ul>
        ) : (
          <div data-track className="flex w-max">
            {[0, 1].map((copyIdx) => (
              <ul key={copyIdx} aria-hidden={copyIdx === 1 ? true : undefined} className="flex shrink-0 gap-3 pr-3">
                {partners.map((p) => <li key={p.name}><PartnerChip p={p} hidden={copyIdx === 1} visit={copy.visit} /></li>)}
              </ul>
            ))}
          </div>
        )}
      </div>

      {/* The network statement. In edit mode it is plain, clickable text. */}
      <div className="shell mt-[var(--section)] grid gap-y-6 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <T k="trust.network" fb={copy.network} as="p" className="t-small text-ink-3 lg:col-span-3 lg:pt-4" />
        <div data-statement className="lg:col-span-9">
          {isEditing ? (
            <T k="trust.transitionText" fb={copy.transitionText} as="p" className="t-headline" />
          ) : (
            <p className="t-headline"><Words text={text} /></p>
          )}
          <span aria-hidden="true" className="mt-8 block h-3 w-[min(320px,60%)] overflow-hidden rounded-full">
            <span data-spark className="block h-full w-full origin-left rounded-full" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-cyan))' }} />
          </span>
        </div>
      </div>
    </section>
  );
}
