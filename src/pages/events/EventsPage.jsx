import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Page from '../../components/site/Page';
import Button, { Arrow } from '../../components/ui/Button';
import { Reveal, SplitText } from '../../components/ui/Reveal';
import { T, Img, useT } from '../../lib/content';
import { useCMS } from '../../context/CMSContext';
import { gsap, ScrollTrigger, Flip, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import EventDialog from './EventDialog';
import { copy } from './copy';
import {
  HERO_BG, DEFAULT_OBJECT_POSITION, PARTNER_ROUTE, SPEAKERS_ROUTE, IMAGE_FIX,
  eventStart, isUpcoming, calendarLink,
} from './data';

/* Archive rhythm on wide screens: rows of differing spans, photos sized so each row lines up. */
const ROWS = [[7, 5], [4, 4, 4], [5, 7], [6, 6]];
const ASPECT = { 4: '4/5', 5: '15/14', 6: '4/3', 7: '3/2', 12: '21/9' };
const SPAN = { 4: 'lg:col-span-4', 5: 'lg:col-span-5', 6: 'lg:col-span-6', 7: 'lg:col-span-7', 12: 'md:col-span-2 lg:col-span-12' };

function spansFor(n) {
  const out = [];
  let left = n;
  let r = 0;
  while (left > 0) {
    let row = ROWS[r % ROWS.length];
    if (row.length > left) row = left === 1 ? [12] : [6, 6];
    else if (left - row.length === 1) row = row.length === 2 ? [4, 4, 4] : [7, 5];
    out.push(...row);
    left -= row.length;
    r += 1;
  }
  return out;
}

const newestFirst = (a, b) => {
  if (a.start && b.start) return b.start - a.start || a.idx - b.idx;
  if (a.start) return -1;
  if (b.start) return 1;
  return a.idx - b.idx;
};

/** Opening: badge, title, lead and the two hero figures (all on the old PageHero keys). */
function Opening({ count, c }) {
  const { t, tr, lang, isEditing } = useT();
  const ep = t.eventsPage || {};
  const title = tr('eventsPage.hero.title', ep.title);
  return (
    <header className="shell pb-[clamp(40px,5vw,80px)] pt-[calc(var(--nav-h)+clamp(56px,9vw,150px))]">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap)]">
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <T ck={`${lang}.eventsPage.hero.badge`} fb={ep.badge} as="p" className="t-small mb-6 text-ink-3" />
          </Reveal>
          {isEditing ? (
            <T ck={`${lang}.eventsPage.hero.title`} fb={ep.title} as="h1" className="t-display" />
          ) : (
            <SplitText text={title} as="h1" immediate delay={0.2} className="t-display" />
          )}
        </div>
        <Reveal className="flex flex-col gap-8 lg:col-span-5 lg:col-start-8 lg:pb-3" delay={0.45} stagger={0.09}>
          <T ck={`${lang}.eventsPage.hero.subtitle`} fb={ep.subtitle} as="p" className="t-lead text-ink-2" />
          <dl className="grid grid-cols-2 gap-[var(--gap)]">
            <div className="rounded-card bg-paper-2 p-5 md:p-6">
              <dt className="t-small text-ink-3"><T ck={`${lang}.eventsPage.hero.stats.0.label`} fb={c.statEvents} /></dt>
              <dd className="t-headline tabular mt-3"><T ck={`${lang}.eventsPage.hero.stats.0.value`} fb={`${count}+`} /></dd>
            </div>
            <div className="rounded-card bg-paper-2 p-5 md:p-6">
              <dt className="t-small text-ink-3"><T ck={`${lang}.eventsPage.hero.stats.1.label`} fb={c.statImpactLabel} /></dt>
              <dd className="t-headline mt-3"><T ck={`${lang}.eventsPage.hero.stats.1.value`} fb={c.statImpactValue} /></dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </header>
  );
}

/**
 * Signature: every event photo set in pills (the strokes of the X), on two
 * strips that cross at the mark's angles and travel in opposite directions as
 * the page scrolls; the brand spark leads the first strip.
 */
