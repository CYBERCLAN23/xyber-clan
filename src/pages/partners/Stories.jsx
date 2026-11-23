import { useRef } from 'react';
import Button from '../../components/ui/Button';
import { SplitText, Reveal } from '../../components/ui/Reveal';
import { T, Img, useT } from '../../lib/content';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { HULT_STATS, HULT_LABELS, LINKS, IMAGES } from './data';
import { Rich } from './bits';

/** Pictures open from a rounded window to full size, the photo settling as it scrolls. */
function useMediaMotion(root, isEditing) {
  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    root.current.querySelectorAll('[data-open]').forEach((fig) => {
      const img = fig.querySelector('img');
      gsap.fromTo(fig,
        { clipPath: 'inset(10% 8% 10% 8% round 40px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: fig, start: 'top 95%', end: 'top 35%', scrub: 0.6 } });
      if (img) {
        gsap.fromTo(img, { scale: 1.22, yPercent: -5 }, {
          scale: 1.04, yPercent: 5, ease: 'none',
          scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
    });
    root.current.querySelectorAll('[data-pop]').forEach((el) => {
      gsap.from(el, { scale: 0.5, autoAlpha: 0, duration: 1.3, ease: EASE.spring, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
  }, { scope: root, dependencies: [isEditing] });
}

/** Running head on the left, sentence case. */
function Label({ c }) {
  return <T k="partnersPage.storyLabel" fb={c.storyLabel} as="p" className="t-small text-ink-3" />;
}

export function HultStory({ c }) {
  const root = useRef(null);
  const { t, lang, isEditing } = useT();
  const narrative = t.partnersPage.hultStory.narrative || [];
  const labels = HULT_LABELS[lang] || HULT_LABELS.en;
  useMediaMotion(root, isEditing);

  return (
    <section id="hult" ref={root} aria-labelledby="hult-title" className="section scroll-mt-[var(--nav-h)]">
      <div className="shell">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
          <div className="lg:col-span-3 lg:pt-3"><Label c={c} /></div>
          <div className="lg:col-span-9">
            <SplitText id="hult-title" k="partnersPage.hultStory.title" as="h2" className="t-headline max-w-[18ch]" />
            <Reveal delay={0.2}>
              <T k="partnersPage.hultStory.description" fb={c.hultDescription} as="p" className="t-lead mt-6 max-w-[44ch] text-ink-2" />
            </Reveal>
          </div>
        </div>

        <figure data-open className="mt-[clamp(40px,5vw,80px)] aspect-[4/3] overflow-hidden rounded-media bg-paper-2 sm:aspect-[16/9] lg:aspect-[21/9]">
          <Img k="partnersPage.images.hultGroup" src={IMAGES.hultGroup} alt={c.hultGroupAlt} className="h-full w-full object-cover object-[50%_40%] will-change-transform" />
        </figure>

        <div className="mt-[clamp(48px,6vw,104px)] grid gap-y-12 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
          <figure className="aspect-[4/5] overflow-hidden rounded-media bg-paper-2 lg:col-span-5">
            <Img k="partnersPage.images.hultTeam" src={IMAGES.hultTeam} alt={c.hultTeamAlt} className="h-full w-full object-cover object-top" />
          </figure>

          <div className="flex flex-col justify-between gap-12 lg:col-span-6 lg:col-start-7">
            <Reveal className="flex max-w-[62ch] flex-col gap-5">
              {narrative.map((p, i) => (
                <T
                  key={i}
                  k={`partnersPage.hultStory.narrative${i}`}
                  fb={p}
                  as="p"
                  multiline
                  className={i === 0 ? 't-lead text-ink' : 't-body text-ink-2'}
                />
              ))}
            </Reveal>

            <div>
              <T k="partnersPage.hultStatsLabel" fb={c.hultStatsLabel} as="p" className="t-small mb-4 text-ink-3" />
              <Reveal as="dl" className="grid grid-cols-3 gap-[var(--gap)] rounded-card bg-paper-2 p-[clamp(18px,2vw,32px)]">
                {HULT_STATS.map((s, i) => (
                  <div key={s.value} className="flex flex-col-reverse gap-2">
                    <dt className="t-small text-ink-2">{labels[i]}</dt>
                    <dd className="tabular text-[clamp(1.6rem,3vw,3rem)] font-semibold leading-none tracking-[-0.04em]">{s.value}</dd>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GehmitStory({ c }) {
  const root = useRef(null);
  const { isEditing } = useT();
  useMediaMotion(root, isEditing);

  return (
    <section id="gehmit" ref={root} aria-labelledby="gehmit-title" className="bg-paper-2 py-[var(--section)] scroll-mt-[var(--nav-h)]">
      <div className="shell grid gap-y-12 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <div className="lg:col-span-5">
          <div className="grid aspect-square place-items-center rounded-media bg-paper lg:sticky lg:top-[calc(var(--nav-h)+24px)]">
            <span data-pop className="grid aspect-square w-[64%] place-items-center overflow-hidden rounded-full bg-white">
              <Img k="partnersPage.images.gehmitLogo" src={IMAGES.gehmitLogo} alt={c.gehmitLogoAlt} className="h-full w-full object-contain mix-blend-multiply" />
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-6 lg:col-start-7 lg:pt-6">
          <Label c={c} />
          <SplitText id="gehmit-title" text="Gehmit" as="h2" className="t-display mt-5" />
          <Reveal className="mt-8 flex max-w-[60ch] flex-col gap-5">
            <T k="partnersPage.gehmit.tagline" fb={c.gehmitTagline} as="p" className="t-lead text-ink" />
            <Rich k="partnersPage.gehmit.p1" fb={c.gehmitP1} bold={c.gehmitBold} className="t-body text-ink-2" />
            <Rich k="partnersPage.gehmit.p2" fb={c.gehmitP2} className="t-body text-ink-2" />
            <div className="pt-4">
              <Button href={LINKS.gehmit} size="lg"><T k="partnersPage.gehmit.visit" fb={c.gehmitVisit} /></Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function DivLabsStory({ c }) {
  const root = useRef(null);
  const { isEditing } = useT();
  useMediaMotion(root, isEditing);

  return (
    <section id="divlabs" ref={root} aria-labelledby="divlabs-title" className="section scroll-mt-[var(--nav-h)]">
      <div className="shell grid gap-y-12 lg:grid-cols-12 lg:items-center lg:gap-x-[var(--gap)]">
        <div className="flex flex-col lg:col-span-5">
          <Label c={c} />
          <SplitText id="divlabs-title" text="DivLabs" as="h2" className="t-display mt-5" />
          <Reveal className="mt-8 flex max-w-[60ch] flex-col gap-5">
            <T k="partnersPage.divlabs.tagline" fb={c.divlabsTagline} as="p" className="t-lead text-ink" />
            <Rich k="partnersPage.divlabs.p1" fb={c.divlabsP1} bold={c.divlabsBold} className="t-body text-ink-2" />
            <Rich k="partnersPage.divlabs.p2" fb={c.divlabsP2} className="t-body text-ink-2" />
            <div className="pt-4">
              <Button href={LINKS.divlabs} size="lg"><T k="partnersPage.divlabs.visit" fb={c.divlabsVisit} /></Button>
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-7">
          <figure data-open className="aspect-[16/9] overflow-hidden rounded-media bg-paper-2">
            <Img k="partnersPage.images.divlabsWebinar" src={IMAGES.divlabsWebinar} alt={c.divlabsWebinarAlt} className="h-full w-full object-cover will-change-transform" />
          </figure>
          <span data-pop className="absolute -bottom-[clamp(28px,4vw,56px)] left-[clamp(16px,3vw,48px)] grid aspect-square w-[clamp(96px,13vw,190px)] place-items-center overflow-hidden rounded-full bg-white ring-[clamp(6px,0.8vw,12px)] ring-paper">
            <Img k="partnersPage.images.divlabsLogo" src={IMAGES.divlabsLogo} alt={c.divlabsLogoAlt} className="h-[82%] w-[82%] object-contain mix-blend-multiply" />
          </span>
        </div>
      </div>
    </section>
  );
}
