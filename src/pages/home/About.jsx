import { useRef } from 'react';
import { Img, T, useT } from '../../lib/content';
import { SplitText } from '../../components/ui/Reveal';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';

const PILLARS = [1, 2, 3];
const ALT = { en: 'The XyberClan team together', fr: "L'équipe XyberClan réunie" };

/** Pill stroke that draws in as its row passes, then the head lands at its end. */
function Indicator() {
  return (
    <svg viewBox="0 0 96 32" className="mt-[0.35em] w-[clamp(48px,5vw,72px)] shrink-0 overflow-visible" aria-hidden="true">
      <line x1="12" y1="16" x2="62" y2="16" stroke="var(--paper-3)" strokeWidth="16" strokeLinecap="round" />
      <line data-draw x1="12" y1="16" x2="62" y2="16" stroke="var(--mark-ink)" strokeWidth="16" strokeLinecap="round" />
      <circle data-dot cx="82" cy="16" r="11" fill="var(--brand-blue)" />
    </svg>
  );
}

/** About: who we are, the real team, and the three things we hold to. */
export default function About() {
  const root = useRef(null);
  const { isEditing, lang } = useT();

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const q = (s) => root.current.querySelectorAll(s);

    // Text and list entrances.
    gsap.from(q('[data-enter]'), {
      y: 28,
      autoAlpha: 0,
      duration: 1.05,
      ease: EASE.out,
      stagger: 0.08,
      scrollTrigger: { trigger: root.current.querySelector('[data-body]'), start: 'top 82%', once: true },
    });

    // The picture: clip opens, then drifts slowly with the scroll.
    const media = root.current.querySelector('[data-media]');
    const img = media.querySelector('img');
    gsap.fromTo(media, { clipPath: 'inset(16% 9% 16% 9% round 48px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      duration: 1.5,
      ease: EASE.out,
      clearProps: 'clipPath',
      scrollTrigger: { trigger: media, start: 'top 85%', once: true },
    });
    if (img) {
      gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, {
        yPercent: 7,
        scale: 1.02,
        ease: 'none',
        scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }

    // Each pillar's indicator draws in as its row crosses the screen.
    q('[data-pillar]').forEach((row) => {
      gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%', end: 'top 52%', scrub: 0.6 } })
        .fromTo(row.querySelector('[data-draw]'), { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', duration: 1 })
        .from(row.querySelector('[data-dot]'), { scale: 0, y: -26, transformOrigin: '50% 50%', ease: 'back.out(2.4)', duration: 0.45 }, 0.7);
    });
  }, { scope: root, dependencies: [isEditing] });

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="shell section">
      <T k="whoWeAre.badge" as="p" className="t-small text-ink-3" />

      <h2 id="about-title" className="t-mega mt-6 max-sm:text-[3.6rem]">
        <SplitText k="whoWeAre.title1" as="span" className="block" />
        <SplitText k="whoWeAre.title2" as="span" delay={0.12} className="block lg:text-right" />
      </h2>

      <div data-body className="mt-[clamp(56px,8vw,128px)] grid gap-y-14 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <div className="lg:col-span-5">
          <div data-media className="relative aspect-[4/5] overflow-hidden rounded-media bg-paper-2 lg:sticky lg:top-[calc(var(--nav-h)+24px)]">
            <Img
              k="whoWeAre.image"
              src="/team/team-group.jpg"
              alt={ALT[lang] || ALT.en}
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%] will-change-transform"
            />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <T data-enter k="whoWeAre.subtitle" as="p" className="t-lead max-w-[34ch] text-ink" />
          <ul className="mt-[clamp(40px,5vw,80px)] flex flex-col gap-[clamp(40px,4.4vw,72px)]">
            {PILLARS.map((n) => (
              <li key={n} data-pillar data-enter className="flex items-start gap-[clamp(16px,2vw,28px)]">
                <Indicator />
                <div className="min-w-0">
                  <h3 className="text-[clamp(1.75rem,3vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                    <T k={`whoWeAre.card${n}Title`} />
                  </h3>
                  <T k={`whoWeAre.card${n}Desc`} as="p" className="t-body mt-4 max-w-[42ch] text-ink-2" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
