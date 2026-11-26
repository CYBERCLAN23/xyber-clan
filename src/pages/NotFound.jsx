import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';
import Logo from '../brand/Logo';
import { T, useT } from '../lib/content';
import { DIGITS } from '../brand/notfound-digits';
import { gsap, useGSAP, EASE, reducedMotion, finePointer } from '../lib/motion';
import './notfound.css';

const COPY = {
  en: {
    meta: 'Page not found',
    titleA: 'Page Not',
    titleB: 'Found',
    quip: 'Seriously guy, where are you going?',
    home: 'Go home',
  },
  fr: {
    meta: 'Page introuvable',
    titleA: 'Page',
    titleB: 'introuvable',
    quip: 'Sérieusement, tu vas où comme ça ?',
    home: 'Accueil',
  },
};

// Everything below is placed in the design frame's own coordinates (Frame 57),
// so the scene matches the approved layout exactly at any size.
const VIEW = '430 140 785 540';
const MOSHI = { x: 573.5, y: 254.9, width: 410, height: 406.1 };
const SCRIBBLE = { x: 905.6, y: 151.2, width: 118.3, height: 123.9 };
const SEAT = [790, 660]; // where Moshi sits: squash and lean pivot
const TAIL = [940, 272]; // where the scribble hangs from his head: it sways from here
const KNOT = [966, 206]; // the scribble's own centre: it spins around here
const TOE = [1140, 501]; // the foot of the last 4: it leans from here

/**
 * A transform driven by plain numbers with a fixed pivot in scene coordinates.
 * GSAP tweens `st`; the ticker writes the attribute. This keeps the pivots
 * exact on <image> layers, where svgOrigin drifts by the layer's own offset.
 */
function rig(el, [cx, cy]) {
  const st = { x: 0, y: 0, r: 0, s: 1, sx: 1, sy: 1 };
  const write = () => {
    el.setAttribute(
      'transform',
      `translate(${st.x} ${st.y}) rotate(${st.r} ${cx} ${cy}) translate(${cx} ${cy}) scale(${st.s * st.sx} ${st.s * st.sy}) translate(${-cx} ${-cy})`,
    );
  };
  return { st, write, reset: () => el.removeAttribute('transform') };
}

