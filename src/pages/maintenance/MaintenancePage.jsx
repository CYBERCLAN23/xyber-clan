import { useEffect, useRef, useState } from 'react';
import Meta from '../../components/Meta';
import Logo from '../../brand/Logo';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { isHolidaySeason } from '../../utils/festive';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';
// Layer boxes + pivots produced by scripts/moshi-rig.py from the Moshi render.
import rig from '../../brand/moshi-rig.json';
import './maintenance.css';

const EMAIL = 'xyberclandev@gmail.com';
const WHATSAPP = 'https://wa.me/237654269488';

const COPY = {
  en: {
    meta: 'Under maintenance',
    metaDesc: 'XyberClan is rebuilding xyberclan.dev. Moshi and the crew are on it, back very soon.',
    title: 'We’re under maintenance',
    lead: 'Moshi and the crew are rebuilding xyberclan.dev with fresh tools and far too much enthusiasm. We’ll be back very soon.',
    email: 'Email us',
    whatsapp: 'WhatsApp us',
    statusLead: 'Right now, Moshi is',
    status: [
      'tightening the pixels',
      'arguing with the CSS',
      'sanding the rounded corners',
      'hunting a missing semicolon',
      'teaching the buttons to click',
      'untangling the cables',
      'feeding the servers',
      'nailing the layout, literally',
    ],
    poke: 'Poke Moshi',
    caption: 'Moshi, chief builder. Poke him for moral support.',
    support: (n) => `Moral support received: ${n}. Moshi is touched.`,
    lines: [
      'I’m a professional. Mostly.',
      'Who moved my semicolon?',
      'Measure twice, deploy once.',
      'Almost done. Probably.',
      'This pixel goes… here!',
      'Coffee break? Never heard of it.',
      'Hey! I’m holding a hammer!',
      'Thanks, that helps a lot.',
    ],
    sign: ['BACK', 'SOON'],
    tok: 'tok!',
    ouch: 'ouch!',
    tape: ['Under maintenance', 'Back very soon', 'Hard hats on', 'Moshi at work'],
    langLabel: 'Passer en français',
    langShort: 'FR',
  },
  fr: {
    meta: 'Site en maintenance',
    metaDesc: 'XyberClan reconstruit xyberclan.dev. Moshi et l’équipe sont sur le chantier, retour très bientôt.',
    title: 'Site en maintenance',
    lead: 'Moshi et l’équipe reconstruisent xyberclan.dev avec de nouveaux outils et beaucoup trop d’enthousiasme. On revient très vite.',
    email: 'Écrivez-nous',
    whatsapp: 'WhatsApp',
    statusLead: 'En ce moment, Moshi est en train de',
    status: [
      'resserrer les pixels',
      'se disputer avec le CSS',
      'poncer les coins arrondis',
      'chercher un point-virgule perdu',
      'apprendre aux boutons à cliquer',
      'démêler les câbles',
      'nourrir les serveurs',
      'clouer la mise en page',
    ],
    poke: 'Tapoter Moshi',
    caption: 'Moshi, chef de chantier. Tapotez-le pour le soutenir.',
    support: (n) => `Soutien moral reçu : ${n}. Moshi est ému.`,
    lines: [
      'Je suis un pro. Presque.',
      'Qui a déplacé mon point-virgule ?',
      'Mesurer deux fois, déployer une fois.',
      'Presque fini. Sûrement.',
      'Ce pixel va… ici !',
      'Une pause café ? Connais pas.',
      'Hé ! J’ai un marteau dans la main !',
      'Merci, ça aide beaucoup.',
    ],
    sign: ['BIENTÔT', 'DE RETOUR'],
    tok: 'toc !',
    ouch: 'aïe !',
    tape: ['En maintenance', 'De retour très vite', 'Casques obligatoires', 'Moshi au travail'],
    langLabel: 'Switch to English',
    langShort: 'EN',
  },
};

// Fixed colours inside the drawing (they sit on the mascot, wood or hazard yellow).
const C = {
  cyan: '#22C4D2',
  blue: '#2785B7',
  ink: '#1e1e1e',
  hazard: '#FFB627',
  hazardDeep: '#E39A0C',
  wood: '#C98A4B',
  woodDeep: '#A96B33',
  steel: '#5a6166',
  steelLight: '#8a9296',
};

