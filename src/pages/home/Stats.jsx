import { useRef } from 'react';
import { T, useT } from '../../lib/content';
import { SplitText } from '../../components/ui/Reveal';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { stats } from './statsData';

const DIGITS = Array.from({ length: 20 }, (_, k) => k % 10);

/** A figure whose digits roll into place like an odometer. Reads as plain text. */
function Figure({ value, suffix }) {
  const digits = String(value).split('').map(Number);
  return (
    <>
      <span className="sr-only">{`${value}${suffix}`}</span>
      <span aria-hidden="true" className="inline-flex items-start">
        {digits.map((d, i) => (
          <span key={i} className="relative inline-block h-[1em] overflow-hidden">
            <span data-strip data-digit={d} className="block" style={{ transform: `translateY(-${10 + d}em)` }}>
              {DIGITS.map((n, k) => (
                <span key={k} className="block h-[1em]">{n}</span>
              ))}
            </span>
          </span>
        ))}
        {suffix && <span data-suffix className="inline-block">{suffix}</span>}
      </span>
    </>
  );
}

/** Stats: a full cyan chapter with the figures at poster scale. */
export default function Stats() {
  const root = useRef(null);
  const { isEditing, lang } = useT();

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const q = (s) => root.current.querySelectorAll(s);
    gsap.from(q('[data-enter]'), {
      y: 24,
      autoAlpha: 0,
      duration: 1,
      ease: EASE.out,
      stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
    });
    q('[data-stat]').forEach((stat, s) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: stat, start: 'top 85%', once: true }, delay: s * 0.12 });
      const strips = stat.querySelectorAll('[data-strip]');
      strips.forEach((strip, i) => {
        const d = Number(strip.dataset.digit);
        tl.fromTo(strip, { y: 0, yPercent: 0 }, { y: 0, yPercent: -(10 + d) * 5, duration: 2.1 - i * 0.25, ease: 'power3.inOut' }, i * 0.08);
      });
      const suffix = stat.querySelector('[data-suffix]');
      if (suffix) tl.from(suffix, { yPercent: 60, autoAlpha: 0, duration: 0.7, ease: EASE.out }, '-=0.45');
      tl.from(stat.querySelector('dt'), { y: 16, autoAlpha: 0, duration: 0.8, ease: EASE.out }, 0.3);
    });
  }, { scope: root, dependencies: [isEditing] });

  return (
    <section ref={root} aria-labelledby="stats-title" className="bg-cyan text-on-cyan">
      <div className="shell section grid gap-y-[clamp(56px,7vw,96px)] lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <div className="lg:col-span-4">
          <T data-enter k="stats.badge" as="p" className="t-small opacity-75" />
          <SplitText id="stats-title" k="stats.title" className="t-headline mt-4 max-w-[12ch]" />
          <T data-enter k="stats.subtitle" as="p" className="t-lead mt-6 max-w-[28ch]" />
        </div>

        <dl className="grid grid-cols-2 gap-x-[var(--gap)] gap-y-[clamp(48px,6vw,96px)] lg:col-span-8">
          {stats.map((s, i) => (
            <div key={s.key} data-stat className="flex flex-col-reverse">
              <dt className="t-lead mt-4 whitespace-pre-line font-medium">
                <T k={`stats.items.${i}.label`} fb={lang === 'fr' ? s.labelFr : s.label} />
              </dt>
              <dd className="t-mega tabular m-0 leading-none">
                <Figure value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
