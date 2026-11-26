import { useEffect, useRef, useState } from 'react';
import Logo from '../../brand/Logo';
import './maintenance.css';

/*
 * Maintenance page (Frame 64 design).
 *
 * Built for slow networks: this exact markup is pre-rendered into index.html at
 * build time (scripts/prerender-maintenance.mjs), so it paints from the first
 * HTML response with no JavaScript, no loader and no entrance effect. Both
 * languages are in the markup and CSS shows the one on <html lang>, so a French
 * visitor never sees English first. Idle motion is pure CSS.
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

const srcSet = (name, widths, ext) => widths.map((w) => `${IMG}/${name}-v1-${w}.${ext} ${w}w`).join(', ');

/** AVIF with a WebP fallback, sized per viewport so phones fetch small files. */
function Art({ name, widths, sizes, size, alt = '', priority = false, className, style }) {
  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={srcSet(name, widths, 'avif')} sizes={sizes} />
      <img
        src={`${IMG}/${name}-v1-${widths[widths.length - 1]}.webp`}
        srcSet={srcSet(name, widths, 'webp')}
        sizes={sizes}
        width={size[0]}
        height={size[1]}
        alt={alt}
        decoding="async"
        fetchpriority={priority ? 'high' : undefined}
        draggable="false"
      />
    </picture>
  );
}

// Scene layout in the design frame's coordinates (Frame 64), as percentages of
// the scene box, so it scales as one piece.
const SCENE = { x: 1060, y: 70, w: 1290, h: 770 };
const pct = (v) => `${(v * 100).toFixed(3)}%`;
const box = (b) => ({
  left: pct((b.x - SCENE.x) / SCENE.w),
  top: pct((b.y - SCENE.y) / SCENE.h),
  width: pct(b.w / SCENE.w),
  height: pct(b.h / SCENE.h),
});
const MOSHI = box({ x: 1075.4, y: 225.5, w: 485.7, h: 554.7 });
const CRANE = box({ x: 1628.8, y: 81.4, w: 697.6, h: 746.5 });
const SIGN = box({ x: 1874.6, y: 221.3, w: 175.2, h: 183.8 });
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
          <Art name="crane" widths={[420, 700, 1127]} size={[1127, 1206]} sizes="(min-width: 960px) 30vw, 58vw" className="mt-crane" style={CRANE} />
          <Art name="crane-sign" widths={[283]} size={[283, 297]} sizes="160px" className="mt-sign" style={SIGN} />
          <button ref={moshiRef} type="button" className="mt-moshi" style={MOSHI} onClick={poke} onAnimationEnd={(e) => e.currentTarget.classList.remove('is-poked')} aria-label={c.moshi}>
            <Art name="moshi-builder" widths={[360, 560, 800, 1036]} size={[1036, 1182]} sizes="(min-width: 960px) 22vw, 40vw" priority />
          </button>
          <p className={`mt-bubble${bubble.on ? ' is-on' : ''}`} style={BUBBLE} aria-live="polite">
            {bubble.on ? c.lines[bubble.i] : ''}
          </p>
        </div>
      </main>

      <div className="mt-tapes" aria-hidden="true">
        <div className="mt-tapes-in">
          <Art name="tape" widths={[900, 1400, 1774]} size={[1774, 493]} sizes="(min-width: 1300px) 77vw, 1000px" className="mt-tape mt-tape-1" />
          <Art name="tape" widths={[900, 1400, 1774]} size={[1774, 493]} sizes="(min-width: 1300px) 77vw, 1000px" className="mt-tape mt-tape-2" />
        </div>
      </div>
    </div>
  );
}