/* ── Rig geometry ─────────────────────────────────────────────
   The Moshi layers live in the render's pixel space (928 x 1152) and are
   placed in the scene with one scale + offset. Groups that GSAP animates
   carry no transform of their own, so svgOrigin is in scene units. */
const K = 0.56;
const TX = 132;
const TY = 60;
const GROUND = 600;
const MOSHI_T = `translate(${TX} ${TY}) scale(${K})`;
const toScene = (x, y) => [TX + x * K, TY + y * K];
const place = (b) => ({ x: TX + b.x * K, y: TY + b.y * K, width: b.w * K, height: b.h * K });
const rotate = ([x, y], [ox, oy], deg) => {
  const r = (deg * Math.PI) / 180;
  const dx = x - ox;
  const dy = y - oy;
  return [ox + dx * Math.cos(r) - dy * Math.sin(r), oy + dx * Math.sin(r) + dy * Math.cos(r)];
};
const svgO = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;

const ARM_O = toScene(rig.pivots.arm.x, rig.pivots.arm.y);
const FEET_O = toScene(rig.pivots.feet.x, rig.pivots.feet.y);
const HAT_O = toScene(470, 310);
const BOX_O = toScene(702, 652); // where the right hand grips the toolbox handle

// Hammer held in the raised hand (render pixels): grip point + tilt; head drawn at the top.
const GRIP = [156, 470];
const GRIP_TILT = -38;
const STRIKE = -36; // arm angle when the hammer lands on the nail
const BONK = 50; // arm angle when Moshi hits his own hard hat
// Lower face of the hammer head at the moment of the strike = where the nail goes.
const FACE_LOCAL = [-50, -199];
const FACE_RENDER = rotate(FACE_LOCAL, [0, 0], GRIP_TILT).map((v, i) => v + GRIP[i]);
const NAIL = rotate(toScene(FACE_RENDER[0], FACE_RENDER[1]), ARM_O, STRIKE);
const SIGN = { x: NAIL[0] - 34, y: NAIL[1] + 12, w: 132, h: 70 };

/** Zig-zag lattice for the crane, as polyline points. */
const zigzag = (x1, x2, y1, y2, step, vertical) => {
  const pts = [];
  if (vertical) {
    for (let y = y1, i = 0; y <= y2; y += step, i++) pts.push(`${i % 2 ? x2 : x1},${y}`);
  } else {
    for (let x = x1, i = 0; x <= x2; x += step, i++) pts.push(`${x},${i % 2 ? y2 : y1}`);
  }
  return pts.join(' ');
};

