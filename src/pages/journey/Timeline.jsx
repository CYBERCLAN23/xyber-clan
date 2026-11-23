import { useLayoutEffect, useRef, useState } from 'react';
import { T, Img, useT } from '../../lib/content';
import { useCMS } from '../../context/CMSContext';
import { Words } from '../../components/ui/Reveal';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { copy } from './copy';
import { DEFAULT_OBJECT_POSITION, yearOf } from './data';

/**
 * The clan's story as one continuous line. The route is an ink pill stroke
 * (the X's strokes: thick, round-capped) threaded through every milestone; it
 * draws itself as the page scrolls and the blue head of the mark rides its tip
 * as the "you are here" marker. Wide screens weave the line between alternating
 * photo / text columns; phones run it straight down the left edge.
 */

/** Smooth route through the measured node centres, from the top edge to the bottom edge. */
function routeFor(points, width, height, bulge) {
  const all = [{ x: points[0].x, y: 0 }, ...points, { x: points[points.length - 1].x, y: height }];
  let d = `M${all[0].x} ${all[0].y}`;
  for (let i = 1; i < all.length; i += 1) {
    const a = all[i - 1];
    const b = all[i];
    const dy = b.y - a.y;
    const s = (i % 2 ? 1 : -1) * bulge;
    d += ` C${a.x + s} ${a.y + dy * 0.5} ${b.x + s} ${b.y - dy * 0.5} ${b.x} ${b.y}`;
  }
  return d;
}

