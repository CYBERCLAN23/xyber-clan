import { useRef } from 'react';
import Logo from '../../brand/Logo';
import Button from '../../components/ui/Button';
import Link from '../../components/ui/Link';
import { Reveal, SplitText } from '../../components/ui/Reveal';
import { T, useT } from '../../lib/content';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';

const SERVICES = ['web', 'mobile', 'design', 'cybersec', 'hardware', 'training'];
const WHATSAPP = 'https://wa.me/237654269488';

const ctaCopy = {
  en: { quick: 'Quick start: pick what you need' },
  fr: { quick: 'Démarrage rapide : choisissez votre besoin' },
};

/** The close: a blue chapter, the mark assembling, and every way in. */
export default function Cta() {
  const { lang, isEditing } = useT();
  const copy = ctaCopy[lang] || ctaCopy.en;
  const root = useRef(null);

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const svg = root.current.querySelector('[data-cta-mark]');
    const part = (p) => svg.querySelector(`[data-part="${p}"]`);
    // The pieces of the mark fly in and lock into place as the chapter arrives.
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 55%', scrub: 0.9 } })
      .from(part('x'), { x: -120, y: -90, rotate: -28, autoAlpha: 0, transformOrigin: '50% 50%', ease: EASE.out }, 0)
      .from(part('spark'), { autoAlpha: 0, scale: 0.2, transformOrigin: '50% 50%', ease: EASE.out }, 0.35)
      .from(part('body'), { scaleY: 0, scaleX: 0.5, transformOrigin: '50% 100%', ease: EASE.out }, 0.15)
      .from(part('head-group'), { y: -260, autoAlpha: 0, ease: 'bounce.out' }, 0.2);
    // Once in place, the spark keeps drifting like a signal.
    gsap.to(part('spark'), { x: 18, y: -20, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 });
  }, { scope: root, dependencies: [isEditing] });

  return (
    <div id="contact">
      <section ref={root} aria-labelledby="cta-title" className="overflow-hidden bg-blue-deep text-white">
        <div className="shell pb-[clamp(72px,9vw,150px)] pt-[var(--section)]">
          <h2 id="cta-title" className="t-mega relative z-10 max-sm:text-[clamp(2.75rem,13vw,3.6rem)]">
            <SplitText k="cta.title" as="span" className="block" />
            <SplitText k="cta.titleLine2" as="span" className="block text-cyan" delay={0.12} />
          </h2>

          <div className="mt-[clamp(40px,5vw,80px)] grid gap-y-12 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
            <div className="flex flex-col gap-12 lg:col-span-7">
              <Reveal className="flex flex-col items-start gap-8">
                <T k="cta.subtitle" as="p" className="t-lead max-w-[34ch] text-white/85" />
                <div className="flex flex-wrap gap-3">
                  <Button to="/start-project" variant="light" size="lg"><T k="cta.primaryButton" /></Button>
                  <Button href={WHATSAPP} variant="onColor" size="lg" arrow={false}><T k="cta.secondaryButton" /></Button>
                </div>
              </Reveal>

              <Reveal as="nav" aria-label={copy.quick} className="flex flex-col gap-4">
                <p className="t-small text-white/80"><T k="ctaQuick.label" fb={copy.quick} /></p>
                <ul className="flex flex-wrap gap-2">
                  {SERVICES.map((id) => (
                    <li key={id}>
                      <Link
                        to={`/start-project?service=${id}`}
                        className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white/12 px-5 text-[0.98rem] font-medium text-white transition-colors duration-500 ease-[var(--ease-out)] hover:bg-white hover:text-blue-deep focus-visible:bg-white focus-visible:text-blue-deep active:scale-[0.98]"
                      >
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cyan transition-[width] duration-500 ease-[var(--ease-out)] group-hover:w-5" />
                        <T k={`form.options.${id}`} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="relative z-0 flex items-end justify-end lg:col-span-5 lg:pt-[clamp(80px,9vw,160px)]">
              <Logo
                data-cta-mark
                variant="symbol"
                decorative
                className="h-auto w-[min(72%,360px)] overflow-visible lg:w-full lg:max-w-[520px]"
                style={{ '--mark-ink': '#ffffff', '--mark-ring': '#ffffff' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
