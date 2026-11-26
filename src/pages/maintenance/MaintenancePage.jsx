import { useEffect, useRef, useState } from 'react';
import Logo from '../../brand/Logo';
// Layer boxes + pivots cut by scripts/maintenance-rig.py from the Frame 64 renders.
import rig from './rig.json';
import './maintenance.css';

/*
 * Maintenance page (Frame 64 design).
 *
 * Built for slow networks: this exact markup is pre-rendered into index.html at
 * build time (scripts/prerender-maintenance.mjs), so it paints from the first
 * HTML response with no JavaScript, no loader and no entrance effect. Both
 * languages are in the markup and CSS shows the one on <html lang>, so a French
 * visitor never sees English first. All motion is pure CSS on the rig's layers:
 * Moshi hammers and blinks, the sign swings, the page in the window rearranges.
 */

const EMAIL = 'xyberclandev@gmail.com';
const WHATSAPP = 'https://wa.me/237654269488';
const IMG = '/brand/maintenance';

const COPY = {
  en: {
    meta: 'Under maintenance',
    titleA: 'We’re under',
    titleB: 'maintenance',
    lead: 'Moshi and the crew are rebuilding xyberclan.dev with fresh tools and far too much enthusiasm. We’ll be back very soon.',
    email: 'Email us',
    whatsapp: 'WhatsApp us',
    lang: 'FR',
    langLabel: 'Passer en français',
    moshi: 'Moshi, the XyberClan mascot, in a hard hat with a hammer and a toolbox. Poke him.',
    lines: [
      'I’m a professional. Mostly.',
      'Who moved my semicolon?',
      'Measure twice, deploy once.',
      'Almost done. Probably.',
      'Hey! I’m holding a hammer!',
      'Thanks, that helps a lot.',
    ],
  },
  fr: {
    meta: 'Site en maintenance',
    titleA: 'Site en',
    titleB: 'maintenance',
    lead: 'Moshi et l’équipe reconstruisent xyberclan.dev avec de nouveaux outils et beaucoup trop d’enthousiasme. On revient très vite.',
    email: 'Écrivez-nous',
    whatsapp: 'WhatsApp',
    lang: 'EN',
    langLabel: 'Switch to English',
    moshi: 'Moshi, la mascotte de XyberClan, avec un casque, un marteau et une caisse à outils. Tapotez-le.',
    lines: [
      'Je suis un pro. Presque.',
      'Qui a déplacé mon point-virgule ?',
      'Mesurer deux fois, déployer une fois.',
      'Presque fini. Sûrement.',
      'Hé ! J’ai un marteau !',
      'Merci, ça aide beaucoup.',
    ],
  },
};

/** Both languages in the markup; CSS shows the one matching <html lang>. */
const L = ({ k }) => (
  <>
    <span data-l="en">{COPY.en[k]}</span>
    <span data-l="fr">{COPY.fr[k]}</span>
  </>
);

const V = rig.version;
const LAYERS = rig.layers;
const srcSet = (name, ext) => LAYERS[name].widths.map((w) => `${IMG}/${name}-${V}-${w}.${ext} ${w}w`).join(', ');

/** One rig layer: AVIF with a WebP fallback, sized per viewport so phones fetch small files. */
function Art({ name, sizes, priority = false, className, style }) {
  const { widths, box } = LAYERS[name];
  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={srcSet(name, 'avif')} sizes={sizes} />
      <img
        src={`${IMG}/${name}-${V}-${widths[widths.length - 1]}.webp`}
        srcSet={srcSet(name, 'webp')}
        sizes={sizes}
        width={box[2]}
        height={box[3]}
        alt=""
        decoding="async"
        fetchpriority={priority ? 'high' : undefined}
        draggable="false"
      />
    </picture>
  );
}

// ── Geometry, all from the rig ────────────────────────────────────────
// Each render maps onto the design frame (Frame 64); the scene is a window on
// that frame, so the whole thing scales as one piece.
const SCENE = { x: 1060, y: 70, w: 1290, h: 770 };
const pct = (v) => `${(v * 100).toFixed(3)}%`;
const toFrame = (name) => {
  const { group, box: [x, y, w, h] } = LAYERS[name];
  const P = rig.placement[group];
  return { x: P.x + x * P.sx, y: P.y + y * P.sy, w: w * P.sx, h: h * P.sy };
};
const inScene = (name) => {
  const b = toFrame(name);
  return { left: pct((b.x - SCENE.x) / SCENE.w), top: pct((b.y - SCENE.y) / SCENE.h), width: pct(b.w / SCENE.w), height: pct(b.h / SCENE.h) };
};
/** A layer placed inside another layer of the same render (Moshi's parts inside his body box). */
const inLayer = (name, parent) => {
  const [x, y, w, h] = LAYERS[name].box;
  const [px, py, pw, ph] = LAYERS[parent].box;
  return { left: pct((x - px) / pw), top: pct((y - py) / ph), width: pct(w / pw), height: pct(h / ph) };
};
const pivot = (name) => {
  const { box: [x, y, w, h], pivot: [vx, vy] } = LAYERS[name];
  return `${pct((vx - x) / w)} ${pct((vy - y) / h)}`;
};
const withPivot = (style, name) => ({ ...style, transformOrigin: pivot(name) });

// Where the hammer's face lands at the bottom of the strike (−12° at the shoulder).
const STRIKE = -12;
const FACE = [185, 163];
const SPARK = (() => {
  const [ox, oy] = LAYERS['moshi-arm'].pivot;
  const t = (STRIKE * Math.PI) / 180;
  const dx = FACE[0] - ox;
  const dy = FACE[1] - oy;
  const x = ox + dx * Math.cos(t) - dy * Math.sin(t);
  const y = oy + dx * Math.sin(t) + dy * Math.cos(t);
  const [bx, by, bw, bh] = LAYERS['moshi-body'].box;
  return { left: pct((x - bx) / bw), top: pct((y - by) / bh) };
})();

