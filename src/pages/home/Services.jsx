import { useEffect, useRef, useState } from 'react';
import { T, useT } from '../../lib/content';
import { Reveal, SplitText } from '../../components/ui/Reveal';
import { useLenis } from '../../lib/SmoothScroll';
import { gsap, ScrollTrigger, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { Pictogram, morphTo, STATES, SERVICE_STATES } from './ServicesPictograms';

const ITEMS = [0, 1, 2, 3];

// Timeline layout of the pinned scene (in timeline seconds): the mark holds,
// then each pictogram forms and rests before the next one.
const MORPH_AT = [0.3, 2.3, 4.3, 6.3];
const SWITCH_AT = [2.8, 4.8, 6.8];
const REST_AT = [1.8, 3.8, 5.8, 7.7];
const TOTAL = 8;

function Tag({ i, className = '' }) {
  return (
    <T
      k={`features.items.${i}.tag`}
      className={`t-small inline-flex h-9 items-center rounded-full bg-paper px-4 text-ink ${className}`}
    />
  );
}

/** Desktop: the pinned scene. The mark becomes each service as you scroll. */
function Scene() {
  const root = useRef(null);
  const stage = useRef(null);
  const bar = useRef(null);
  const st = useRef(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const { tr } = useT();

  useGSAP(() => {
    const svg = stage.current;
    const proxy = { ...STATES.mark.head };
    const setBar = gsap.quickSetter(bar.current, 'scaleX');
    let last = 0;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 3.4)}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const t = self.progress * TOTAL;
          const idx = SWITCH_AT.filter((s) => t >= s).length;
          setBar(self.progress);
          if (idx !== last) {
            last = idx;
            setActive(idx);
          }
        },
      },
    });
    SERVICE_STATES.forEach((name, i) => morphTo(tl, svg, proxy, name, MORPH_AT[i], 1));
    tl.to({}, { duration: TOTAL - tl.duration() }, tl.duration());
    st.current = tl.scrollTrigger;
    // Keep refresh order = page order even when the scene mounts after a resize.
    ScrollTrigger.sort();

    // Entrance of the frame before it pins.
    gsap.from(root.current.querySelectorAll('[data-enter]'), {
      y: 28,
      autoAlpha: 0,
      duration: 1.05,
      ease: EASE.out,
      stagger: 0.08,
      scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
    });
    gsap.from(root.current.querySelector('[data-stage]'), {
      scale: 0.94,
      autoAlpha: 0,
      duration: 1.3,
      ease: EASE.out,
      scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
    });
  }, { scope: root });

  const goTo = (i) => {
    const s = st.current;
    if (!s) return;
    const y = s.start + ((s.end - s.start) * REST_AT[i]) / TOTAL;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div ref={root} className="shell grid h-[100svh] grid-cols-12 gap-x-[var(--gap)] pb-[clamp(20px,3vh,40px)] pt-[calc(var(--nav-h)+clamp(12px,3vh,40px))]">
      <div className="col-span-5 flex min-h-0 flex-col justify-between gap-8 pb-2">
        <div>
          <T data-enter k="features.badge" as="p" className="t-small text-ink-3" />
          <SplitText
            id="services-title"
            k="features.title"
            className="t-headline mt-4 text-[clamp(1.75rem,2.9vw,3.5rem)]"
          />
          <T data-enter k="features.subtitle" as="p" className="t-lead mt-6 max-w-[30ch] text-ink-2" />
        </div>

        <div>
          <ol className="flex flex-col gap-1" aria-label={tr('features.badge')}>
            {ITEMS.map((i) => {
              const on = i === active;
              return (
                <li key={i} data-enter>
                  <h3>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={on ? 'step' : undefined}
                      className={`group flex w-full items-center gap-4 rounded-full py-2 text-left text-[clamp(1.75rem,2.75vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] transition-colors duration-500 ${
                        on ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 shrink-0 rounded-full bg-blue transition-transform duration-500 ease-[var(--ease-spring)] ${
                          on ? 'scale-100' : 'scale-0 group-hover:scale-50'
                        }`}
                      />
                      <span className="transition-transform duration-500 ease-[var(--ease-out)] group-active:scale-[0.98]">
                        <T k={`features.items.${i}.title`} />
                      </span>
                    </button>
                  </h3>
                </li>
              );
            })}
          </ol>
          <div data-enter aria-hidden="true" className="ml-[30px] mt-6 h-2 w-40 overflow-hidden rounded-full bg-paper-3">
            <div ref={bar} className="h-full w-full origin-left scale-x-0 rounded-full bg-ink" />
          </div>
        </div>
      </div>

      <div data-stage className="col-span-7 col-start-6 flex min-h-0 flex-col overflow-hidden rounded-media bg-paper-2">
        <div className="relative min-h-0 flex-1 px-[6%] pt-[5%]">
          <Pictogram ref={stage} state="mark" className="h-full w-full" />
        </div>
        <div className="grid p-[clamp(24px,3vw,44px)] pt-0">
          {ITEMS.map((i) => {
            const on = i === active;
            return (
              <div
                key={i}
                aria-hidden={!on}
                className={`col-start-1 row-start-1 flex flex-col items-start gap-5 transition-all duration-700 ease-[var(--ease-out)] ${
                  on ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
                }`}
              >
                <Tag i={i} />
                <T k={`features.items.${i}.description`} as="p" className="t-lead max-w-[36ch] text-ink" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** One service on its own: phones, tablets, reduced motion and the editor. */
function Card({ i, animate }) {
  const ref = useRef(null);
  const name = SERVICE_STATES[i];

  useGSAP(() => {
    if (!animate) return;
    const svg = ref.current.querySelector('svg');
    const proxy = { ...STATES[name].head };
    const set = gsap.timeline();
    morphTo(set, svg, proxy, 'mark', 0, 0);
    set.progress(1);
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 72%', once: true } });
    morphTo(tl, svg, proxy, name, 0.15, 1.3);
  }, { scope: ref, dependencies: [animate] });

  return (
    <li ref={ref} className="flex flex-col">
      <div className="aspect-square overflow-hidden rounded-media bg-paper-2 p-[8%]">
        <Pictogram state={name} className="h-full w-full" />
      </div>
      <h3 className="t-title mt-6"><T k={`features.items.${i}.title`} /></h3>
      <T k={`features.items.${i}.description`} as="p" className="t-body mt-3 max-w-[44ch] text-ink-2" />
      <div className="mt-5"><Tag i={i} className="bg-paper-2" /></div>
    </li>
  );
}

function Stacked({ animate }) {
  return (
    <div className="shell section">
      <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <T k="features.badge" as="p" className="t-small text-ink-3 lg:col-span-3 lg:pt-4" />
        <div className="lg:col-span-9">
          <SplitText id="services-title" k="features.title" className="t-display max-w-[16ch] max-sm:text-[2.4rem]" />
          <T k="features.subtitle" as="p" className="t-lead mt-6 max-w-[36ch] text-ink-2" />
        </div>
      </div>
      <Reveal as="ul" className="mt-[clamp(56px,8vw,112px)] grid gap-x-[var(--gap)] gap-y-16 md:grid-cols-2" stagger={0.09}>
        {ITEMS.map((i) => <Card key={i} i={i} animate={animate} />)}
      </Reveal>
    </div>
  );
}

const SCENE_QUERY = '(min-width: 1024px) and (min-height: 640px)';

function pickMode(isEditing) {
  if (typeof window === 'undefined') return { scene: false, animate: false };
  const motion = !isEditing && !reducedMotion();
  return { scene: motion && window.matchMedia(SCENE_QUERY).matches, animate: motion };
}

/** Services: the signature scene of the home page. */
export default function Services() {
  const { isEditing } = useT();
  // Decided on the first render so the pin is created in page order with the
  // other sections' triggers (their positions depend on its spacing).
  const [mode, setMode] = useState(() => pickMode(isEditing));

  useEffect(() => {
    const mq = window.matchMedia(SCENE_QUERY);
    const update = () => {
      const next = pickMode(isEditing);
      setMode((m) => (m.scene === next.scene && m.animate === next.animate ? m : next));
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [isEditing]);

  return (
    <section id="services" aria-labelledby="services-title" className="relative">
      {mode.scene ? <Scene /> : <Stacked animate={mode.animate} />}
    </section>
  );
}
