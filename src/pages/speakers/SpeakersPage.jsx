import { useCallback, useId, useMemo, useRef, useState } from 'react';
import Page from '../../components/site/Page';
import Button from '../../components/ui/Button';
import { Reveal, Words } from '../../components/ui/Reveal';
import { T, Img, useT } from '../../lib/content';
import { gsap, ScrollTrigger, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { speakers, withFixes, TEXT_LOGOS, FRAMING, WEBINAR_IMAGE } from './data';
import copy from './copy';
import PersonDrawer from '../team/components/PersonDrawer';
import { Field, Heading, Portrait, ProfileLink, RoundIcon, ICON, useValue } from '../team/components/people';
import { isLink } from '../team/data';

/** Speakers with corrected assets and fallbacks in the visitor's language. */
function useSpeakers() {
  const { t, lang } = useT();
  return useMemo(() => {
    const ts = t.speakersPage?.speakers || {};
    const bios = (copy[lang] || copy.en).bios || {};
    return speakers.map(withFixes).map((s) => ({
      ...s,
      frame: FRAMING[s.id] || { focus: [0.5, 0.4], zoom: 1 },
      fb: {
        name: ts[s.id]?.name ?? s.name,
        role: ts[s.id]?.role ?? s.role,
        description: bios[s.id] ?? ts[s.id]?.description ?? s.description,
      },
    }));
  }, [t, lang]);
}

function TitleLine({ k, className }) {
  const { tr, isEditing } = useT();
  if (isEditing) return <T k={k} className={className} />;
  return <span className={className}><Words text={tr(k)} /></span>;
}

function Intro() {
  const root = useRef(null);
  const { isEditing } = useT();
  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    gsap.timeline({ delay: 0.15 })
      .from(root.current.querySelectorAll('h1 .xc-word'), { yPercent: 115, rotate: 4, duration: 1.15, stagger: 0.08, ease: EASE.out }, 0)
      .from(root.current.querySelectorAll('[data-fade]'), { y: 24, autoAlpha: 0, duration: 1, ease: EASE.out }, 0.5);
  }, { scope: root, dependencies: [isEditing] });

  return (
    <header ref={root} className="shell pb-[clamp(64px,8vw,128px)] pt-[calc(var(--nav-h)+clamp(56px,9vw,150px))]">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap)]">
        <h1 className="t-display lg:col-span-8">
          <TitleLine k="speakersPage.title" className="block text-ink-3" />
          <TitleLine k="speakersPage.titleBold" className="block" />
        </h1>
        <div data-fade className="lg:col-span-4 lg:pb-3">
          <T k="speakersPage.subtitle" as="p" className="t-lead text-ink-2" />
        </div>
      </div>
    </header>
  );
}

