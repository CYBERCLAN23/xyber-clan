import { useState, useId, useRef } from 'react';
import { G } from '../../brand/geometry';
import { Img, T, useT } from '../../lib/content';
import { SplitText } from '../../components/ui/Reveal';
import Button from '../../components/ui/Button';
import Link from '../../components/ui/Link';
import { gsap, useGSAP, EASE, reducedMotion, finePointer } from '../../lib/motion';
import { teamMembers, roleOf, FACES } from './teamTeaserData';
import { useCMS } from '../../context/CMSContext';

// The clan figure (body + head) in the master space, framed with a little air.
const BOX = { x: 1592, y: 566, w: 422, h: 358 };
const toBox = `scale(${1 / BOX.w} ${1 / BOX.h}) translate(${-BOX.x} ${-BOX.y})`;

/** clipPath (object bounding box units) cut from the mark's body and head. */
function FigureClip({ id }) {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={G.body} transform={toBox} />
          <ellipse cx={G.head.cx} cy={G.head.cy} rx={G.head.rx} ry={G.head.ry} transform={`${toBox} ${G.head.transform}`} />
        </clipPath>
      </defs>
    </svg>
  );
}

// The head's centre inside the figure box, as fractions.
const HEAD_X = (G.head.cx - BOX.x) / BOX.w;
const HEAD_Y = (G.head.cy - BOX.y) / BOX.h;
const BOX_RATIO = BOX.w / BOX.h;

/** Size and place a portrait so its face lands in the head, without leaving gaps. */
function frame([fx, fy, fw, iw, ih]) {
  const ar = ih / iw;
  const sharp = Math.max(1, iw / 270); // do not blow small pictures up past this
  const s = Math.max(1, 1 / (BOX_RATIO * ar), Math.min(0.3 / fw, sharp));
  const h = s * BOX_RATIO * ar;
  const left = Math.min(0, Math.max(1 - s, HEAD_X - fx * s));
  const top = Math.min(0, Math.max(1 - h, HEAD_Y - fy * h));
  const pc = (v) => `${(v * 100).toFixed(2)}%`;
  return { position: 'absolute', width: pc(s), height: pc(h), left: pc(left), top: pc(top), maxWidth: 'none' };
}

function Member({ m, clipId }) {
  const { lang } = useT();
  const { isEditing, getContent } = useCMS();
  const role = roleOf(m.key, lang);
  // Only frame the original pictures; a replaced picture is simply cropped to fill.
  const original = getContent(`en.team.${m.key}.image`, m.image) === m.image;
  // Replaced pictures: once loaded, frame them as a typical portrait (face upper-centre).
  const [dims, setDims] = useState(null);
  const face = original ? FACES[m.key] : dims && [0.5, 0.3, 0.34, dims[0], dims[1]];
  const framed = !isEditing && Boolean(face);
  return (
    <li data-member className="w-[clamp(232px,24vw,360px)] shrink-0 snap-start">
      <Link
        to="/team"
        data-cursor="View"
        draggable={false}
        className="group block rounded-card outline-offset-8"
      >
        <div className="relative aspect-[422/358] transition-transform duration-700 ease-[var(--ease-spring)] group-hover:-translate-y-2 group-focus-visible:-translate-y-2">
          <div className="absolute inset-0 overflow-hidden bg-paper-2" style={{ clipPath: `url(#${clipId})` }}>
            <Img
              ck={`en.team.${m.key}.image`}
              src={m.image}
              alt={m.name}
              draggable={false}
              style={framed ? frame(face) : undefined}
              onLoad={original ? undefined : (e) => setDims([e.currentTarget.naturalWidth || 400, e.currentTarget.naturalHeight || 500])}
              className={`${framed ? '' : 'h-full w-full object-cover'} select-none`}
              imageClassName="grayscale transition-[filter,transform] duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04] group-hover:grayscale-0 group-focus-visible:scale-[1.04] group-focus-visible:grayscale-0"
            />
          </div>
          {/* The ring that separates head from body, as in the mark. */}
          <svg viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <ellipse cx={G.head.cx} cy={G.head.cy} rx={G.head.rx} ry={G.head.ry} transform={G.head.transform} fill="none" stroke="var(--paper)" strokeWidth="18" />
          </svg>
        </div>
        <p className="mt-5 text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.02em] transition-colors duration-300 group-hover:text-accent">{m.name}</p>
        <p className="t-small mt-1.5 max-w-[32ch] text-ink-2">{role}</p>
      </Link>
    </li>
  );
}