export default function Timeline({ events }) {
  const root = useRef(null);
  const svgRef = useRef(null);
  const inkRef = useRef(null);
  const headRef = useRef(null);
  const { lang, isEditing } = useT();
  const { getContent } = useCMS();
  const c = copy[lang] || copy.en;
  const [geo, setGeo] = useState(null);
  const [here, setHere] = useState({ i: -1, on: false });

  const dateOf = (idx) => getContent(`${lang}.journeyPage.event${idx}.date`, events[idx]?.date || '');

  // Measure the node anchors and lay the route through them; re-measure on any size change.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    let last = '';
    const measure = () => {
      const r = el.getBoundingClientRect();
      const nodes = [...el.querySelectorAll('[data-node]')];
      if (!nodes.length || !r.width) return;
      const pts = nodes.map((n) => {
        const b = n.getBoundingClientRect();
        return { x: Math.round(b.left + b.width / 2 - r.left), y: Math.round(b.top + b.height / 2 - r.top) };
      });
      const wide = window.matchMedia('(min-width: 1024px)').matches;
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      const d = routeFor(pts, w, h, wide ? Math.min(150, w * 0.085) : 0);
      const key = `${w}x${h}|${d}`;
      if (key === last) return;
      last = key;
      setGeo({ w, h, d, pts, wide });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [events.length, lang, isEditing]);

  // Signature: the line draws to the reading position and the head rides its tip.
  useGSAP(() => {
    if (!geo || !inkRef.current) return;
    const ink = inkRef.current;
    const head = headRef.current;
    const dots = [...svgRef.current.querySelectorAll('[data-dot]')];
    const items = [...root.current.querySelectorAll('[data-milestone]')];

    if (isEditing || reducedMotion()) {
      gsap.set(ink, { drawSVG: '100%' });
      dots.forEach((dot) => dot.setAttribute('data-on', ''));
      gsap.set(head, { autoAlpha: 0 });
      return;
    }

    // Length along the route for any height (the route only ever moves downward).
    const total = ink.getTotalLength();
    const steps = Math.max(240, Math.ceil(total / 8));
    const ys = new Float32Array(steps + 1);
    for (let i = 0; i <= steps; i += 1) ys[i] = ink.getPointAtLength((total * i) / steps).y;
    const lenAtY = (y) => {
      if (y <= ys[0]) return 0;
      if (y >= ys[steps]) return total;
      let lo = 0;
      let hi = steps;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid;
        else hi = mid;
      }
      const f = (y - ys[lo]) / (ys[hi] - ys[lo] || 1);
      return ((lo + f) / steps) * total;
    };
    const nodeLens = geo.pts.map((p) => lenAtY(p.y));

    let current = -2;
    const proxy = { y: 0 };
    const render = () => {
      const len = Math.max(0.01, lenAtY(proxy.y));
      gsap.set(ink, { drawSVG: `0 ${len}` });
      const p = ink.getPointAtLength(len);
      gsap.set(head, { x: p.x, y: p.y });
      let i = -1;
      while (i + 1 < nodeLens.length && nodeLens[i + 1] <= len + 2) i += 1;
      if (i !== current) {
        current = i;
        dots.forEach((dot, k) => dot.toggleAttribute('data-on', k <= i));
        items.forEach((it, k) => it.toggleAttribute('data-current', k === i));
        setHere((s) => ({ ...s, i }));
      }
    };
    gsap.to(proxy, {
      y: geo.h,
      ease: 'none',
      onUpdate: render,
      scrollTrigger: {
        trigger: root.current,
        start: 'top 58%',
        end: 'bottom 58%',
        scrub: 0.5,
        onToggle: (st) => setHere((s) => ({ ...s, on: st.isActive })),
      },
    });
    gsap.from(head, { scale: 0, transformOrigin: '50% 50%', duration: 0.9, ease: EASE.spring, delay: 0.6 });
    render();
  }, { scope: root, dependencies: [geo, isEditing], revertOnUpdate: true });

  // Each milestone arrives as the line reaches it: year, then text, then picture; photos drift.
  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    root.current.querySelectorAll('[data-milestone]').forEach((it) => {
      const media = it.querySelector('[data-media]');
      const img = media?.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: { trigger: it, start: 'top 78%', once: true } });
      const words = it.querySelectorAll('[data-year] .xc-word');
      if (words.length) tl.from(words, { yPercent: 115, rotate: 4, duration: 1.15, stagger: 0.06 }, 0);
      tl.from(it.querySelectorAll('[data-part]'), { y: 26, autoAlpha: 0, duration: 1, stagger: 0.075 }, 0.12);
      if (media) tl.from(media, { y: 56, scale: 0.94, autoAlpha: 0, duration: 1.25 }, 0.05);
      if (img) {
        gsap.fromTo(img, { yPercent: -5, scale: 1.14 }, {
          yPercent: 5,
          scale: 1.14,
          ease: 'none',
          scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
    });
  }, { scope: root, dependencies: [isEditing, lang, events.length], revertOnUpdate: true });

  const sw = geo?.wide ? 12 : 6;
  const dotR = geo?.wide ? 11 : 7;
  const headR = geo?.wide ? 17 : 11;
  const n = events.length;
  const active = here.i >= 0 ? here.i : 0;

  return (
    <>
      <div ref={root} className="shell relative">
        <svg
          ref={svgRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
          width={geo?.w || 0}
          height={geo?.h || 0}
          viewBox={geo ? `0 0 ${geo.w} ${geo.h}` : undefined}
        >
          {geo && (
            <>
              <path d={geo.d} fill="none" stroke="var(--paper-3)" strokeWidth={sw} strokeLinecap="round" />
              <path ref={inkRef} d={geo.d} fill="none" stroke="var(--mark-ink)" strokeWidth={sw} strokeLinecap="round" />
              {geo.pts.map((p, i) => (
                <circle
                  key={i}
                  data-dot
                  cx={p.x}
                  cy={p.y}
                  r={dotR}
                  strokeWidth={geo.wide ? 6 : 4}
                  className="fill-paper stroke-paper-3 transition-[fill,stroke] duration-500 data-on:fill-cyan data-on:stroke-ink"
                />
              ))}
              <g ref={headRef}>
                <circle r={headR} fill="var(--brand-blue)" stroke="var(--mark-ring)" strokeWidth={geo.wide ? 5 : 3.5} />
              </g>
            </>
          )}
        </svg>

        <ol className="relative z-[1] flex flex-col gap-[clamp(96px,11vw,200px)] pb-[clamp(112px,13vw,220px)] pt-[clamp(40px,5vw,88px)]">
          {events.map((ev, idx) => {
            const flip = idx % 2 === 1;
            const year = yearOf(dateOf(idx));
            const showYear = year && (idx === 0 || year !== yearOf(dateOf(idx - 1)));
            const tag = getContent(`${lang}.journeyPage.event${idx}.tag`, ev.tag || '');
            const title = getContent(`${lang}.journeyPage.event${idx}.title`, ev.title);
            return (
              <li key={`${lang}-${idx}`} data-milestone className="group/ms relative pl-11 lg:pl-0">
                {showYear && (
                  <h2
                    data-year
                    className={`t-display tabular mb-[clamp(28px,3.4vw,56px)] ${flip ? '' : 'lg:ml-[calc((100%+var(--gap))*7/12)]'}`}
                  >
                    {isEditing ? year : <Words text={year} />}
                  </h2>
                )}
                <div className="relative grid grid-cols-1 gap-y-7 lg:grid-cols-12 lg:items-center lg:gap-x-[var(--gap)]">
                  <span
                    data-node
                    aria-hidden="true"
                    className="absolute -left-7 top-5 h-px w-px lg:static lg:col-span-2 lg:col-start-6 lg:row-start-1 lg:justify-self-center"
                  />
                  <div
                    data-media
                    className={`relative aspect-[4/3] overflow-hidden rounded-media bg-paper-2 lg:col-span-5 lg:row-start-1 ${flip ? 'lg:col-start-8' : 'lg:col-start-1'}`}
                  >
                    <Img
                      ck={`${lang}.journeyPage.event${idx}.image`}
                      src={ev.image}
                      alt={title}
                      objectPosition={ev.objectPosition || DEFAULT_OBJECT_POSITION}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {(tag || isEditing) && (
                      <span className="t-small absolute left-4 top-4 rounded-full bg-paper px-3.5 py-1.5 font-medium text-ink md:left-5 md:top-5">
                        <T k={`journeyPage.event${idx}.tag`} fb={ev.tag || ''} />
                      </span>
                    )}
                  </div>
                  <div className={`flex flex-col gap-3 lg:col-span-5 lg:row-start-1 lg:max-w-[560px] ${flip ? 'lg:col-start-1' : 'lg:col-start-8'}`}>
                    <p data-part className="t-small text-ink-3">
                      <T k="journeyPage.milestoneLabel" fb={c.milestone} /> {idx + 1} <T k="journeyPage.milestoneOf" fb={c.of} /> {n}
                    </p>
                    <p data-part className="t-title text-accent">
                      <T k={`journeyPage.event${idx}.date`} fb={ev.date} />
                    </p>
                    <h3 data-part className="t-title">
                      <T k={`journeyPage.event${idx}.title`} fb={ev.title} />
                    </h3>
                    <T
                      data-part
                      as="p"
                      multiline
                      k={`journeyPage.event${idx}.description`}
                      fb={ev.description}
                      className="t-body mt-1 whitespace-pre-line text-ink-2"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Where you are on the line: a quiet pill that follows the head. */}
      {!isEditing && n > 0 && (
        <div
          aria-hidden="true"
          className={`t-small pointer-events-none fixed left-5 top-[calc(var(--nav-h)+12px)] z-[700] flex items-center gap-2.5 rounded-full bg-ink py-2 pl-2.5 pr-4 text-paper shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)] transition-all duration-500 ease-[var(--ease-out)] md:bottom-7 md:left-7 md:top-auto ${here.on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <span className="h-3 w-3 rounded-full bg-blue ring-2 ring-paper" />
          <span className="tabular">
            {active + 1} / {n}
          </span>
          <span className="text-paper/70">{dateOf(active)}</span>
        </div>
      )}
    </>
  );
}