/** `sizes` for a layer: its share of the scene, which is ≈55vw wide on desktop and ≈90vw on phones. */
const sizesFor = (name) => {
  const share = toFrame(name).w / SCENE.w;
  return `(min-width: 960px) ${(55 * share).toFixed(1)}vw, ${(90 * share).toFixed(1)}vw`;
};

const MOSHI = inScene('moshi-body');
const ARM = withPivot(inLayer('moshi-arm', 'moshi-body'), 'moshi-arm');
const EYE_L = withPivot(inLayer('moshi-eye-l', 'moshi-body'), 'moshi-eye-l');
const EYE_R = withPivot(inLayer('moshi-eye-r', 'moshi-body'), 'moshi-eye-r');
const CRANE = inScene('crane');
const SIGN = withPivot(inScene('crane-sign'), 'crane-sign');
const PAGE_BLOCKS = ['hero', 'sun', 'bar1', 'bar2', 'card1', 'card2', 'card3', 'button', 'small'];
const BUBBLE = { left: pct((1290 - SCENE.x) / SCENE.w), top: pct((215 - SCENE.y) / SCENE.h) };

export default function MaintenancePage() {
  // Starts as 'en' on the server and on the first client render (identical
  // markup for hydration); the visible language is already handled by CSS.
  const [lang, setLang] = useState('en');
  const [bubble, setBubble] = useState({ on: false, i: 0 });
  const moshiRef = useRef(null);
  const timer = useRef(0);
  const c = COPY[lang];

  useEffect(() => {
    setLang(document.documentElement.lang === 'fr' ? 'fr' : 'en');
    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    document.title = `${c.meta} | XyberClan`;
  }, [c.meta]);

  const toggleLang = () => {
    const next = lang === 'en' ? 'fr' : 'en';
    document.documentElement.lang = next;
    try { localStorage.setItem('xyber_lang', next); } catch { /* private mode */ }
    setLang(next);
  };

  const poke = () => {
    const el = moshiRef.current;
    if (el) {
      el.classList.remove('is-poked');
      void el.offsetWidth; // restart the hop
      el.classList.add('is-poked');
    }
    setBubble((b) => ({ on: true, i: (b.i + 1 + Math.floor(Math.random() * (c.lines.length - 1))) % c.lines.length }));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setBubble((b) => ({ ...b, on: false })), 2400);
  };

  return (
    <div className="mt" data-mt-root>
      <header className="mt-top">
        <a href="/" className="mt-logo" aria-label="XyberClan">
          <Logo variant="lockup" decorative />
        </a>
        <button type="button" className="mt-lang" onClick={toggleLang} aria-label={c.langLabel}>
          <L k="lang" />
        </button>
      </header>

      <main id="main" className="mt-hero">
        <div className="mt-copy">
          <h1 className="mt-title">
            <span className="mt-title-a"><L k="titleA" /></span>
            <span className="mt-title-b"><L k="titleB" /></span>
          </h1>
          <p className="mt-lead"><L k="lead" /></p>
          <div className="mt-actions">
            <a className="mt-btn mt-btn-primary" href={`mailto:${EMAIL}?subject=${encodeURIComponent('Hello XyberClan')}`}>
              <L k="email" />
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4.5-5L15 10l-4.5 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <a className="mt-btn mt-btn-ghost" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <L k="whatsapp" />
            </a>
          </div>
        </div>

        <div className="mt-scene">
          <Art name="crane" sizes={sizesFor('crane')} className="mt-crane" style={CRANE} />
          {PAGE_BLOCKS.map((k) => (
            <Art key={k} name={`win-${k}`} sizes={sizesFor(`win-${k}`)} className={`mt-win mt-win-${k}`} style={inScene(`win-${k}`)} />
          ))}
          <Art name="crane-sign" sizes={sizesFor('crane-sign')} className="mt-sign" style={SIGN} />
          <button ref={moshiRef} type="button" className="mt-moshi" style={MOSHI} onClick={poke} onAnimationEnd={(e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('is-poked'); }} aria-label={c.moshi}>
            <span className="mt-rig">
              <Art name="moshi-body" sizes={sizesFor('moshi-body')} priority className="mt-body" />
              <Art name="moshi-eye-l" sizes={sizesFor('moshi-eye-l')} className="mt-eye" style={EYE_L} />
              <Art name="moshi-eye-r" sizes={sizesFor('moshi-eye-r')} className="mt-eye" style={EYE_R} />
              <Art name="moshi-arm" sizes={sizesFor('moshi-arm')} className="mt-arm" style={ARM} />
              <svg className="mt-spark" style={SPARK} viewBox="-40 -40 80 80" aria-hidden="true">
                <path d="M-12 0H-34M-9-9-25-23M-9 9-25 23M0-12V-30M0 12V30" />
              </svg>
            </span>
          </button>
          <p className={`mt-bubble${bubble.on ? ' is-on' : ''}`} style={BUBBLE} aria-live="polite">
            {bubble.on ? c.lines[bubble.i] : ''}
          </p>
        </div>
      </main>

      <div className="mt-tapes" aria-hidden="true">
        <div className="mt-tapes-in">
          <Art name="tape" sizes="(min-width: 1300px) 77vw, 1000px" className="mt-tape mt-tape-1" />
          <Art name="tape" sizes="(min-width: 1300px) 77vw, 1000px" className="mt-tape mt-tape-2" />
        </div>
      </div>
    </div>
  );
}