/** Team teaser: the mark's figure becomes each member of the clan. */
export default function TeamTeaser() {
  const root = useRef(null);
  const row = useRef(null);
  const clipId = `xc-figure-${useId().replace(/:/g, '')}`;
  const { isEditing, tr } = useT();

  useGSAP(() => {
    if (isEditing || reducedMotion()) return undefined;
    gsap.from(root.current.querySelectorAll('[data-enter]'), {
      y: 24,
      autoAlpha: 0,
      duration: 1,
      ease: EASE.out,
      stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
    });
    gsap.from(row.current.querySelectorAll('[data-member]'), {
      y: 64,
      autoAlpha: 0,
      duration: 1.2,
      ease: EASE.out,
      stagger: 0.07,
      scrollTrigger: { trigger: row.current, start: 'top 85%', once: true },
    });

    // Drag to scroll with a mouse; touch and trackpads scroll natively.
    if (!finePointer()) return undefined;
    const el = row.current;
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        el.style.scrollSnapType = 'none';
        el.dataset.dragging = 'true';
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (moved) {
        el.style.scrollSnapType = '';
        delete el.dataset.dragging;
      }
    };
    const onClick = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick, true);
    };
  }, { scope: root, dependencies: [isEditing] });

  const page = (dir) => {
    const el = row.current;
    if (!el) return;
    const card = el.querySelector('[data-member]');
    const step = card ? card.getBoundingClientRect().width * 2 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  const arrowBtn = 'grid h-12 w-12 place-items-center rounded-full bg-paper-2 text-ink transition-[background-color,transform] duration-300 hover:bg-paper-3 active:scale-95';

  return (
    <section ref={root} id="team" aria-labelledby="team-title" className="section relative">
      <FigureClip id={clipId} />
      <div className="shell grid gap-y-6 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <T data-enter k="team_minimal.badge" as="p" className="t-small text-ink-3 lg:col-span-3 lg:pt-4" />
        <div className="lg:col-span-9">
          <SplitText id="team-title" k="team_minimal.title" className="t-display max-w-[13ch] max-sm:text-[2.4rem]" />
          <T data-enter k="team_minimal.subtitle" as="p" className="t-lead mt-6 max-w-[40ch] text-ink-2" />
        </div>
      </div>

      <ul
        ref={row}
        data-cursor="Drag"
        aria-label={tr('team_minimal.title')}
        className="mt-[clamp(48px,6vw,96px)] flex snap-x snap-mandatory gap-[var(--gap)] overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] data-[dragging=true]:cursor-grabbing md:cursor-grab [&::-webkit-scrollbar]:hidden"
        style={{
          paddingInline: 'max(var(--margin), calc((100vw - 1760px) / 2 + var(--margin)))',
          scrollPaddingInline: 'max(var(--margin), calc((100vw - 1760px) / 2 + var(--margin)))',
        }}
      >
        {teamMembers.map((m) => <Member key={m.key} m={m} clipId={clipId} />)}
      </ul>

      <div className="shell mt-10 flex items-center justify-between gap-6">
        <div data-enter>
          <Button to="/team" variant="secondary"><T k="team.viewFullTeam" /></Button>
        </div>
        <div data-enter className="flex gap-2">
          <button type="button" className={arrowBtn} onClick={() => page(-1)} aria-label={tr('form.previous')}>
            <svg viewBox="0 0 16 16" className="h-4 w-4 rotate-180" aria-hidden="true"><path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className={arrowBtn} onClick={() => page(1)} aria-label={tr('form.next')}>
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
