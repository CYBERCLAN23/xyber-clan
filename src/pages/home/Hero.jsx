import { useEffect, useRef, useState } from 'react';
import Logo from '../../brand/Logo';
import Button from '../../components/ui/Button';
import { SplitText, Words } from '../../components/ui/Reveal';
import { T, useT } from '../../lib/content';
import { useCMS } from '../../context/CMSContext';
import { gsap, useGSAP, EASE, reducedMotion, finePointer } from '../../lib/motion';
import { isHolidaySeason } from '../../utils/festive';

/** Cycles through the disciplines (hero.typing), one lit at a time. */
function Disciplines() {
  const { t } = useT();
  const items = (t.hero.typing || []).filter((w) => w && w !== 'XyberClan');
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion() || items.length < 2) return undefined;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 1800);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="Disciplines">
      {items.map((w, idx) => (
        <li key={w} className={`inline-flex items-center gap-2 transition-colors duration-500 ${idx === i ? 'text-ink' : 'text-ink-3'}`}>
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ease-[var(--ease-spring)] ${idx === i ? 'scale-100 bg-cyan' : 'scale-50 bg-ink-3'}`} />
          {w}
        </li>
      ))}
    </ul>
  );
}

export default function Hero() {
  const root = useRef(null);
  const mark = useRef(null);
  const { isEditing } = useCMS();
  const festive = isHolidaySeason();
  const introPlaying = typeof window !== 'undefined' && window.__xcIntroPlaying;

  useGSAP(() => {
    if (isEditing || reducedMotion()) return undefined;
    const svg = mark.current;
    const part = (p) => svg.querySelector(`[data-part="${p}"]`);
    const introDelay = introPlaying ? 2.7 : 0.25;

    // 1. Assembly: the five pieces find their places.
    const tl = gsap.timeline({ delay: introDelay, defaults: { ease: EASE.out } });
    tl.from(part('x-long'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1.1, ease: EASE.snap }, 0)
      .from(part('x-short'), { scaleX: 0, transformOrigin: '100% 50%', duration: 0.9, ease: EASE.snap }, 0.25)
      .from(part('spark'), { x: -320, y: 320, autoAlpha: 0, duration: 1.1 }, 0.35)
      .from(part('letters'), { yPercent: 40, autoAlpha: 0, duration: 1.2 }, 0.3)
      .from(part('body'), { scaleY: 0, scaleX: 0.55, transformOrigin: '50% 100%', duration: 1.3, ease: 'elastic.out(1, 0.55)' }, 0.55)
      .from(part('head-group'), { y: -640, duration: 1.2, ease: 'bounce.out' }, 0.75)
      .from(root.current.querySelectorAll('[data-hero-fade]'), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.5);

    // 2. The spark flicks now and then, like a signal.
    const flick = gsap.timeline({ repeat: -1, repeatDelay: 4.5, delay: introDelay + 3 });
    flick.to(part('spark'), { x: 40, y: -46, duration: 0.35, ease: 'power2.out' })
      .to(part('spark'), { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });

    // 3. The head follows the pointer, and the figure hops when clicked.
    const head = part('head-group');
    const body = part('body');
    const figure = part('figure');
    let cleanupPointer = () => {};
    if (finePointer()) {
      const xTo = gsap.quickTo(head, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.5)' });
      const yTo = gsap.quickTo(head, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.5)' });
      const move = (e) => {
        const r = head.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(d / 14, 34);
        xTo((dx / d) * k);
        yTo((dy / d) * k * 0.8);
      };
      window.addEventListener('pointermove', move, { passive: true });
      cleanupPointer = () => window.removeEventListener('pointermove', move);
    }
    const hop = () => {
      gsap.timeline()
        .to(body, { scaleY: 0.86, scaleX: 1.08, transformOrigin: '50% 100%', duration: 0.18, ease: 'power2.out' })
        .to(figure, { y: '-=90', duration: 0.32, ease: 'power2.out' }, '<')
        .to(body, { scaleY: 1, scaleX: 1, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
        .to(figure, { y: '+=90', duration: 0.7, ease: 'bounce.out' }, '<');
    };
    figure.style.cursor = 'pointer';
    figure.addEventListener('click', hop);

    // 4. Scroll: the pieces drift apart as the page moves on.
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 } })
      .to(svg.querySelector('[data-part="x"]'), { y: -90, rotate: -6, transformOrigin: '50% 50%', ease: 'none' }, 0)
      .to(part('spark'), { x: 160, y: -220, autoAlpha: 0, ease: 'none' }, 0)
      .to(part('letters'), { y: -40, ease: 'none' }, 0)
      .to(svg.querySelector('[data-part="body"]'), { y: -150, ease: 'none' }, 0)
      .to(head, { y: -170, ease: 'none' }, 0)
      .to(root.current.querySelector('[data-hero-copy]'), { yPercent: -30, autoAlpha: 0, ease: 'none' }, 0);

    return () => {
      cleanupPointer();
      figure.removeEventListener('click', hop);
      figure.style.cursor = '';
    };
  }, { scope: root, dependencies: [isEditing] });

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div data-hero-copy className="shell grid gap-x-[var(--gap)] gap-y-8 pt-[calc(var(--nav-h)+clamp(36px,8vh,120px))] lg:grid-cols-12 lg:items-end">
        <SplitText
          id="hero-title"
          k="hero.slogan"
          as="h1"
          immediate
          delay={introPlaying ? 2.9 : 0.35}
          className="text-[clamp(3rem,12vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.05em] lg:col-span-7 lg:text-[clamp(4rem,6.4vw,7.25rem)]"
        />
        <div className="flex flex-col gap-7 lg:col-span-5 lg:col-start-8 lg:max-w-[460px] lg:justify-self-end lg:pb-3">
          <T data-hero-fade k="hero.subtitle" as="p" className="t-lead text-ink-2" />
          <div data-hero-fade className="flex flex-wrap gap-3">
            <Button to="/start-project" size="lg"><T k="hero.startProject" /></Button>
            <Button to="/#services" variant="secondary" size="lg" arrow={false}><T k="hero.exploreServices" /></Button>
          </div>
        </div>
      </div>

      <div className="shell mt-auto pt-[clamp(40px,6vh,88px)]">
        <Logo ref={mark} variant="lockup" festive={festive} title="XClan" className="h-auto w-full overflow-visible" />
        <div data-hero-fade className="t-small flex items-center justify-between gap-6 py-[clamp(16px,2.6vh,32px)] text-ink-3">
          <Disciplines />
          <span className="hidden items-center gap-2 sm:inline-flex">
            <T k="hero.scroll" />
            <span aria-hidden="true" className="relative block h-7 w-4 rounded-full border-[1.5px] border-current">
              <span className="absolute left-1/2 top-1.5 h-1.5 w-1 -translate-x-1/2 animate-bounce rounded-full bg-current" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

/** The sentence after the hero: words light up as they scroll into place. */
export function Statement() {
  const root = useRef(null);
  const { isEditing } = useCMS();
  const { tr, lang } = useT();
  const text = tr('hero.transitionText');

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    gsap.fromTo(
      root.current.querySelectorAll('.xc-word'),
      { color: 'var(--paper-3)' },
      {
        color: 'var(--ink)',
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
      },
    );
  }, { scope: root, dependencies: [isEditing, lang, text] });

  return (
    <section ref={root} aria-label={tr('hero.aboutXyberclan')} className="shell grid gap-y-6 pb-[var(--section)] pt-[clamp(72px,9vw,150px)] lg:grid-cols-12 lg:gap-x-[var(--gap)]">
      <T k="hero.aboutXyberclan" as="p" className="t-small text-ink-3 lg:col-span-3 lg:pt-4" />
      {isEditing ? (
        <T k="hero.transitionText" as="p" className="t-headline lg:col-span-9" />
      ) : (
        <p className="t-headline lg:col-span-9"><Words text={text} /></p>
      )}
    </section>
  );
}
