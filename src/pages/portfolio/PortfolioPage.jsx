import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Page from '../../components/site/Page';
import Button from '../../components/ui/Button';
import { SplitText, Reveal } from '../../components/ui/Reveal';
import { T, useT } from '../../lib/content';
import { G } from '../../brand/geometry';
import { gsap, ScrollTrigger, Flip, useGSAP, EASE, reducedMotion, finePointer } from '../../lib/motion';
import { projects, CATEGORIES } from './data';
import copy, { say } from './copy';
import ProjectMedia from './ProjectMedia';
import ProjectDialog from './ProjectDialog';

/** Column spans for the n-th visible project: pairs alternate wide/narrow; a lone last one runs full width. */
function spanFor(i, n) {
  if (n === 1 || (i === n - 1 && n % 2 === 1)) return 'md:col-span-12';
  const wideFirst = Math.floor(i / 2) % 2 === 0;
  const wide = (i % 2 === 0) === wideFirst;
  return wide ? 'md:col-span-6 lg:col-span-7' : 'md:col-span-6 lg:col-span-5';
}

function Filters({ active, onPick, c }) {
  const { tr } = useT();
  const count = (cat) => (cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length);
  return (
    <div>
      <T k="portfolioPage.filterLabel" as="p" id="filter-label" className="t-small mb-4 text-ink-3" />
      <div role="group" aria-labelledby="filter-label" className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const on = cat === active;
          const label = cat === 'All' ? tr('portfolioPage.categories.all', 'All') : say(c, cat);
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(cat)}
              className={`relative isolate inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.95rem] font-medium transition-colors duration-500 ease-[var(--ease-out)] active:scale-[0.97] ${
                on ? 'text-paper' : 'bg-paper-2 text-ink hover:bg-paper-3'
              }`}
            >
              {on && <span data-flip-id="pill" aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-ink" />}
              {label}
              <span className={`tabular text-[0.8rem] ${on ? 'text-paper/60' : 'text-ink-3'}`}>{count(cat)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectCard({ project, span, hidden, onOpen, c }) {
  return (
    <li data-flip-id={`p${project.id}`} data-card className={`col-span-12 ${span} ${hidden ? 'hidden' : ''}`}>
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-haspopup="dialog"
        data-cursor={c.view}
        className="group block w-full text-left"
      >
        <span data-plate className="relative block aspect-[4/3] overflow-hidden rounded-media sm:aspect-auto sm:h-[clamp(340px,36vw,640px)]">
          <ProjectMedia project={project} />
          {project.status === 'Live' && (
            <span className="absolute left-4 top-4 inline-flex h-9 items-center gap-2 rounded-full bg-paper px-3.5 text-[0.85rem] font-medium text-ink">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-70" />
                <span className="relative h-2 w-2 rounded-full bg-cyan" />
              </span>
              {c.live}
            </span>
          )}
        </span>
        <span className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className="t-title transition-colors duration-300 group-hover:text-accent">{project.client}</span>
          <span className="t-small text-ink-3">{say(c, project.category)} · {say(c, project.geography)}</span>
        </span>
        <span className="t-small mt-2 line-clamp-2 block max-w-[62ch] text-ink-2">{project.description}</span>
      </button>
    </li>
  );
}

function Work({ c }) {
  const root = useRef(null);
  const flipState = useRef(null);
  const { isEditing } = useT();
  const [active, setActive] = useState('All');
  const [open, setOpen] = useState(null);

  const visible = useMemo(() => projects.filter((p) => active === 'All' || p.category === active), [active]);

  const pick = (cat) => {
    if (cat === active) return;
    if (!isEditing && !reducedMotion()) flipState.current = Flip.getState(root.current.querySelectorAll('[data-flip-id]'));
    setActive(cat);
  };

  // Filter re-layout: cards glide to their new places; leavers shrink away, newcomers grow in.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      targets: root.current.querySelectorAll('[data-flip-id]'),
      duration: 0.9,
      ease: EASE.out,
      absolute: true,
      scale: false,
      simple: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.7, delay: 0.15, ease: EASE.out }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.4, ease: EASE.soft }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [active]);

  // Signature: each project grows into place as it arrives, its picture settling inside the plate.
  // On fine pointers the picture leans toward the pointer.
  useGSAP(() => {
    if (isEditing || reducedMotion()) return undefined;
    const cleanups = [];
    root.current.querySelectorAll('[data-card]').forEach((card) => {
      const plate = card.querySelector('[data-plate]');
      const zoom = card.querySelector('[data-zoom]');
      gsap.fromTo(plate, { scale: 0.86, borderRadius: '72px' }, {
        scale: 1, borderRadius: '32px', ease: 'none',
        scrollTrigger: { trigger: card, start: 'top 100%', end: 'top 45%', scrub: 0.7 },
      });
      gsap.fromTo(zoom, { scale: 1.28 }, {
        scale: 1.06, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      if (finePointer()) {
        const xTo = gsap.quickTo(zoom, 'x', { duration: 0.8, ease: 'power3.out' });
        const yTo = gsap.quickTo(zoom, 'y', { duration: 0.8, ease: 'power3.out' });
        const move = (e) => {
          const r = plate.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width - 0.5) * -22);
          yTo(((e.clientY - r.top) / r.height - 0.5) * -22);
        };
        const leave = () => { xTo(0); yTo(0); };
        plate.addEventListener('pointermove', move);
        plate.addEventListener('pointerleave', leave);
        cleanups.push(() => { plate.removeEventListener('pointermove', move); plate.removeEventListener('pointerleave', leave); });
      }
    });
    gsap.from(root.current.querySelector('[data-filters]'), { y: 24, autoAlpha: 0, duration: 1, delay: 0.7, ease: EASE.out });
    return () => cleanups.forEach((fn) => fn());
  }, { scope: root, dependencies: [isEditing] });

  const index = open ? visible.findIndex((p) => p.id === open.id) : -1;
  const list = index === -1 ? projects : visible;
  const at = open ? list.findIndex((p) => p.id === open.id) : -1;
  const next = open ? list[(at + 1) % list.length] : null;

  return (
    <div ref={root}>
      <header className="shell pt-[calc(var(--nav-h)+clamp(56px,9vw,150px))] pb-[clamp(48px,6vw,96px)]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap)]">
          <SplitText k="portfolioPage.title" as="h1" immediate delay={0.15} className="t-display lg:col-span-7" />
          <div className="flex flex-col gap-10 lg:col-span-5 lg:pb-3">
            <Reveal delay={0.5}>
              <T k="portfolioPage.subtitle" as="p" className="t-lead text-ink-2" />
            </Reveal>
            <div data-filters>
              <Filters active={active} onPick={pick} c={c} />
            </div>
          </div>
        </div>
      </header>

      <section aria-label={c.projects(visible.length)} className="shell pb-[var(--section)]">
        <p className="sr-only" aria-live="polite">{c.projects(visible.length)}</p>
        <ul className="grid grid-cols-12 gap-x-[var(--gap)] gap-y-[clamp(48px,6vw,96px)]">
          {projects.map((p) => {
            const i = visible.indexOf(p);
            return (
              <ProjectCard
                key={p.id}
                project={p}
                hidden={i === -1}
                span={i === -1 ? '' : spanFor(i, visible.length + 1)}
                onOpen={setOpen}
                c={c}
              />
            );
          })}
          <CtaTile span={spanFor(visible.length, visible.length + 1)} />
        </ul>
      </section>

      {open && (
        <ProjectDialog project={open} next={next} onNext={() => setOpen(next)} onClose={() => setOpen(null)} c={c} />
      )}
    </div>
  );
}