function Scene({ c }) {
  return (
    <svg viewBox="0 0 980 640" className="block h-auto w-full overflow-visible" role="img" aria-label={c.title}>
      <defs>
        <radialGradient id="mt-shadow">
          <stop offset="0" stopColor="var(--ink)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--ink)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mt-hat" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#FFE08A" />
          <stop offset="0.45" stopColor={C.hazard} />
          <stop offset="1" stopColor="#E08E00" />
        </linearGradient>
        <linearGradient id="mt-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.steelLight} />
          <stop offset="1" stopColor="#3f4549" />
        </linearGradient>
      </defs>

      {/* ── Crane (lowers a fresh </> block onto the site) ── */}
      <g transform="translate(60 20)">
        <rect x="804" y="570" width="60" height="12" rx="3" fill="var(--ink)" />
        <rect x="820" y="104" width="28" height="470" fill="var(--ink)" />
        <polyline points={zigzag(823, 845, 112, 566, 28, true)} fill="none" stroke="var(--paper)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M820 104 L834 38 L848 104 Z" fill="var(--ink)" />
        <path d="M834 42 L606 94 M834 42 L896 94" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <rect x="600" y="92" width="300" height="16" fill="var(--ink)" />
        <polyline points={zigzag(604, 896, 95, 105, 16, false)} fill="none" stroke="var(--paper)" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="866" y="108" width="32" height="30" rx="3" fill={C.steel} />
        <rect x="796" y="108" width="46" height="40" rx="6" fill={C.hazard} />
        <rect x="802" y="114" width="22" height="18" rx="3" fill="var(--paper)" />
        <rect x="688" y="106" width="24" height="12" rx="3" fill="var(--ink)" />
        <g data-pend>
          <rect data-cable x="698.5" y="116" width="3" height="62" fill="var(--ink)" />
          <g data-load>
            <g transform="translate(0 -90)">
              <path d="M700 266 v8 a8 8 0 1 1 -10 6" fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
              <path d="M700 282 L668 292 M700 282 L732 292" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              <rect x="662" y="290" width="76" height="52" rx="8" fill={C.hazard} />
              <text x="700" y="325" textAnchor="middle" fontSize="24" fontWeight="700" fill={C.ink}>{'</>'}</text>
            </g>
          </g>
        </g>
      </g>

      {/* ── The website under construction ───── */}
      <g transform="translate(372 165) scale(0.75)">
        <g data-window>
          <rect x="360" y="200" width="280" height="380" rx="16" fill="var(--ink)" />
          <rect x="366" y="236" width="268" height="338" rx="10" fill="var(--paper)" />
          <circle cx="380" cy="218" r="5" fill={C.hazard} />
          <circle cx="396" cy="218" r="5" fill={C.cyan} />
          <circle cx="412" cy="218" r="5" fill="var(--paper)" />
          <rect x="430" y="209" width="190" height="18" rx="9" fill="var(--paper)" opacity="0.14" />
          <text x="525" y="222" textAnchor="middle" fontSize="12" fontWeight="500" fill="var(--paper)" opacity="0.85">xyberclan.dev</text>

          <g data-piece>
            <rect x="374" y="248" width="252" height="20" rx="6" fill="var(--paper-3)" />
            <circle cx="386" cy="258" r="5" fill={C.cyan} />
            <rect x="560" y="255" width="54" height="6" rx="3" fill="var(--ink-3)" />
          </g>
          <rect data-piece x="374" y="282" width="204" height="24" rx="6" fill="var(--ink)" />
          <rect data-piece x="374" y="312" width="140" height="24" rx="6" fill="var(--ink)" />
          <g data-piece>
            <rect x="374" y="348" width="252" height="96" rx="10" fill={C.cyan} />
            <circle cx="598" cy="372" r="11" fill={C.hazard} />
            <path d="M374 434 Q420 392 470 420 Q520 446 560 408 Q596 380 626 402 L626 434 Q626 444 616 444 L384 444 Q374 444 374 434 Z" fill={C.blue} />
          </g>
          <rect data-piece x="374" y="456" width="80" height="52" rx="8" fill="var(--paper-3)" />
          <rect data-piece x="460" y="456" width="80" height="52" rx="8" fill="var(--paper-3)" />
          <rect data-piece x="546" y="456" width="80" height="52" rx="8" fill="var(--paper-3)" />
          <g data-piece>
            <rect x="374" y="522" width="96" height="30" rx="15" fill={C.blue} />
            <rect x="486" y="533" width="70" height="8" rx="4" fill="var(--ink-3)" />
          </g>
        </g>
      </g>

      {/* ── Sign Moshi is nailing ───────────── */}
      <g>
        <rect x={SIGN.x + SIGN.w / 2 - 5} y={SIGN.y + SIGN.h - 4} width="10" height={GROUND - SIGN.y - SIGN.h + 4} fill={C.woodDeep} />
        <rect x={SIGN.x} y={SIGN.y} width={SIGN.w} height={SIGN.h} rx="6" fill={C.wood} />
        <rect x={SIGN.x + 6} y={SIGN.y + 6} width={SIGN.w - 12} height={SIGN.h - 12} rx="3" fill={C.hazard} />
        <text x={SIGN.x + SIGN.w / 2} y={SIGN.y + 31} textAnchor="middle" fontSize="15" fontWeight="700" letterSpacing="0.04em" fill={C.ink}>{c.sign[0]}</text>
        <text x={SIGN.x + SIGN.w / 2} y={SIGN.y + 50} textAnchor="middle" fontSize="15" fontWeight="700" letterSpacing="0.04em" fill={C.ink}>{c.sign[1]}</text>
        <g data-nail>
          <rect x={NAIL[0] - 2} y={NAIL[1] + 2} width="4" height="22" rx="1.5" fill={C.steel} />
          <rect x={NAIL[0] - 8} y={NAIL[1]} width="16" height="5" rx="2.5" fill={C.steel} />
        </g>
      </g>

      {/* traffic cone */}
      <g transform={`translate(${SIGN.x + SIGN.w + 4} 0)`}>
        <path d="M8 596 L24 540 L40 596 Z" fill={C.hazard} />
        <path d="M15 572 L33 572 L30 560 L18 560 Z" fill="var(--paper)" />
        <rect x="0" y="592" width="48" height="8" rx="3" fill={C.hazardDeep} />
      </g>

      {/* soft contact shadow (the render's own studio shadow was removed) */}
      <ellipse cx={FEET_O[0]} cy={GROUND + 2} rx="100" ry="11" fill="url(#mt-shadow)" />

      {/* Impact: sparks + sound */}
      <g data-sparks opacity="0">
        <path
          d={`M${NAIL[0]} ${NAIL[1]} l-24 -14 M${NAIL[0]} ${NAIL[1] - 2} l-4 -28 M${NAIL[0] + 4} ${NAIL[1] - 2} l12 -26 M${NAIL[0] + 6} ${NAIL[1] + 2} l26 -10`}
          stroke={C.hazard}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <text data-tok aria-hidden="true" x={NAIL[0] - 14} y={NAIL[1] - 58} textAnchor="middle" fontSize="30" fontWeight="700" fill="var(--ink)" opacity="0">{c.tok}</text>
      <text data-ouch aria-hidden="true" x={HAT_O[0] - 150} y={HAT_O[1] - 70} fontSize="42" fontWeight="700" fill={C.hazardDeep} opacity="0">{c.ouch}</text>

      {/* dust when Moshi lands */}
      <g data-dust opacity="0">
        <circle cx={FEET_O[0] - 110} cy={GROUND - 6} r="12" fill="var(--paper-3)" />
        <circle cx={FEET_O[0] - 130} cy={GROUND - 10} r="8" fill="var(--paper-3)" />
        <circle cx={FEET_O[0] + 60} cy={GROUND - 6} r="12" fill="var(--paper-3)" />
        <circle cx={FEET_O[0] + 80} cy={GROUND - 10} r="8" fill="var(--paper-3)" />
      </g>

      {/* ── Moshi. Layers: body, toolbox, the hand gripping it, hat, hammer arm, vest ── */}
      <g data-poke>
        <g data-hop>
          <image href="/brand/moshi/body.webp" {...place(rig.body)} />

          {/* toolbox hanging from the right hand */}
          <g data-box>
            <g transform={MOSHI_T}>
              <rect x="664" y="662" width="15" height="74" rx="7.5" fill={C.hazard} transform="rotate(-14 671 700)" />
              <rect x="726" y="654" width="11" height="84" rx="5.5" fill={C.steel} transform="rotate(12 731 696)" />
              <circle cx="733" cy="652" r="13" fill="none" stroke={C.steel} strokeWidth="8" />
              <path d="M656 706 V670 Q656 652 674 652 H730 Q748 652 748 670 V706" fill="none" stroke={C.ink} strokeWidth="11" strokeLinecap="round" />
              <rect x="604" y="700" width="196" height="112" rx="16" fill={C.blue} />
              <rect x="604" y="700" width="196" height="30" rx="14" fill="#1f6a93" />
              <rect x="604" y="790" width="196" height="22" rx="11" fill="#1f6a93" opacity="0.6" />
              <rect x="687" y="742" width="30" height="18" rx="5" fill={C.hazard} />
            </g>
          </g>
          <image href="/brand/moshi/hand.webp" {...place(rig.hand)} />

          {/* hard hat */}
          <g data-hat>
            <g transform={MOSHI_T}>
              <g transform="rotate(-4 476 300)">
                <path d="M334 318 C330 196 618 196 616 318 Z" fill="url(#mt-hat)" />
                <rect x="460" y="220" width="30" height="94" rx="15" fill="#FFE3A0" opacity="0.9" />
                <rect x="300" y="304" width="352" height="28" rx="14" fill={C.hazardDeep} />
                <rect x="318" y="306" width="150" height="7" rx="3.5" fill="#FFD37A" opacity="0.7" />
              </g>
            </g>
          </g>

          <path data-sweat d={`M${HAT_O[0] + 92} ${HAT_O[1] + 14} q9 13 0 20 q-9 -7 0 -20 Z`} fill="#8fe3ea" opacity="0" />

          {/* the real arm, pivoting at the shoulder, holding a hammer */}
          <g data-arm>
            <g transform={MOSHI_T}>
              <g transform={`translate(${GRIP[0]} ${GRIP[1]}) rotate(${GRIP_TILT})`}>
                <rect x="-8" y="-190" width="16" height="214" rx="7" fill={C.wood} />
                <rect x="-8" y="-190" width="6" height="214" rx="3" fill={C.woodDeep} opacity="0.5" />
                <rect x="-50" y="-222" width="100" height="46" rx="9" fill="url(#mt-steel)" />
                <rect x="-44" y="-217" width="88" height="8" rx="4" fill="#b3babd" opacity="0.6" />
              </g>
            </g>
            <image href="/brand/moshi/arm.webp" {...place(rig.arm)} />
          </g>
          {/* hi-vis vest (from the rig); its cuff sits over the shoulder joint */}
          <image href="/brand/moshi/vest.webp" {...place(rig.vest)} />
        </g>
      </g>
    </svg>
  );
}

