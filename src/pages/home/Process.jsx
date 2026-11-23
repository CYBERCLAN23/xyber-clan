import { useRef } from 'react';
import Button from '../../components/ui/Button';
import { Reveal, SplitText } from '../../components/ui/Reveal';
import { T, useT } from '../../lib/content';
import { gsap, ScrollTrigger, useGSAP, EASE } from '../../lib/motion';
import { STEP_IDS, PICTOGRAMS, processCopy } from './processData';

/**
 * How we work: the six steps of a project. On large screens the section pins
 * and the ordered list travels sideways as you scroll; on phones it stacks.
 */
export default function Process() {
  const { lang, isEditing } = useT();
  const copy = processCopy[lang] || processCopy.en;
  const root = useRef(null);
  // Sideways layout only where it can move: large screens, motion allowed, not editing.
  const side = isEditing ? '' : 'motion-safe:lg:w-max motion-safe:lg:flex motion-safe:lg:flex-row';
  const card = isEditing ? '' : 'motion-safe:lg:h-[clamp(400px,54vh,540px)] motion-safe:lg:w-[clamp(320px,27vw,440px)] motion-safe:lg:shrink-0';

  useGSAP(() => {
    if (isEditing) return undefined;
    const mm = gsap.matchMedia();
    const q = (s) => root.current.querySelector(s);
    const pics = (el) => el.querySelectorAll('[data-pic]');

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const stage = q('[data-stage]');
      const track = q('[data-track]');
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tl.to(track, { x: () => -dist() }, 0).fromTo(q('[data-progress]'), { scaleX: 0 }, { scaleX: 1 }, 0);

      // Each pictogram assembles as its step slides into view.
      // Steps already on screen assemble as the section arrives; the rest as they slide in.
      root.current.querySelectorAll('[data-step]').forEach((li) => {
        const onScreen = li.getBoundingClientRect().left < window.innerWidth * 0.92;
        gsap.from(pics(li), {
          scale: 0,
          rotate: -25,
          transformOrigin: '50% 50%',
          duration: 1,
          ease: EASE.spring,
          stagger: 0.07,
          scrollTrigger: onScreen
            ? { trigger: li, start: 'top 80%', once: true }
            : { trigger: li, containerAnimation: tl, start: 'left 92%', toggleActions: 'play none none reverse' },
        });
      });
      // Sections above can change height after load (late images, fonts):
      // re-measure so the pin starts exactly when the section reaches the top.
      let timer;
      const ro = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => ScrollTrigger.refresh(), 150);
      });
      ro.observe(document.querySelector('main') || document.body);
      return () => { ro.disconnect(); clearTimeout(timer); };
    });

    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      root.current.querySelectorAll('[data-step]').forEach((li) => {
        gsap.from(pics(li), {
          scale: 0,
          rotate: -25,
          transformOrigin: '50% 50%',
          duration: 1,
          ease: EASE.spring,
          stagger: 0.07,
          scrollTrigger: { trigger: li, start: 'top 82%', once: true },
        });
      });
    });

    return () => mm.revert();
  }, { scope: root, dependencies: [isEditing, lang] });

  return (
    <section ref={root} aria-labelledby="process-title" className="bg-paper-2">
      <div data-stage className="flex flex-col gap-[clamp(48px,6vh,80px)] py-[var(--section)] lg:min-h-[100svh] lg:justify-center lg:py-[clamp(72px,10vh,120px)]">
        <header className="shell grid gap-y-6 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
          <T k="get_started.badge" as="p" className="t-small text-ink-3 lg:col-span-12" />
          <SplitText id="process-title" k="get_started.title" as="h2" className="t-headline lg:col-span-7" />
          <Reveal className="flex flex-col items-start gap-6 lg:col-span-4 lg:col-start-9 lg:self-end">
            <T k="get_started.subtitle" as="p" className="t-body text-ink-2" />
            <Button to="/start-project"><T k="cta.primaryButton" /></Button>
          </Reveal>
        </header>

        <div className="overflow-x-clip">
          <div data-track className={`grid gap-3 px-[var(--margin)] md:grid-cols-2 lg:grid-cols-3 lg:gap-[var(--gap)] ${side}`}>
            <ol className={`grid gap-3 md:col-span-2 md:grid-cols-2 lg:col-span-3 lg:grid-cols-3 lg:gap-[var(--gap)] ${side}`}>
              {STEP_IDS.map((id, i) => {
                const Pic = PICTOGRAMS[id];
                return (
                  <li
                    key={id}
                    data-step
                    className={`group flex flex-col justify-between gap-8 rounded-card bg-paper p-6 md:p-8 ${card}`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="aspect-[4/3] w-[min(280px,74%)] transition-transform duration-700 ease-[var(--ease-spring)] group-hover:-translate-y-1.5 group-hover:-rotate-2">
                        <Pic />
                      </div>
                      <span className="t-small tabular text-ink-3">{copy.step} {i + 1}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <T k={`get_started.labels.${id}`} as="h3" className="t-headline" />
                      <T k={`processSteps.${id}`} fb={copy[id]} as="p" className="t-body max-w-[34ch] text-ink-2" />
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className={`flex flex-col justify-between gap-10 rounded-card bg-ink p-6 text-paper md:col-span-2 md:p-8 lg:col-span-3 motion-safe:lg:col-span-1 ${card}`}>
              <T k="cta.subtitle" as="p" className="t-title" />
              <div>
                <Button to="/start-project" variant="light" size="lg"><T k="cta.primaryButton" /></Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll progress: the spark fills as the steps go by (pinned layout only). */}
        <div aria-hidden="true" className={`shell hidden ${isEditing ? '' : 'motion-safe:lg:block'}`}>
          <span className="block h-1.5 w-full overflow-hidden rounded-full bg-paper-3">
            <span data-progress className="block h-full w-full origin-left rounded-full" style={{ background: 'linear-gradient(90deg, color-mix(in oklab, var(--brand-cyan) 20%, transparent), var(--brand-cyan))', transform: 'scaleX(0)' }} />
          </span>
        </div>
      </div>
    </section>
  );
}
