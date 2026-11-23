import { useId, useRef } from 'react';
import Page from '../components/site/Page';
import Button from '../components/ui/Button';
import { T, useT } from '../lib/content';
import { G } from '../brand/geometry';
import { gsap, useGSAP, EASE, reducedMotion, finePointer } from '../lib/motion';

const COPY = {
  en: {
    title: 'Page not found',
    label: 'Error 404, page not found',
    sentence: 'This page wandered off from the clan. Let’s get you back.',
    home: 'Back to home',
    start: 'Start a project',
  },
  fr: {
    title: 'Page introuvable',
    label: 'Erreur 404, page introuvable',
    sentence: 'Cette page s’est éloignée du clan. On vous ramène.',
    home: 'Retour à l’accueil',
    start: 'Démarrer un projet',
  },
};

/** The clan figure on its own (body + head), standing in for the 0. */
function Figure({ svgRef }) {
  const uid = useId().replace(/:/g, '');
  const maskId = `nf-ring-${uid}`;
  return (
    <svg
      ref={svgRef}
      viewBox="1580 570 430 348"
      aria-hidden="true"
      className="mx-[0.04em] inline-block h-[0.72em] w-auto overflow-visible align-baseline"
    >
      <defs>
        <mask id={maskId} fill="white"><path d={G.ring} /></mask>
      </defs>
      <g data-part="figure">
        <path data-part="body" d={G.body} fill="var(--brand-cyan, #22C4D2)" />
        <g data-part="head-group">
          <g data-part="head-look">
            <ellipse {...G.head} fill="var(--brand-blue, #2785B7)" />
            <path d={G.ring} stroke="var(--mark-ring, #fff)" strokeWidth="20" fill="none" mask={`url(#${maskId})`} />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default function NotFound() {
  const root = useRef(null);
  const fig = useRef(null);
  const { lang, tr, isEditing } = useT();
  const c = COPY[lang] || COPY.en;

  useGSAP(() => {
    if (isEditing || reducedMotion()) return undefined;
    const svg = fig.current;
    const part = (p) => svg.querySelector(`[data-part="${p}"]`);
    const body = part('body');
    const head = part('head-group');
    const look = part('head-look');
    const figure = part('figure');

    // Entrance: the 4s rise, the figure grows out of the ground, the head drops in.
    const tl = gsap.timeline({ delay: 0.2, defaults: { ease: EASE.out } });
    tl.from(root.current.querySelectorAll('[data-nf-digit]'), { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0)
      .from(body, { scaleY: 0, scaleX: 0.55, transformOrigin: '50% 100%', duration: 1.2, ease: 'elastic.out(1, 0.55)' }, 0.25)
      .from(head, { y: -520, duration: 1.1, ease: 'bounce.out' }, 0.45)
      .from(root.current.querySelectorAll('[data-nf-fade]'), { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.2);

    // Lost: the head looks one way, then the other, then the figure shrugs.
    const lost = gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 2.2, defaults: { ease: 'power2.inOut' } });
    lost.to(look, { rotate: -16, x: -14, transformOrigin: '50% 90%', duration: 0.6 })
      .to(look, { rotate: -16, duration: 0.7 })
      .to(look, { rotate: 14, x: 12, duration: 0.8 })
      .to(look, { rotate: 14, duration: 0.7 })
      .to(look, { rotate: 0, x: 0, duration: 0.6 })
      .to(body, { scaleY: 0.92, scaleX: 1.05, transformOrigin: '50% 100%', duration: 0.18, ease: 'power2.out' })
      .to(head, { y: 22, duration: 0.18, ease: 'power2.out' }, '<')
      .to(body, { scaleY: 1, scaleX: 1, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      .to(head, { y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }, '<');

    // The head notices the pointer; a click makes the figure hop.
    let cleanup = () => {};
    if (finePointer()) {
      const xTo = gsap.quickTo(head, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.5)' });
      const move = (e) => {
        const r = head.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        xTo(Math.max(-30, Math.min(30, dx / 18)));
      };
      window.addEventListener('pointermove', move, { passive: true });
      cleanup = () => window.removeEventListener('pointermove', move);
    }
    const hop = () => {
      gsap.timeline()
        .to(figure, { y: -90, duration: 0.32, ease: 'power2.out' })
        .to(figure, { y: 0, duration: 0.7, ease: 'bounce.out' });
    };
    svg.style.cursor = 'pointer';
    svg.style.pointerEvents = 'auto';
    svg.addEventListener('click', hop);
    return () => {
      cleanup();
      svg.removeEventListener('click', hop);
    };
  }, { scope: root, dependencies: [isEditing] });

  return (
    <Page title={tr('notFound.title', c.title)} description={tr('notFound.sentence', c.sentence)}>
      <section ref={root} aria-labelledby="nf-title" className="flex min-h-[100svh] flex-col overflow-hidden">
        <div className="shell grid gap-x-[var(--gap)] gap-y-8 pt-[calc(var(--nav-h)+clamp(40px,8vh,120px))] lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <T data-nf-fade k="notFound.label" fb={c.label} as="p" className="t-small text-ink-3" />
            <T data-nf-fade id="nf-title" k="notFound.sentence" fb={c.sentence} as="h1" className="t-headline max-w-[16ch]" />
          </div>
          <div data-nf-fade className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-self-end lg:pb-2">
            <Button to="/" size="lg"><T k="notFound.home" fb={c.home} /></Button>
            <Button to="/start-project" variant="secondary" size="lg" arrow={false}><T k="notFound.start" fb={c.start} /></Button>
          </div>
        </div>

        <div className="shell mt-auto pt-[clamp(48px,8vh,96px)]">
          <p
            role="img"
            aria-label="404"
            className="flex select-none items-baseline justify-center whitespace-nowrap text-[clamp(7rem,38vw,40rem)] lg:text-[min(41vw,44rem)] font-semibold leading-[0.8] tracking-[-0.06em] lg:justify-start"
          >
            <span className="inline-block overflow-hidden pb-[0.02em]"><span data-nf-digit className="inline-block">4</span></span>
            <Figure svgRef={fig} />
            <span className="inline-block overflow-hidden pb-[0.02em]"><span data-nf-digit className="inline-block">4</span></span>
          </p>
          <div className="h-[clamp(24px,4vh,48px)]" />
        </div>
      </section>
    </Page>
  );
}