function SpeakerCard({ s, c, onOpen }) {
  const media = useRef(null);
  const { lang, isEditing } = useT();
  const value = useValue();
  const name = value(`${lang}.speakersPage.speakers.${s.id}.name`, s.fb.name);

  return (
    <article className="group relative">
      <div ref={media} className="relative overflow-hidden rounded-media bg-paper-2">
        <Portrait
          ck={`${lang}.speakersPage.speakers.${s.id}.image`}
          src={s.image}
          alt={name}
          focus={s.frame.focus}
          zoom={s.frame.zoom}
          className="aspect-[4/5] transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
        {!isEditing && (
          <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 inline-flex h-10 translate-y-3 items-center rounded-full bg-paper px-4 text-[0.92rem] text-ink opacity-0 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[var(--ease-out)] group-hover:translate-y-0 group-hover:opacity-100">
            <T k="speakersPage.openProfile" fb={c.openProfile} />
          </span>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className={`min-w-0 ${isEditing ? 'relative z-[2]' : ''}`}>
          <Field ck={`${lang}.speakersPage.speakers.${s.id}.name`} fb={s.fb.name} as="h3" className="t-title" />
          <p className="t-small mt-1.5 text-ink-3">{s.enterprise}</p>
        </div>
        <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper-2 text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
          <RoundIcon d={ICON.plus} className="transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-90" />
        </span>
      </div>
      <button
        type="button"
        onClick={() => onOpen(s.id, media.current)}
        aria-label={`${c.openProfile}: ${name}`}
        data-cursor="Open"
        className="absolute inset-0 z-[1] rounded-media outline-offset-4"
      />
    </article>
  );
}

/* ── The line-up: on wide screens the section holds still and the portraits travel past;
      the brand's spark pill fills as they go. Phones get a plain stack. ── */
function Lineup({ items, c, onOpen }) {
  const root = useRef(null);
  const wrap = useRef(null);
  const track = useRef(null);
  const { isEditing } = useT();

  useGSAP(() => {
    if (isEditing || reducedMotion()) return undefined;
    const cards = track.current.children;
    gsap.from(cards, {
      y: 70, autoAlpha: 0, duration: 1.1, stagger: 0.08, ease: EASE.out,
      scrollTrigger: { trigger: track.current, start: 'top 85%', once: true },
    });
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const distance = () => Math.max(0, track.current.scrollWidth - wrap.current.clientWidth);
      const st = { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: 0.8, invalidateOnRefresh: true };
      gsap.to(track.current, { x: () => -distance(), ease: 'none', scrollTrigger: { ...st, pin: true } });
      gsap.fromTo(root.current.querySelector('[data-spark]'), { scaleX: 0.12 }, { scaleX: 1, ease: 'none', scrollTrigger: st });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [isEditing] });

  const layout = isEditing
    ? 'grid gap-x-[var(--gap)] gap-y-14 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid gap-x-[var(--gap)] gap-y-14 sm:grid-cols-2 lg:flex lg:w-max lg:gap-x-[clamp(20px,2.2vw,40px)]';

  return (
    <section ref={root} aria-labelledby="lineup-title" className="overflow-hidden pb-[var(--section)] lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:pb-0 lg:pt-[calc(var(--nav-h)+24px)]">
      <div className="shell">
        <div className="grid gap-y-5 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
          <T k="speakersPage.lineupLabel" fb={c.lineupLabel} as="p" className="t-small text-ink-3 lg:col-span-3 lg:pt-2" />
          <Heading id="lineup-title" k="speakersPage.lineupTitle" fb={c.lineupTitle} className="t-headline lg:col-span-9" />
        </div>
        <div ref={wrap} className="mt-[clamp(40px,4.5vw,72px)]">
          <ul ref={track} className={layout}>
            {items.map((s) => (
              <li key={s.id} className="lg:w-[min(24vw,52svh,440px)] lg:shrink-0">
                <SpeakerCard s={s} c={c} onOpen={onOpen} />
              </li>
            ))}
          </ul>
        </div>
        {!isEditing && (
          <div aria-hidden="true" className="mt-10 hidden h-2 w-[min(320px,30%)] overflow-hidden rounded-full bg-paper-3 lg:block">
            <div data-spark className="h-full w-full origin-left rounded-full" style={{ background: 'linear-gradient(90deg, rgba(34,196,210,0.15), var(--brand-cyan))' }} />
          </div>
        )}
      </div>
    </section>
  );
}

/* ── The event: blue chapter with the date, theme and poster ── */
function Webinar({ c }) {
  const root = useRef(null);
  const { isEditing } = useT();
  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    gsap.fromTo(root.current.querySelector('[data-poster] img'), { yPercent: -3, scale: 1.07 }, {
      yPercent: 3, scale: 1.07, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  }, { scope: root, dependencies: [isEditing] });

  return (
    <section ref={root} aria-labelledby="webinar-title" className="bg-blue-deep text-white">
      <div className="shell grid gap-12 py-[clamp(96px,11vw,180px)] lg:grid-cols-12 lg:items-center lg:gap-x-[var(--gap)]">
        <Reveal className="flex flex-col gap-7 lg:col-span-6">
          <p className="t-small flex flex-wrap gap-x-2">
            <T k="speakersPage.webinarLabel" fb={c.webinarLabel} />
            <span aria-hidden="true">·</span>
            <T k="speakersPage.webinarDate" fb={c.webinarDate} as="time" dateTime="2026-07-10" />
          </p>
          <T id="webinar-title" k="speakersPage.webinarTitle" fb={c.webinarTitle} as="h2" className="t-headline max-w-[14ch]" />
          <T k="speakersPage.webinarTheme" fb={c.webinarTheme} as="p" className="t-title" />
          <T k="speakersPage.webinarText" fb={c.webinarText} as="p" className="t-lead max-w-[44ch]" />
          <div>
            <Button to="/events" variant="light" size="lg"><T k="eventsPage.title" /></Button>
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <div data-poster className="relative aspect-[16/9] overflow-hidden rounded-media bg-blue">
            <Img k="speakersPage.webinarImage" src={WEBINAR_IMAGE} alt={c.webinarAlt} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Logo({ s }) {
  if (!s.logo || TEXT_LOGOS.includes(s.logo)) return <p className="t-title">{s.enterprise}</p>;
  return (
    <span className="inline-flex h-16 items-center rounded-full bg-white px-5">
      <img src={s.logo} alt={s.enterprise} loading="lazy" className="h-11 w-auto max-w-[200px] object-contain" />
    </span>
  );
}

function SpeakerDetail({ s, c, titleId }) {
  const { lang } = useT();
  const socials = (s.socials || []).filter((x) => isLink(x.url));
  return (
    <>
      <div data-stagger className="flex flex-col gap-3">
        <Field id={titleId} ck={`${lang}.speakersPage.speakers.${s.id}.name`} fb={s.fb.name} as="h2" className="t-headline max-w-[14ch]" />
        <Field ck={`${lang}.speakersPage.speakers.${s.id}.role`} fb={s.fb.role} as="p" className="t-lead text-accent" />
      </div>
      <Field data-stagger ck={`${lang}.speakersPage.speakers.${s.id}.description`} fb={s.fb.description} as="p" multiline className="t-body max-w-[62ch] text-ink-2" />
      <div data-stagger className="mt-auto flex flex-col gap-5 rounded-card bg-paper-2 p-[clamp(20px,2.4vw,32px)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <T k="speakersPage.connect" as="p" className="t-small text-ink-3" />
          <Logo s={s} />
        </div>
        {(s.link || socials.length > 0) && (
          <div className="flex flex-wrap gap-3">
            {s.link && <ProfileLink href={`https://${s.link}`} name="Website">{s.link}</ProfileLink>}
            {socials.map((x) => <ProfileLink key={x.url} href={x.url} name="LinkedIn">{x.name}</ProfileLink>)}
          </div>
        )}
      </div>
    </>
  );
}

export default function SpeakersPage() {
  const { tr, lang } = useT();
  const c = copy[lang] || copy.en;
  const items = useSpeakers();
  const [active, setActive] = useState(null);
  const titleId = useId();
  const open = useCallback((id, origin) => setActive({ id, origin }), []);
  const close = useCallback(() => {
    setActive(null);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);
  const step = (dir) => setActive((a) => {
    const i = items.findIndex((s) => s.id === a.id);
    return { id: items[(i + dir + items.length) % items.length].id, origin: a.origin };
  });
  const current = active && items.find((s) => s.id === active.id);

  return (
    <Page title={tr('speakersPage.metaTitle')} description={tr('speakersPage.metaDesc')}>
      <Intro />
      <Lineup items={items} c={c} onOpen={open} />
      <Webinar c={c} />

      {current && (
        <PersonDrawer
          itemKey={current.id}
          titleId={titleId}
          origin={active.origin}
          label={<T k="speakersPage.label" />}
          labels={{ close: tr('speakersPage.close', c.close), prev: c.prev, next: c.next }}
          onClose={close}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          media={(
            <Portrait
              ck={`${lang}.speakersPage.speakers.${current.id}.image`}
              src={current.image}
              alt={current.fb.name}
              focus={current.frame.focus}
              zoom={current.frame.zoom}
              className="aspect-[4/3] md:aspect-[4/5]"
            />
          )}
        >
          <SpeakerDetail s={current} c={c} titleId={titleId} />
        </PersonDrawer>
      )}
    </Page>
  );
}
