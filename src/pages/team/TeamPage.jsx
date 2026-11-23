import { useCallback, useId, useMemo, useRef, useState } from 'react';
import Page from '../../components/site/Page';
import Button from '../../components/ui/Button';
import { Reveal, Words } from '../../components/ui/Reveal';
import { T, useT } from '../../lib/content';
import { useCMS } from '../../context/CMSContext';
import { gsap, ScrollTrigger, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { detailedTeam, FOUNDER_IDS, SHORT_NAMES, FRAMING, LEGACY_INDEX, isLink } from './data';
import copy from './copy';
import PersonDrawer from './components/PersonDrawer';
import { Field, Heading, Portrait, ClanFigure, ProfileLink, RoundIcon, ICON, nameCase, useValue } from './components/people';

/**
 * Fallbacks per member: newest edit first, then the earlier site's saved edits,
 * then the translation for the active language, then the original data.
 */
function useMembers() {
  const { t, lang } = useT();
  const { getContent } = useCMS();
  return useMemo(() => {
    const other = lang === 'en' ? 'fr' : 'en';
    const tm = t.teamPage?.members || {};
    return detailedTeam.map((m) => {
      const tr = tm[m.id] || {};
      const idx = LEGACY_INDEX[m.id];
      const legacy = (field, fb) => getContent(`${lang}.detailedTeam.member${idx}.${field}`, getContent(`en.detailedTeam.member${idx}.${field}`, fb));
      return {
        ...m,
        frame: FRAMING[m.id] || { focus: [0.5, 0.4], zoom: 1, face: 2 },
        fb: {
          name: legacy('name', tr.name ?? m.name),
          role: tr.role ?? m.role,
          geography: tr.geography ?? m.geography,
          industry: tr.industry ?? m.industry,
          expertise: tr.expertise ?? m.expertise.slice(0, 3).join(', '),
          description: tr.description ?? m.description,
          image: getContent(`${other}.teamPage.members.${m.id}.image`, legacy('image', m.image)),
        },
      };
    });
  }, [t, lang, getContent]);
}

/** Title line whose words rise in; editable text in CMS mode. */
function TitleLine({ k, className }) {
  const { tr, isEditing } = useT();
  if (isEditing) return <T k={k} className={className} />;
  return <span className={className}><Words text={tr(k)} /></span>;
}

/* ── Opening: the title, then the whole clan drawn as the mark's figure ── */
function Intro({ members, c, onOpen }) {
  const root = useRef(null);
  const { lang, isEditing } = useT();
  const value = useValue();

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const q = (s) => root.current.querySelectorAll(s);
    gsap.timeline({ delay: 0.15 })
      .from(q('h1 .xc-word'), { yPercent: 115, rotate: 4, duration: 1.15, stagger: 0.07, ease: EASE.out }, 0)
      .from(q('[data-fade]'), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08, ease: EASE.out }, 0.45)
      .from(q('[data-body]'), { scaleY: 0, scaleX: 0.55, transformOrigin: '50% 100%', duration: 1.3, stagger: 0.07, ease: 'elastic.out(1, 0.55)' }, 0.6)
      .from(q('[data-head]'), { yPercent: -260, autoAlpha: 0, duration: 1.1, stagger: 0.07, ease: 'bounce.out' }, 0.75)
      .from(q('[data-short]'), { y: 10, autoAlpha: 0, duration: 0.8, stagger: 0.05, ease: EASE.out }, 1.1);
  }, { scope: root, dependencies: [isEditing] });

  return (
    <header ref={root} className="shell pb-[clamp(88px,11vw,180px)] pt-[calc(var(--nav-h)+clamp(56px,9vw,150px))]">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap)]">
        <h1 className="t-display lg:col-span-8">
          <TitleLine k="teamPage.title" className="block text-ink-3" />
          <TitleLine k="teamPage.titleBold" className="block" />
        </h1>
        <div data-fade className="lg:col-span-4 lg:pb-3">
          <T k="teamPage.subtitle" as="p" className="t-lead text-ink-2" />
        </div>
      </div>

      <div className="mt-[clamp(64px,8vw,136px)]">
        <T data-fade k="teamPage.indexLabel" fb={c.indexLabel} as="p" className="t-small text-ink-3" />
        <ul className="mt-8 grid grid-cols-5 gap-x-[clamp(10px,1.6vw,28px)] gap-y-10 sm:grid-cols-9">
          {members.map((m) => {
            const name = nameCase(value(`${lang}.teamPage.members.${m.id}.name`, m.fb.name));
            const src = value(`${lang}.teamPage.members.${m.id}.image`, m.fb.image);
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => onOpen(m.id, null)}
                  aria-label={`${c.openProfile}: ${name}`}
                  data-cursor="Open"
                  className="group flex w-full flex-col items-center gap-3 rounded-card pb-1 text-center outline-offset-4"
                >
                  <ClanFigure src={src} focus={m.frame.focus} zoom={m.frame.face} />
                  <span data-short className="t-small text-ink-2 transition-colors duration-300 group-hover:text-ink">{SHORT_NAMES[m.id]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

/* ── One member card. Founders are large and carry an excerpt. ── */
function MemberCard({ m, c, large, onOpen }) {
  const media = useRef(null);
  const { lang, isEditing } = useT();
  const value = useValue();
  const name = nameCase(value(`${lang}.teamPage.members.${m.id}.name`, m.fb.name));
  const lift = isEditing ? 'relative z-[2]' : '';

  return (
    <article className="group relative">
      <div ref={media} data-media className={`overflow-hidden bg-paper-2 ${large ? 'rounded-media' : 'rounded-card'}`}>
        <div data-rise className="will-change-transform">
          <Portrait
            ck={`${lang}.teamPage.members.${m.id}.image`}
            src={m.fb.image}
            alt={name}
            focus={m.frame.focus}
            zoom={m.frame.zoom}
            center={m.frame.center}
            soon={c.portraitSoon}
            className="aspect-[4/5] transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
          />
        </div>
        {!isEditing && (
          <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 inline-flex h-10 translate-y-3 items-center gap-2 rounded-full bg-paper px-4 text-[0.92rem] text-ink opacity-0 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[var(--ease-out)] group-hover:translate-y-0 group-hover:opacity-100">
            <T k="teamPage.clickForMore" />
          </span>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className={`min-w-0 ${lift}`}>
          <Field ck={`${lang}.teamPage.members.${m.id}.name`} fb={m.fb.name} format={nameCase} as="h3" className="t-title" />
          <Field ck={`${lang}.teamPage.members.${m.id}.role`} fb={m.fb.role} as="p" className="t-small mt-1.5 text-ink-2" />
        </div>
        <span aria-hidden="true" className={`${large ? 'grid' : 'hidden sm:grid'} h-11 w-11 shrink-0 place-items-center rounded-full bg-paper-2 text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-paper`}>
          <RoundIcon d={ICON.plus} className="transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-90" />
        </span>
      </div>
      {large && (
        <Field ck={`${lang}.teamPage.members.${m.id}.description`} fb={m.fb.description} as="p" multiline className={`t-body mt-4 line-clamp-3 max-w-[46ch] text-ink-2 ${lift}`} />
      )}

      <button
        type="button"
        onClick={() => onOpen(m.id, media.current)}
        aria-label={`${c.openProfile}: ${name}`}
        data-cursor="Open"
        className={`absolute inset-0 z-[1] ${large ? 'rounded-media' : 'rounded-card'} outline-offset-4`}
      />
    </article>
  );
}

/* ── Founders: big portraits that rise into their frames as the page scrolls ── */
function Founders({ members, c, onOpen }) {
  const root = useRef(null);
  const { isEditing } = useT();

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    root.current.querySelectorAll('[data-media]').forEach((frame, i) => {
      const st = { trigger: frame, start: 'top bottom', end: 'bottom 35%', scrub: 0.8 };
      gsap.fromTo(frame, { clipPath: 'inset(22% 9% 0% 9% round 48px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: st });
      gsap.fromTo(frame.querySelector('[data-rise]'), { yPercent: 8 + i * 2, scale: 1.12 }, { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: st });
    });
    gsap.from(root.current.querySelectorAll('[data-text]'), {
      y: 24, autoAlpha: 0, duration: 1, stagger: 0.09, ease: EASE.out,
      scrollTrigger: { trigger: root.current.querySelector('ul'), start: 'top 70%', once: true },
    });
  }, { scope: root, dependencies: [isEditing] });

  return (
    <section ref={root} aria-labelledby="founders-title" className="shell pb-[var(--section)]">
      <div className="grid gap-y-5 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <T k="teamPage.foundersLabel" fb={c.foundersLabel} as="p" className="t-small text-ink-3 lg:col-span-3 lg:pt-3" />
        <Heading id="founders-title" k="teamPage.foundersTitle" fb={c.foundersTitle} className="t-headline lg:col-span-9 lg:max-w-[16ch]" />
      </div>
      <ul className="mt-[clamp(48px,6vw,104px)] grid gap-x-[var(--gap)] gap-y-16 md:grid-cols-3">
        {members.map((m, i) => (
          <li key={m.id} className={i === 1 ? 'md:pt-[clamp(56px,9vw,160px)]' : i === 2 ? 'md:pt-[clamp(24px,4vw,72px)]' : ''}>
            <div data-text>
              <MemberCard m={m} c={c} large onOpen={onOpen} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── The rest of the clan ── */
function Clan({ members, c, onOpen }) {
  return (
    <section aria-labelledby="clan-title" className="shell pb-[var(--section)]">
      <div className="grid gap-y-5 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <T k="teamPage.clanLabel" fb={c.clanLabel} as="p" className="t-small text-ink-3 lg:col-span-3 lg:pt-3" />
        <Heading id="clan-title" k="teamPage.clanTitle" fb={c.clanTitle} className="t-headline lg:col-span-9 lg:max-w-[18ch]" />
      </div>
      <Reveal as="ul" stagger={0.08} className="mt-[clamp(48px,6vw,104px)] grid grid-cols-2 gap-x-[var(--gap)] gap-y-14 lg:grid-cols-3">
        {members.map((m) => (
          <li key={m.id}>
            <MemberCard m={m} c={c} onOpen={onOpen} />
          </li>
        ))}
      </Reveal>
    </section>
  );
}

/* ── Closing colour field ── */
function Closing({ c }) {
  return (
    <section className="bg-cyan text-on-cyan">
      <div className="shell grid gap-10 py-[clamp(96px,12vw,200px)] lg:grid-cols-12 lg:items-end lg:gap-x-[var(--gap)]">
        <Heading k="teamPage.ctaTitle" fb={c.ctaTitle} className="t-display lg:col-span-8 lg:max-w-[13ch]" />
        <Reveal className="flex flex-col gap-7 lg:col-span-4 lg:pb-3">
          <T k="teamPage.ctaLead" fb={c.ctaLead} as="p" className="t-lead" />
          <div className="flex flex-wrap gap-3">
            <Button to="/start-project" variant="onColor" size="lg"><T k="teamPage.ctaStart" fb={c.ctaStart} /></Button>
            <Button to="/careers/community-manager" variant="light" size="lg" arrow={false}><T k="teamPage.ctaJoin" fb={c.ctaJoin} /></Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Drawer content for one member ── */
function MemberDetail({ m, c, titleId }) {
  const { t, lang } = useT();
  const rows = [
    { key: 'role', label: t.teamPage.metaRole, value: m.fb.role },
    { key: 'geography', label: t.teamPage.metaGeography, value: m.fb.geography },
    { key: 'industry', label: t.teamPage.metaIndustry, value: m.fb.industry },
    { key: 'expertise', label: t.teamPage.metaExpertise, value: m.fb.expertise },
  ];
  const more = m.expertise.slice(3);
  const socials = m.socials.filter((s) => isLink(s.url));

  return (
    <>
      <Field data-stagger id={titleId} ck={`${lang}.teamPage.members.${m.id}.name`} fb={m.fb.name} format={nameCase} as="h2" className="t-headline max-w-[14ch]" />
      <dl data-stagger className="grid gap-x-8 gap-y-6 rounded-card bg-paper-2 p-[clamp(20px,2.4vw,32px)] sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col gap-1.5">
            <dt className="t-small text-ink-3">
              <T ck={`${lang}.teamPage.metaLabels.${row.key}`} fb={row.label} />
            </dt>
            <dd className="t-body m-0 text-ink">
              <Field ck={`${lang}.teamPage.members.${m.id}.${row.key}`} fb={row.value} />
            </dd>
          </div>
        ))}
      </dl>
      <Field data-stagger ck={`${lang}.teamPage.members.${m.id}.description`} fb={m.fb.description} as="p" multiline className="t-body max-w-[62ch] text-ink-2" />
      {more.length > 0 && (
        <div data-stagger className="flex flex-col gap-3">
          <T k="teamPage.moreSkills" fb={c.moreSkills} as="p" className="t-small text-ink-3" />
          <ul className="flex flex-wrap gap-2">
            {more.map((skill) => (
              <li key={skill} className="rounded-full bg-paper-2 px-4 py-2 text-[0.95rem] text-ink">{skill}</li>
            ))}
          </ul>
        </div>
      )}
      {(socials.length > 0 || isLink(m.portfolio)) && (
        <div data-stagger className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          {socials.map((s) => <ProfileLink key={s.name} href={s.url} name={s.name} />)}
          {isLink(m.portfolio) && (
            <Button href={m.portfolio} size="md"><T k="teamPage.visitPortfolio" /></Button>
          )}
        </div>
      )}
    </>
  );
}

export default function TeamPage() {
  const { tr, lang } = useT();
  const c = copy[lang] || copy.en;
  const members = useMembers();
  const founders = FOUNDER_IDS.map((id) => members.find((m) => m.id === id));
  const clan = members.filter((m) => !FOUNDER_IDS.includes(m.id));
  const order = [...founders, ...clan];
  const [active, setActive] = useState(null); // { id, origin }
  const titleId = useId();

  const open = useCallback((id, origin) => setActive({ id, origin }), []);
  const close = useCallback(() => {
    setActive(null);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);
  const step = (dir) => setActive((a) => {
    const i = order.findIndex((m) => m.id === a.id);
    return { id: order[(i + dir + order.length) % order.length].id, origin: a.origin };
  });
  const current = active && members.find((m) => m.id === active.id);

  return (
    <Page title={tr('teamPage.metaTitle', c.metaTitle)} description={tr('teamPage.metaDesc', c.metaDesc)}>
      <Intro members={order} c={c} onOpen={open} />
      <Founders members={founders} c={c} onOpen={open} />
      <Clan members={clan} c={c} onOpen={open} />
      <Closing c={c} />

      {current && (
        <PersonDrawer
          itemKey={current.id}
          titleId={titleId}
          origin={active.origin}
          label={<T k="teamPage.teamLabel" />}
          labels={{ close: tr('teamPage.close', c.close), prev: c.prev, next: c.next }}
          onClose={close}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          media={(
            <Portrait
              ck={`${lang}.teamPage.members.${current.id}.image`}
              src={current.fb.image}
              alt={nameCase(current.fb.name)}
              focus={current.frame.focus}
              zoom={current.frame.zoom}
              center={current.frame.center}
              soon={c.portraitSoon}
              className="aspect-[4/3] md:aspect-[4/5]"
            />
          )}
        >
          <MemberDetail m={current} c={c} titleId={titleId} />
        </PersonDrawer>
      )}
    </Page>
  );
}