export default function NotFound() {
  const root = useRef(null);
  const { lang, tr, isEditing } = useT();
  const c = COPY[lang] || COPY.en;

  useGSAP(() => {
    if (isEditing || reducedMotion()) return undefined;
    const q = gsap.utils.selector(root);
    const [moshiEl] = q('[data-nf="moshi"]');
    const moshi = rig(moshiEl, SEAT);
    const sit = rig(q('[data-nf="sit"]')[0], SEAT);
    const sway = rig(q('[data-nf="sway"]')[0], TAIL);
    const scribble = rig(q('[data-nf="scribble"]')[0], KNOT);
    const four = rig(q('[data-nf="four-end"]')[0], TOE);
    const rigs = [moshi, sit, sway, scribble, four];
    const tick = () => rigs.forEach((r) => r.write());
    gsap.ticker.add(tick);

    // On a first visit the site preloader covers the page; start once its curtain lifts.
    const at = window.__xcIntroPlaying ? 2.6 : 0.15;

    // Entrance: the digits come up, Moshi plops down, his thought tangles in.
    gsap.timeline({ delay: at, defaults: { ease: EASE.out } })
      .from(q('[data-nf="digit"]'), { y: 70, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0)
      .from(moshi.st, { y: -260, duration: 0.55, ease: 'power3.in' }, 0.3)
      .fromTo(sit.st, { sy: 0.86, sx: 1.08 }, { sy: 1, sx: 1, duration: 0.9, ease: 'elastic.out(1, 0.4)', immediateRender: false }, 0.85)
      .from(scribble.st, { s: 0, r: -200, duration: 0.9, ease: 'back.out(1.8)' }, 1.15)
      .from(q('[data-nf="fade"]'), { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.55);

    // Idle: he breathes, the thought keeps knotting, the last 4 leans away from him.
    gsap.to(sit.st, { sy: 1.018, sx: 0.992, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: at + 2 });
    gsap.to(sway.st, { r: 7, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: at + 2 });
    gsap.timeline({ repeat: -1, repeatDelay: 3.2, delay: at + 4 })
      .to(scribble.st, { s: 1.14, duration: 0.18, ease: 'power2.out' })
      .to(scribble.st, { r: '+=360', duration: 0.7, ease: 'power3.inOut' }, '<')
      .to(scribble.st, { s: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    gsap.timeline({ repeat: -1, repeatDelay: 5.5, delay: at + 6 })
      .to(four.st, { r: 6, x: 10, duration: 0.5, ease: 'power2.out' })
      .to(four.st, { r: 0, x: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)' }, '+=0.9');

    // He leans a little toward the pointer, and hops when poked.
    let unbind = () => {};
    if (finePointer()) {
      const lean = gsap.quickTo(moshi.st, 'r', { duration: 0.9, ease: 'power3.out' });
      const move = (e) => {
        const r = moshiEl.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        lean(Math.max(-1, Math.min(1, dx * 2)) * 3.5);
      };
      window.addEventListener('pointermove', move, { passive: true });
      unbind = () => window.removeEventListener('pointermove', move);
    }
    let busy = false;
    const poke = () => {
      if (busy) return;
      busy = true;
      gsap.timeline({ onComplete: () => { busy = false; } })
        .to(sit.st, { sy: 0.88, sx: 1.07, duration: 0.12, ease: 'power2.out' })
        .to(sit.st, { sy: 1, sx: 1, y: -70, duration: 0.3, ease: 'power2.out' })
        .to(sway.st, { y: -70, duration: 0.3, ease: 'power2.out' }, '<')
        .to(scribble.st, { r: '+=720', duration: 0.9, ease: 'power3.out' }, '<')
        .to([sit.st, sway.st], { y: 0, duration: 0.6, ease: 'bounce.out' }, '-=0.35');
    };
    moshiEl.addEventListener('click', poke);
    return () => {
      unbind();
      moshiEl.removeEventListener('click', poke);
      gsap.ticker.remove(tick);
      rigs.forEach((r) => r.reset());
    };
  }, { scope: root, dependencies: [isEditing] });

  return (
    <>
      <Meta title={tr('notFound.meta', c.meta)} description={c.quip} />
      <main
        id="main"
        ref={root}
        tabIndex={-1}
        className="flex min-h-[100svh] flex-col items-center overflow-hidden px-4 pb-6 pt-[clamp(20px,5vh,72px)] text-center outline-none"
      >
        <div className="flex flex-1 flex-col items-center justify-center">
        <svg
          viewBox={VIEW}
          role="img"
          aria-label="404"
          className="nf-scene h-auto w-[min(760px,94vw,calc((100svh-430px)*1.45))] min-w-[280px] overflow-visible"
        >
          <path data-nf="digit" d={DIGITS.four} fill="var(--ink)" fillOpacity="0.81" />
          <path data-nf="digit" d={DIGITS.zero} fill="var(--ink)" fillOpacity="0.81" />
          <g data-nf="digit">
            <path data-nf="four-end" d={DIGITS.fourEnd} fill="#279ACA" fillOpacity="0.86" />
          </g>
          <g data-nf="moshi" className="cursor-pointer">
            <g data-nf="sit"><image href="/brand/moshi404/moshi-sit.webp" {...MOSHI} /></g>
            <g data-nf="sway">
              <g data-nf="scribble"><image href="/brand/moshi404/moshi-scribble.webp" {...SCRIBBLE} /></g>
            </g>
          </g>
        </svg>

        <h1 data-nf="fade" className="nf-title mt-[clamp(8px,2.5vh,32px)]">
          <T k="notFound.titleA" fb={c.titleA} />{' '}
          <T k="notFound.titleB" fb={c.titleB} className="text-[#56C1EE]" />
        </h1>
        <T data-nf="fade" k="notFound.quip" fb={c.quip} as="p" className="nf-quip mt-[clamp(10px,2vh,22px)] text-ink-2" />

        <div data-nf="fade" className="mt-[clamp(24px,4.5vh,48px)]">
          <Link to="/" className="nf-home">
            <T k="notFound.home" fb={c.home} />
          </Link>
        </div>
        </div>

        <Link to="/" data-nf="fade" aria-label="XyberClan home" className="pt-[clamp(28px,5vh,56px)]">
          <Logo variant="lockup" decorative className="h-auto w-[clamp(120px,12vw,168px)]" />
        </Link>
      </main>
    </>
  );
}
