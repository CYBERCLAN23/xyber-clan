import { useRef } from 'react';
import Link from '../../components/ui/Link';
import { Arrow } from '../../components/ui/Button';
import { Reveal } from '../../components/ui/Reveal';
import { T, useT } from '../../lib/content';
import { G } from '../../brand/geometry';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { applyHref } from './data';
import { Heading, FigureGlyph } from './bits';

/** The X of the mark: two strokes from opposite sides that meet. */
function XGlyph({ className = '', spark = true, ...rest }) {
  return (
    <svg viewBox="940 560 390 390" className={className} aria-hidden="true" {...rest}>
      {spark && (
      <defs>
        <linearGradient id="xc-join-spark" x1={G.spark.width} y1={G.spark.height / 2} x2="0" y2={G.spark.height / 2} gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      )}
      <g data-x="long"><rect {...G.xLong} fill="currentColor" /></g>
      <g data-x="short"><rect {...G.xShort} fill="currentColor" /></g>
      {spark && <g data-x="spark"><rect {...G.spark} fill="url(#xc-join-spark)" /></g>}
    </svg>
  );
}

/** One way to work with XyberClan; leads to the application form with its type. */
function Choice({ type, glyph, title, line, action }) {
  return (
    <Link
      to={applyHref(type)}
      className="group relative isolate flex min-h-[clamp(280px,26vw,380px)] flex-col justify-between overflow-hidden rounded-card bg-on-cyan p-[clamp(24px,2.6vw,44px)] text-white transition-transform duration-500 ease-[var(--ease-out)] active:scale-[0.985]"
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-[#163033] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-y-100 group-focus-visible:scale-y-100" />
      <span className="flex items-start justify-between gap-6">
        <span className="block h-[clamp(56px,5vw,80px)] w-[clamp(56px,5vw,80px)] transition-transform duration-700 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:rotate-[-8deg]">
          {glyph}
        </span>
        <span className="t-small max-w-[26ch] text-right text-white/70">{line}</span>
      </span>
      <span className="flex flex-col gap-6">
        <span className="t-headline max-w-[14ch]">{title}</span>
        <span className="inline-flex h-12 w-fit items-center gap-2.5 rounded-full bg-white px-6 text-[0.98rem] font-medium text-on-cyan transition-colors duration-500 group-hover:bg-cyan">
          {action}
          <Arrow />
        </span>
      </span>
    </Link>
  );
}

export default function JoinChapter({ c }) {
  const root = useRef(null);
  const { isEditing } = useT();

  // Signature: the two strokes of the X travel in from opposite corners and
  // lock together as the chapter arrives — two sides becoming one mark.
  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const mark = root.current.querySelector('[data-mark]');
    const part = (p) => mark.querySelector(`[data-x="${p}"]`);
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 35%', scrub: 0.6, invalidateOnRefresh: true } })
      .fromTo(part('long'), { x: -520, y: -420, rotate: -28, autoAlpha: 0.2, transformOrigin: '50% 50%' }, { x: 0, y: 0, rotate: 0, autoAlpha: 1, ease: EASE.out }, 0)
      .fromTo(part('short'), { x: 460, y: 380, rotate: 34, autoAlpha: 0.2, transformOrigin: '50% 50%' }, { x: 0, y: 0, rotate: 0, autoAlpha: 1, ease: EASE.out }, 0)
      .fromTo(part('spark'), { x: -260, y: 260, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, ease: EASE.out }, 0.45);
    // Once locked, the spark flicks now and then like a signal.
    const flick = gsap.timeline({ repeat: -1, repeatDelay: 3.8, paused: true });
    flick.to(part('spark'), { x: 34, y: -40, duration: 0.35, ease: 'power2.out' })
      .to(part('spark'), { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 15%', end: 'bottom top', onEnter: () => flick.play(), onLeaveBack: () => flick.pause(0), onLeave: () => flick.pause(), onEnterBack: () => flick.play() } });
  }, { scope: root, dependencies: [isEditing] });

  return (
    <section id="join" ref={root} aria-labelledby="join-title" className="overflow-hidden bg-cyan text-on-cyan">
      <div className="shell grid gap-y-12 py-[var(--section)] lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <div className="flex flex-col justify-end lg:col-span-7">
          <T k="partnersPage.ctaBadge" fb={c.ctaBadge} as="p" className="t-small mb-5 font-medium" />
          <Heading id="join-title" k="partnersPage.ctaHeading" fb={c.ctaHeading} className="t-display max-w-[12ch]" />
          <Reveal delay={0.2}>
            <T k="partnersPage.ctaSubtitle" fb={c.ctaSubtitle} as="p" className="t-lead mt-8 max-w-[44ch]" />
          </Reveal>
        </div>
        <div className="order-first w-[clamp(140px,38vw,200px)] self-center overflow-hidden lg:order-none lg:col-span-4 lg:col-start-9 lg:w-full">
          <XGlyph data-mark className="w-full text-on-cyan" />
        </div>

        <Reveal className="grid gap-[var(--gap)] md:grid-cols-2 lg:col-span-12 lg:mt-[clamp(24px,3vw,56px)]">
          <Choice
            type="partner"
            glyph={<XGlyph spark={false} className="h-full w-full text-white" />}
            title={<T k="partnersPage.ctaPartner" />}
            line={<T k="partnersPage.partnerSubtitle" />}
            action={<T k="partnersPage.ctaPartnerButton" fb={c.ctaPartnerButton} />}
          />
          <Choice
            type="sponsor"
            glyph={<FigureGlyph ring="var(--on-cyan)" className="h-full w-full" />}
            title={<T k="partnersPage.ctaSponsor" />}
            line={<T k="partnersPage.sponsorSubtitle" />}
            action={<T k="partnersPage.ctaSponsorButton" fb={c.ctaSponsorButton} />}
          />
        </Reveal>
      </div>
    </section>
  );
}
