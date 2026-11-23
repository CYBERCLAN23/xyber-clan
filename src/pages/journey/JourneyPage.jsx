import { useMemo, useRef } from 'react';
import Page from '../../components/site/Page';
import Button from '../../components/ui/Button';
import { Reveal, SplitText } from '../../components/ui/Reveal';
import { T, Img, useT } from '../../lib/content';
import { gsap, useGSAP, reducedMotion } from '../../lib/motion';
import Timeline from './Timeline';
import { copy } from './copy';
import { INCEPTION_YEAR, CTA_ROUTE, DEFAULT_OBJECT_POSITION } from './data';

/** Opening: the title, the lead and the two figures of the story so far. */
function Opening({ count, c }) {
  return (
    <header className="shell pb-[clamp(40px,5vw,80px)] pt-[calc(var(--nav-h)+clamp(56px,9vw,150px))]">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap)]">
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <T k="journey.heroTag" fb="The Story So Far" as="p" className="t-small mb-6 text-ink-3" />
          </Reveal>
          <SplitText k="journey.title" as="h1" immediate delay={0.2} className="t-display" />
        </div>
        <Reveal className="flex flex-col gap-8 lg:col-span-5 lg:col-start-8 lg:pb-3" delay={0.45} stagger={0.09}>
          <T k="journey.subtitle" as="p" className="t-lead text-ink-2" />
          <dl className="grid grid-cols-2 gap-[var(--gap)]">
            <div className="rounded-card bg-paper-2 p-5 md:p-6">
              <dt className="t-small text-ink-3"><T k="journeyPage.statInception" fb={c.inception} /></dt>
              <dd className="t-headline tabular mt-3">{INCEPTION_YEAR}</dd>
            </div>
            <div className="rounded-card bg-paper-2 p-5 md:p-6">
              <dt className="t-small text-ink-3"><T k="journeyPage.statMilestones" fb={c.milestones} /></dt>
              <dd className="t-headline tabular mt-3">{count}</dd>
            </div>
          </dl>
          <p className="t-small flex items-center gap-3 text-ink-3">
            <span aria-hidden="true" className="relative block h-7 w-4 rounded-full border-[1.5px] border-current">
              <span className="absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 animate-bounce rounded-full bg-current" />
            </span>
            <T k="journeyPage.scrollHint" fb={c.scrollHint} />
          </p>
        </Reveal>
      </div>
    </header>
  );
}

/** Closing chapter on a cyan field: the next milestone is the visitor's project. */
function NextChapter({ last, lastIdx, c }) {
  const { t, lang, isEditing } = useT();
  const ref = useRef(null);

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const img = ref.current.querySelector('[data-cta-media] img');
    if (img) {
      gsap.fromTo(img, { scale: 1.18 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
    }
  }, { scope: ref, dependencies: [isEditing] });

  return (
    <section ref={ref} aria-labelledby="journey-cta" className="bg-cyan text-on-cyan">
      <div className="shell grid gap-y-12 py-[clamp(88px,11vw,176px)] lg:grid-cols-12 lg:items-center lg:gap-x-[var(--gap)]">
        <div className="lg:col-span-6">
          <Reveal stagger={0.08}>
            <T k="journeyPage.whatsNext" fb={c.whatsNext} as="p" className="t-small mb-6 opacity-75" />
            <h2 id="journey-cta" className="t-headline max-w-[20ch]">
              <T k="journeyPage.ctaTitle" fb={t.journey.ctaTitle} />
            </h2>
            <T k="journeyPage.ctaDesc" fb={t.journey.ctaDesc} multiline as="p" className="t-lead mt-6 max-w-[34ch] whitespace-pre-line" />
            <div className="mt-10">
              <Button to={CTA_ROUTE} variant="onColor" size="lg">
                <T k="journeyPage.ctaButton" fb={t.nav.getStarted} />
              </Button>
            </div>
          </Reveal>
        </div>
        {last && (
          <Reveal className="lg:col-span-6" y={40}>
            <div data-cta-media className="relative aspect-[4/3] overflow-hidden rounded-media bg-[#0d1a1c]/10">
              <Img
                ck={`${lang}.journeyPage.event${lastIdx}.image`}
                src={last.image}
                alt={last.title}
                objectPosition={last.objectPosition || DEFAULT_OBJECT_POSITION}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default function JourneyPage() {
  const { t, tr, lang } = useT();
  const c = copy[lang] || copy.en;
  const events = useMemo(() => t.journey?.events || [], [t]);
  const lastIdx = events.length - 1;

  return (
    <Page title={tr('journeyPage.metaTitle', c.metaTitle)} description={tr('journeyPage.metaDesc', c.metaDesc)}>
      <Opening count={events.length} c={c} />
      <Timeline events={events} />
      <NextChapter last={events[lastIdx]} lastIdx={lastIdx} c={c} />
    </Page>
  );
}