function Strips({ items, onOpen, c }) {
  const root = useRef(null);
  const { lang, isEditing } = useT();
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)];

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const tracks = root.current.querySelectorAll('[data-track]');
    const dist = (el) => Math.max(0, el.scrollWidth - root.current.clientWidth);
    const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.7, invalidateOnRefresh: true };
    if (tracks[0]) gsap.fromTo(tracks[0], { x: 0, rotate: -5 }, { x: () => -dist(tracks[0]), rotate: -1.5, ease: 'none', scrollTrigger: st });
    if (tracks[1]) gsap.fromTo(tracks[1], { x: () => -dist(tracks[1]), rotate: 4 }, { x: 0, rotate: 1, ease: 'none', scrollTrigger: { ...st } });
    gsap.from(root.current.querySelectorAll('[data-strip-copy] > *'), {
      y: 26, autoAlpha: 0, duration: 1, stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
    });
  }, { scope: root, dependencies: [isEditing, lang, items.length], revertOnUpdate: true });

  return (
    <section ref={root} aria-labelledby="events-strip-label" className="overflow-hidden pb-[clamp(96px,11vw,180px)] pt-[clamp(24px,3vw,48px)]">
      <div data-strip-copy className="shell grid gap-y-4 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <p id="events-strip-label" className="t-small text-ink-3 lg:col-span-3 lg:pt-2">
          <T ck={`${lang}.eventsPage.hero.transitionLabel`} fb={c.transitionLabel} />
        </p>
        <T k="eventsPage.transitionText" fb={c.transitionText} as="p" className="max-w-[30ch] text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.025em] lg:col-span-9" />
      </div>
      <div className="mt-[clamp(48px,6vw,96px)] flex flex-col gap-3 md:gap-4">
        {rows.map((row, r) => (
          <div
            key={r}
            data-track
            className={`flex w-max gap-3 px-[var(--margin)] will-change-transform md:gap-4 ${isEditing ? 'max-w-full overflow-x-auto' : ''}`}
          >
            {r === 0 && (
              <span
                aria-hidden="true"
                className="aspect-[2/1] h-[clamp(150px,19vw,300px)] shrink-0 rounded-full bg-[linear-gradient(to_left,var(--brand-cyan),transparent)]"
              />
            )}
            {row.map((it) => (
              <button
                key={it.idx}
                type="button"
                onClick={() => onOpen(it.idx)}
                data-cursor="Open"
                aria-label={`${c.viewDetails}: ${it.title}`}
                className="group relative aspect-[16/10] h-[clamp(150px,19vw,300px)] shrink-0 overflow-hidden rounded-full bg-paper-2 transition-transform duration-500 ease-[var(--ease-out)] active:scale-[0.98]"
              >
                <img
                  src={it.images[0]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: it.objectPosition }}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.07]"
                />
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Upcoming first: dated future events, or the open call to speak or partner, on a cyan field. */
function Upcoming({ upcoming, onOpen, c }) {
  const { lang } = useT();
  return (
    <section aria-labelledby="events-upcoming" className="bg-cyan text-on-cyan">
      <div className="shell grid gap-y-12 py-[clamp(88px,11vw,176px)] lg:grid-cols-12 lg:items-center lg:gap-x-[var(--gap)]">
        <Reveal className="lg:col-span-6" stagger={0.08}>
          <h2 id="events-upcoming" className="t-headline"><T k="eventsPage.upcomingTitle" fb={c.upcomingTitle} /></h2>
          {upcoming.length ? (
            <>
              <T k="eventsPage.upcomingSome" fb={c.upcomingSome} as="p" className="t-lead mt-6 max-w-[36ch]" />
              <ul className="mt-10 flex flex-col gap-3">
                {upcoming.map((it) => (
                  <li key={it.idx} className="rounded-card bg-[#0d1a1c]/8 p-5 md:p-6">
                    <p className="t-small opacity-80"><T k={`eventsPage.article${it.idx}.type`} fb={it.raw.type} /> · <T k={`eventsPage.article${it.idx}.date`} fb={it.raw.date} /></p>
                    <h3 className="t-title mt-2"><T k={`eventsPage.article${it.idx}.title`} fb={it.raw.title} /></h3>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button onClick={() => onOpen(it.idx)} variant="onColor" size="sm">{c.viewDetails}</Button>
                      {it.calendar && <Button href={it.calendar} variant="secondary" size="sm">{c.addToCalendar}</Button>}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <T k="eventsPage.upcomingNone" fb={c.upcomingNone} as="p" className="t-lead mt-6 max-w-[38ch]" />
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button to={PARTNER_ROUTE} variant="onColor" size="lg"><T k="eventsPage.ctaPartner" fb={c.partner} /></Button>
            <Button to={SPEAKERS_ROUTE} variant="secondary" size="lg"><T k="eventsPage.ctaSpeakers" fb={c.speak} /></Button>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-6" y={40}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-media bg-[#0d1a1c]/10">
            <Img k="eventsPage.upcomingImage" src={HERO_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Card({ it, span, onOpen, c }) {
  const { isEditing } = useT();
  return (
    <article data-card data-cursor="Open" className={`group relative ${SPAN[span]}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-media bg-paper-2 lg:aspect-[var(--ar)]" style={{ '--ar': ASPECT[span] }}>
        <Img
          k={`eventsPage.article${it.idx}.image`}
          src={it.cover}
          alt={it.title}
          objectPosition={it.objectPosition}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.045]"
        />
        <span className="t-small absolute left-4 top-4 rounded-full bg-paper px-3.5 py-1.5 font-medium text-ink md:left-5 md:top-5">
          <T k={`eventsPage.article${it.idx}.type`} fb={it.raw.type} />
        </span>
      </div>
      <div className="mt-5 flex flex-col gap-2 pr-2">
        <p className="t-small text-ink-3"><T k={`eventsPage.article${it.idx}.date`} fb={it.raw.date} /></p>
        <h3 className="t-title">
          <button
            type="button"
            onClick={() => onOpen(it.idx)}
            className={`text-left transition-colors duration-300 group-hover:text-accent focus-visible:outline-none ${isEditing ? '' : "after:absolute after:inset-0 after:rounded-media after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[var(--focus)] focus-visible:after:[outline-style:solid]"}`}
          >
            <T k={`eventsPage.article${it.idx}.title`} fb={it.raw.title} />
          </button>
        </h3>
        <T k={`eventsPage.article${it.idx}.description`} fb={it.raw.description} multiline as="p" className="t-body line-clamp-3 text-ink-2" />
        {isEditing ? (
          <button type="button" onClick={() => onOpen(it.idx)} className="t-small mt-2 inline-flex w-fit items-center gap-2 font-medium text-accent">
            {c.viewDetails} <Arrow />
          </button>
        ) : (
          <span aria-hidden="true" className="t-small mt-2 inline-flex items-center gap-2 font-medium text-accent">
            {c.viewDetails} <Arrow />
          </span>
        )}
      </div>
    </article>
  );
}

/** Past events, newest first, with a type filter whose ink pill slides to the chosen type. */
function Archive({ past, onOpen, c }) {
  const root = useRef(null);
  const flipState = useRef(null);
  const changed = useRef(false);
  const { lang, isEditing } = useT();
  const [filter, setFilter] = useState('all');

  const types = useMemo(() => [...new Set(past.map((p) => p.type).filter(Boolean))], [past]);
  const active = filter === 'all' || types.includes(filter) ? filter : 'all';
  const shown = active === 'all' ? past : past.filter((p) => p.type === active);
  const spans = spansFor(shown.length);

  const choose = (ty) => {
    if (ty === active) return;
    if (!reducedMotion()) flipState.current = Flip.getState('[data-flip-id="events-filter"]');
    changed.current = true;
    setFilter(ty);
  };

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, { targets: '[data-flip-id="events-filter"]', duration: 0.6, ease: EASE.out });
    flipState.current = null;
  }, [active]);

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const cards = [...root.current.querySelectorAll('[data-card]')];
    if (changed.current) {
      gsap.from(cards, { y: 36, autoAlpha: 0, duration: 0.9, stagger: 0.06, ease: EASE.out });
      return;
    }
    gsap.from(root.current.querySelectorAll('[data-archive-head] > *'), {
      y: 26, autoAlpha: 0, duration: 1, stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
    });
    const below = cards.filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92);
    gsap.set(below, { y: 48, autoAlpha: 0 });
    ScrollTrigger.batch(below, {
      start: 'top 92%',
      once: true,
      onEnter: (els) => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1.05, stagger: 0.08, ease: EASE.out, overwrite: true }),
    });
  }, { scope: root, dependencies: [active, isEditing, lang, past.length], revertOnUpdate: true });

  return (
    <section ref={root} aria-labelledby="events-past" className="shell py-[clamp(96px,12vw,200px)]">
      <div data-archive-head className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-[var(--gap)]">
        <h2 id="events-past" className="t-display lg:col-span-7"><T k="eventsPage.pastTitle" fb={c.pastTitle} /></h2>
        <T k="eventsPage.pastLead" fb={c.pastLead} as="p" className="t-lead text-ink-2 lg:col-span-4 lg:col-start-9 lg:pb-2" />
      </div>

      <div role="group" aria-label={c.filterLabel} className="mt-[clamp(40px,5vw,72px)] flex flex-wrap gap-2">
        {['all', ...types].map((ty) => {
          const on = active === ty;
          return (
            <button
              key={ty}
              type="button"
              aria-pressed={on}
              onClick={() => choose(ty)}
              className={`t-small relative isolate h-11 rounded-full px-5 font-medium transition-[color,background-color,transform] duration-300 active:scale-[0.97] ${on ? 'text-paper' : 'bg-paper-2 text-ink hover:bg-paper-3'}`}
            >
              {on && <span data-flip-id="events-filter" aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-ink" />}
              {ty === 'all' ? <T k="eventsPage.filterAll" fb={c.all} /> : ty}
            </button>
          );
        })}
      </div>

      {shown.length ? (
        <div className="mt-[clamp(32px,4vw,56px)] grid grid-cols-1 items-start gap-x-[var(--gap)] gap-y-[clamp(48px,5vw,80px)] md:grid-cols-2 lg:grid-cols-12">
          {shown.map((it, i) => (
            <Card key={it.idx} it={it} span={spans[i]} onOpen={onOpen} c={c} />
          ))}
        </div>
      ) : (
        <p className="t-lead mt-12 text-ink-2">{c.emptyFilter}</p>
      )}
    </section>
  );
}

export default function EventsPage() {
  const { t, tr, lang } = useT();
  const { getContent } = useCMS();
  const c = copy[lang] || copy.en;
  const articles = useMemo(() => t.eventsPage?.articles || [], [t]);
  const [now] = useState(() => new Date());
  const [openIdx, setOpenIdx] = useState(null);

  // Each article with its CMS-resolved text and pictures (so the dialog shows admin edits too).
  const items = useMemo(() => {
    const other = lang === 'en' ? 'fr' : 'en';
    return articles.map((a, idx) => {
      const key = (f, l = lang) => `${l}.eventsPage.article${idx}.${f}`;
      // Cover is the article's main photo (for GDG the event photo, not the logo screenshot).
      const fix = IMAGE_FIX[lang]?.[a.id];
      const cover = fix || a.image || a.images?.[0];
      const imgs = [cover, ...(a.images || []).filter((src) => src !== cover)];
      const coverNow = getContent(key('image'), getContent(key('image', other), cover));
      const title = getContent(key('title'), a.title);
      const description = getContent(key('description'), a.description);
      const upcoming = isUpcoming(a.id, now);
      return {
        idx,
        id: a.id,
        raw: a,
        type: getContent(key('type'), a.type),
        date: getContent(key('date'), a.date),
        title,
        description,
        cover,
        images: [coverNow, ...(fix ? [] : imgs.slice(1))],
        objectPosition: a.objectPosition || DEFAULT_OBJECT_POSITION,
        url: a.url && a.url !== '#' ? a.url : null,
        start: eventStart(a.id),
        upcoming,
        calendar: upcoming ? calendarLink(a.id, title, description) : null,
      };
    });
  }, [articles, lang, getContent, now]);

  const upcoming = useMemo(() => items.filter((i) => i.upcoming).sort((a, b) => a.start - b.start), [items]);
  const past = useMemo(() => items.filter((i) => !i.upcoming).sort(newestFirst), [items]);
  const open = items.find((i) => i.idx === openIdx);

  return (
    <Page title={tr('eventsPage.metaTitle', c.metaTitle)} description={tr('eventsPage.metaDesc', c.metaDesc)}>
      <Opening count={articles.length} c={c} />
      <Strips items={[...upcoming, ...past]} onOpen={setOpenIdx} c={c} />
      <Upcoming upcoming={upcoming} onOpen={setOpenIdx} c={c} />
      <Archive past={past} onOpen={setOpenIdx} c={c} />
      {open && <EventDialog key={open.idx} ev={open} c={c} calendar={open.calendar} onClose={() => setOpenIdx(null)} />}
    </Page>
  );
}