/**
 * The last plate in the wall is the visitor's own: a blue field where the clan
 * figure rises, leading to the project form. It joins the re-layout when filtering.
 */
function CtaTile({ span }) {
  const root = useRef(null);
  const { isEditing } = useT();
  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const fig = root.current.querySelector('[data-figure]');
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top 30%', scrub: 0.8 } })
      .fromTo(fig.querySelector('[data-body]'), { yPercent: 60, scaleY: 0.35, transformOrigin: '50% 100%' }, { yPercent: 0, scaleY: 1, ease: EASE.out }, 0)
      .fromTo(fig.querySelector('[data-head]'), { y: -420, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'bounce.out' }, 0.3);
  }, { scope: root, dependencies: [isEditing] });

  return (
    <li ref={root} data-flip-id="cta" data-card className={`col-span-12 ${span}`}>
      <div data-plate className="@container relative flex min-h-[460px] flex-col overflow-hidden rounded-media bg-blue-deep p-[clamp(24px,3vw,48px)] text-white sm:h-[clamp(340px,36vw,640px)]">
        <div className="relative z-[1] flex max-w-[30ch] flex-col">
          <T k="portfolioPage.ctaBadge" as="p" className="t-small mb-4 font-medium text-white/80" />
          <Reveal>
            <T id="portfolio-cta" k="portfolioPage.ctaHeading" as="h2" className="text-[clamp(1.9rem,6.2cqw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.04em]" />
          </Reveal>
        </div>
        <div className="relative z-[1] mt-auto pt-8">
          <Button to="/start-project" variant="light" size="lg" arrow={false}><T k="portfolioPage.ctaLink" /></Button>
        </div>
        <div data-zoom className="pointer-events-none absolute bottom-[-6%] right-[-4%] w-[min(46%,300px)]">
          <svg data-figure viewBox="1585 565 390 400" className="w-full overflow-visible" aria-hidden="true">
            <path data-body d={G.body} fill="var(--brand-cyan)" />
            <g data-head><ellipse {...G.head} fill="#ffffff" stroke="var(--blue-deep)" strokeWidth="22" /></g>
          </svg>
        </div>
      </div>
    </li>
  );
}

export default function PortfolioPage() {
  const { lang } = useT();
  const c = copy[lang] || copy.en;
  return (
    <Page title={c.metaTitle} description={c.metaDescription}>
      <Work c={c} />
    </Page>
  );
}
