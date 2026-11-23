import { useRef } from 'react';
import Page from '../../components/site/Page';
import { SplitText, Reveal } from '../../components/ui/Reveal';
import { T, Img, useT } from '../../lib/content';
import { useScrollTo } from '../../lib/SmoothScroll';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { IMAGES } from './data';
import copy from './copy';
import { HultStory, GehmitStory, DivLabsStory } from './Stories';
import JoinChapter from './JoinChapter';

/** One partner on the wall: its logo on a white disc (the mark's head), large, on a tone step. */
function WallTile({ id, name, role, cursor, onGo, children }) {
  return (
    <li>
      <a
        href={`#${id}`}
        onClick={(e) => { e.preventDefault(); onGo(`#${id}`); }}
        data-cursor={cursor}
        className="group flex h-full flex-col rounded-media bg-paper-2 p-[clamp(20px,2.2vw,36px)] transition-colors duration-500 ease-[var(--ease-out)] hover:bg-paper-3 focus-visible:bg-paper-3 active:scale-[0.99]"
      >
        <span className="flex aspect-[5/4] items-center justify-center">
          <span data-disc className="grid aspect-square w-[64%] max-w-[300px] place-items-center overflow-hidden rounded-full bg-white text-[#141516] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.05]">
            {children}
          </span>
        </span>
        <span className="mt-6 flex items-end justify-between gap-4">
          <span className="flex flex-col gap-1">
            <span className="t-title">{name}</span>
            <span className="t-small text-ink-2">{role}</span>
          </span>
          <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
            <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0.5">
              <path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </a>
    </li>
  );
}

function Intro({ c }) {
  const root = useRef(null);
  const { isEditing } = useT();
  const scrollTo = useScrollTo();

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const tiles = root.current.querySelectorAll('[data-wall] > li');
    gsap.from(tiles, { y: 48, autoAlpha: 0, duration: 1.1, stagger: 0.09, delay: 0.55, ease: EASE.out });
    gsap.from(root.current.querySelectorAll('[data-disc]'), {
      scale: 0.55, autoAlpha: 0, duration: 1.3, stagger: 0.09, delay: 0.75, ease: EASE.spring,
    });
  }, { scope: root, dependencies: [isEditing] });

  return (
    <header ref={root} className="shell pt-[calc(var(--nav-h)+clamp(56px,9vw,150px))]">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap)]">
        <SplitText k="partnersPage.title" as="h1" immediate delay={0.15} className="t-display lg:col-span-8" />
        <Reveal className="lg:col-span-4 lg:pb-3" delay={0.5}>
          <T k="partnersPage.hero.description" fb={c.heroDescription} as="p" className="t-lead text-ink-2" />
        </Reveal>
      </div>

      <div className="mt-[clamp(48px,6vw,104px)]">
        <T k="partnersPage.wallLabel" fb={c.wallLabel} as="p" className="t-small mb-5 text-ink-3" />
        <ul data-wall className="grid gap-[var(--gap)] sm:grid-cols-3">
          <WallTile id="hult" name={<T k="partnersPage.hultName" fb={c.hultName} />} role={<T k="partnersPage.hultRole" fb={c.hultRole} />} cursor={c.readCursor} onGo={scrollTo}>
            <span className="flex flex-col items-center px-4 text-center">
              <span className="text-[clamp(1.6rem,2.8vw,2.75rem)] font-semibold leading-none tracking-[-0.04em]">Hult Prize</span>
              <span className="mt-2 text-[clamp(1rem,1.3vw,1.25rem)] font-medium text-[#474d51]">UY1</span>
            </span>
          </WallTile>
          <WallTile id="gehmit" name="Gehmit" role={<T k="partnersPage.gehmitRole" fb={c.gehmitRole} />} cursor={c.readCursor} onGo={scrollTo}>
            <Img k="partnersPage.images.gehmitLogo" src={IMAGES.gehmitLogo} alt={c.gehmitLogoAlt} className="h-full w-full object-contain mix-blend-multiply" />
          </WallTile>
          <WallTile id="divlabs" name="DivLabs" role={<T k="partnersPage.divlabsRole" fb={c.divlabsRole} />} cursor={c.readCursor} onGo={scrollTo}>
            <Img k="partnersPage.images.divlabsLogo" src={IMAGES.divlabsLogo} alt={c.divlabsLogoAlt} className="h-[82%] w-[82%] object-contain mix-blend-multiply" />
          </WallTile>
        </ul>
      </div>
    </header>
  );
}

export default function PartnersPage() {
  const { lang } = useT();
  const c = copy[lang] || copy.en;
  return (
    <Page title={c.metaTitle} description={c.metaDescription}>
      <Intro c={c} />
      <HultStory c={c} />
      <GehmitStory c={c} />
      <DivLabsStory c={c} />
      <JoinChapter c={c} />
    </Page>
  );
}