function TapeItem({ word }) {
  return (
    <span>
      {word}
      <svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1.5" y="1.5" width="7" height="7" transform="rotate(45 5 5)" fill="currentColor" /></svg>
    </span>
  );
}

function Tape({ words, variant }) {
  const run = [...words, ...words, ...words];
  return (
    <div className={`mt-tape mt-tape--${variant}`}>
      <div className="mt-track">
        {run.map((w, i) => <TapeItem key={`a${i}`} word={w} />)}
        {run.map((w, i) => <TapeItem key={`b${i}`} word={w} />)}
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  const { language, toggleLanguage } = useLanguage();
  const c = COPY[language] || COPY.en;
  const root = useRef(null);
  const [statusIdx, setStatusIdx] = useState(0);
  const [bubble, setBubble] = useState({ show: false, idx: 0 });
  const [pokes, setPokes] = useState(0);
  const hideTimer = useRef(0);

  // Status ticker
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % COPY.en.status.length), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  useGSAP(() => {
    if (reducedMotion()) return;
    const q = (s) => root.current.querySelector(s);
    const qa = (s) => root.current.querySelectorAll(s);
    const arm = q('[data-arm]');
    const hat = q('[data-hat]');
    const hop = q('[data-hop]');
    const all = q('[data-poke]');
    const box = q('[data-box]');
    const boxO = svgO(BOX_O);
    const parts = qa('[data-piece]');
    const armO = svgO(ARM_O);
    const feetO = svgO(FEET_O);

    // Entrance: copy rises, Moshi drops in hard-hat first.
    gsap.timeline({ defaults: { ease: EASE.out } })
      .from(qa('[data-rise]'), { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.1)
      .from(q('[data-panel]'), { y: 30, autoAlpha: 0, duration: 1 }, 0.15)
      .from(all, { y: -520, duration: 1.15, ease: 'bounce.out' }, 0.45)
      .fromTo(q('[data-dust]'), { opacity: 0.9, scale: 0.4, svgOrigin: feetO }, { opacity: 0, scale: 1.6, duration: 0.7, immediateRender: false }, 1.05)
      .from(qa('.mt-tape'), { xPercent: -30, autoAlpha: 0, duration: 1.1, stagger: 0.12 }, 0.3);

    // Idle: Moshi breathes, the toolbox sways from his hand.
    gsap.to(hop, { scaleY: 1.018, scaleX: 0.992, svgOrigin: feetO, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.fromTo(box, { rotation: -3, svgOrigin: boxO }, { rotation: 3, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    // Hammer loop: three good hits on the nail, then one right on his own hard hat.
    const sparks = q('[data-sparks]');
    const tok = q('[data-tok]');
    const ouch = q('[data-ouch]');
    const nail = q('[data-nail]');
    const sweat = q('[data-sweat]');
    gsap.set(arm, { rotation: 0, svgOrigin: armO });

    const ham = gsap.timeline({ repeat: -1, delay: 1.8, repeatDelay: 0.4 });
    for (let i = 0; i < 3; i++) {
      ham
        .to(arm, { rotation: 16, duration: 0.32, ease: 'power2.out' })
        .to(arm, { rotation: STRIKE, duration: 0.14, ease: 'power3.in' })
        .addLabel(`hit${i}`)
        .fromTo(sparks, { opacity: 1, scale: 0.4, svgOrigin: svgO(NAIL) }, { opacity: 0, scale: 1.35, duration: 0.38, ease: 'power2.out', immediateRender: false }, `hit${i}`)
        .to(arm, { rotation: STRIKE + 7, duration: 0.09, ease: 'power1.out' }, `hit${i}`)
        .to(nail, { y: 4 * (i + 1), duration: 0.06, ease: 'power3.out' }, `hit${i}`)
        .fromTo(tok, { opacity: 1, scale: 0.3, y: 0, svgOrigin: svgO([NAIL[0] - 14, NAIL[1] - 66]) }, { scale: 1, y: -16, duration: 0.34, ease: 'back.out(3)', immediateRender: false }, `hit${i}`)
        .to(tok, { opacity: 0, duration: 0.2 }, `hit${i}+=0.3`)
        .to(arm, { rotation: 0, duration: 0.34, ease: EASE.out });
    }
    ham
      .to(arm, { rotation: -14, duration: 0.3, ease: 'power2.out' })
      .to(arm, { rotation: BONK, duration: 0.16, ease: 'power3.in' })
      .addLabel('bonk')
      .to(hat, { y: -70, x: 26, rotation: 28, svgOrigin: svgO(HAT_O), duration: 0.28, ease: 'power2.out' }, 'bonk')
      .to(hat, { y: 0, x: 0, rotation: 0, duration: 0.7, ease: 'bounce.out' }, 'bonk+=0.28')
      .to(all, { y: -46, rotation: -4, svgOrigin: feetO, duration: 0.24, ease: 'power2.out' }, 'bonk')
      .to(all, { y: 0, rotation: 0, duration: 0.6, ease: 'bounce.out' }, 'bonk+=0.24')
      .fromTo(ouch, { opacity: 1, scale: 0.3, rotation: -12, svgOrigin: svgO([HAT_O[0] - 100, HAT_O[1] - 80]) }, { scale: 1.1, rotation: 6, duration: 0.4, ease: 'back.out(3)', immediateRender: false }, 'bonk')
      .to(ouch, { opacity: 0, y: -16, duration: 0.3 }, 'bonk+=0.9')
      .fromTo(sweat, { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: 24, y: -28, duration: 0.7, ease: 'power2.out', immediateRender: false }, 'bonk+=0.05')
      .to(arm, { rotation: 0, duration: 0.6, ease: EASE.out }, 'bonk+=0.5')
      .to(nail, { y: 0, duration: 0.3, ease: 'back.out(2)' }, 'bonk+=1')
      .to({}, { duration: 0.5 });

    // The site builds itself piece by piece, wobbles, collapses, and starts again.
    const win = q('[data-window]');
    gsap.set(parts, { scale: 0, transformOrigin: '50% 50%' });
    gsap.timeline({ repeat: -1, delay: 1.1, repeatDelay: 0.3 })
      .to(parts, { scale: 1, duration: 0.55, ease: 'back.out(2.4)', stagger: 0.42 })
      .to(win, { rotation: 1.6, transformOrigin: '50% 100%', duration: 0.07, ease: 'sine.inOut', yoyo: true, repeat: 9 }, '+=1.8')
      .to(win, { rotation: 0, duration: 0.12 })
      .to(parts, {
        y: 330,
        rotation: () => gsap.utils.random(-80, 80),
        opacity: 0,
        duration: 0.85,
        ease: 'power2.in',
        stagger: { each: 0.05, from: 'random' },
      })
      .set(parts, { y: 0, rotation: 0, opacity: 1, scale: 0 }, '+=0.2');

    // Crane: the load swings and is lowered toward the site.
    const pend = q('[data-pend]');
    gsap.set(pend, { rotation: -5, transformOrigin: '50% 0%' });
    gsap.to(pend, { rotation: 5, duration: 2.3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to(q('[data-cable]'), { attr: { height: 100 }, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to(q('[data-load]'), { y: 38, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }, { scope: root });

  const poke = () => {
    setPokes((n) => n + 1);
    setBubble((b) => {
      let idx = Math.floor(Math.random() * c.lines.length);
      if (idx === b.idx) idx = (idx + 1) % c.lines.length;
      return { show: true, idx };
    });
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setBubble((b) => ({ ...b, show: false })), 2600);

    if (reducedMotion()) return;
    const g = root.current.querySelector('[data-poke]');
    const hat = root.current.querySelector('[data-hat]');
    gsap.timeline()
      .to(g, { y: -48, scaleY: 1.06, scaleX: 0.95, svgOrigin: svgO(FEET_O), duration: 0.2, ease: 'power2.out', overwrite: true })
      .to(g, { y: 0, scaleY: 1, scaleX: 1, duration: 0.6, ease: 'bounce.out' });
    gsap.timeline()
      .to(hat, { y: -50, rotation: -16, svgOrigin: svgO(HAT_O), duration: 0.26, ease: 'power2.out', overwrite: 'auto' })
      .to(hat, { y: 0, rotation: 0, duration: 0.5, ease: 'bounce.out' });
  };

  return (
    <main ref={root} className="mt relative flex min-h-[100svh] flex-col overflow-hidden bg-paper text-ink">
      <Meta title={c.meta} description={c.metaDesc} />

      <header className="shell flex h-[var(--nav-h)] items-center justify-between" data-rise>
        <Logo variant="lockup" festive={isHolidaySeason()} className="h-8 w-auto md:h-9" />
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={c.langLabel}
          className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-paper-2 px-4 text-[0.95rem] font-medium transition-[background-color,transform] duration-300 ease-[var(--ease-out)] hover:bg-paper-3 active:scale-95"
        >
          {c.langShort}
        </button>
      </header>

      <section className="shell grid flex-1 items-center gap-y-10 pt-6 lg:grid-cols-12 lg:gap-x-[var(--gap)] lg:pt-0">
        <div className="lg:col-span-5">
          <h1 data-rise className="text-[clamp(2.6rem,5.2vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            {c.title}
          </h1>
          <p data-rise className="t-lead mt-6 max-w-[34rem] text-ink">
            {c.lead}
          </p>
          <div data-rise className="mt-9 flex flex-wrap gap-3">
            <Button href={`mailto:${EMAIL}?subject=${encodeURIComponent('Hello XyberClan')}`} size="lg">{c.email}</Button>
            <Button href={WHATSAPP} variant="secondary" size="lg" arrow={false}>{c.whatsapp}</Button>
          </div>
          <p data-rise className="mt-9 flex max-w-[34rem] items-center gap-3 text-[1.05rem] leading-snug text-ink-2">
            <span className="mt-live" aria-hidden="true" />
            <span>
              {c.statusLead}{' '}
              <span key={`${language}-${statusIdx}`} className="mt-ticker-word font-medium text-ink">
                {c.status[statusIdx % c.status.length]}
              </span>
              .
            </span>
          </p>
        </div>

        <figure className="m-0 lg:col-span-7">
          <div data-panel className="relative">
            <Scene c={c} />
            <button type="button" className="mt-poke" onClick={poke} aria-label={c.poke} />
            <div className="mt-bubble" data-show={bubble.show} aria-live="polite">
              {bubble.show ? c.lines[bubble.idx % c.lines.length] : ''}
            </div>
          </div>
          <figcaption className="mt-4 text-[0.98rem] text-ink-2">
            {pokes > 0 ? c.support(pokes) : c.caption}
          </figcaption>
        </figure>
      </section>

      <div className="mt-tapes mt-6" aria-hidden="true">
        <Tape words={c.tape} variant="b" />
        <Tape words={c.tape} variant="a" />
      </div>
    </main>
  );
}
