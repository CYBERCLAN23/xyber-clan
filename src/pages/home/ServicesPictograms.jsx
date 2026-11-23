import { forwardRef, useId } from 'react';
import { G } from '../../brand/geometry';

/*
 * The five pieces of the mark (two ink pill strokes, the spark, the cyan body,
 * the blue head) rearranged into one pictogram per service. Everything lives
 * in a 1000 x 1000 stage. Ink pieces are stroked paths with round caps (a pill
 * is a line with a round cap), the spark and the body are filled paths, the
 * head is an ellipse with a ring in the colour of the ground.
 */

const K = 0.5523;
const f = (n) => Math.round(n * 10) / 10;

/** Capsule from p1 to p2 with half-thickness r, drawn with cubic quarter arcs. */
function pill([x1, y1], [x2, y2], r) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const nx = -uy;
  const ny = ux;
  const P = (x, y) => `${f(x)} ${f(y)}`;
  const a = [x1 + nx * r, y1 + ny * r];
  const b = [x2 + nx * r, y2 + ny * r];
  const c = [x2 + ux * r, y2 + uy * r];
  const d = [x2 - nx * r, y2 - ny * r];
  const e = [x1 - nx * r, y1 - ny * r];
  const g = [x1 - ux * r, y1 - uy * r];
  const k = r * K;
  return [
    `M${P(...a)}`,
    `L${P(...b)}`,
    `C${P(b[0] + ux * k, b[1] + uy * k)} ${P(c[0] + nx * k, c[1] + ny * k)} ${P(...c)}`,
    `C${P(c[0] - nx * k, c[1] - ny * k)} ${P(d[0] + ux * k, d[1] + uy * k)} ${P(...d)}`,
    `L${P(...e)}`,
    `C${P(e[0] - ux * k, e[1] - uy * k)} ${P(g[0] - nx * k, g[1] - ny * k)} ${P(...g)}`,
    `C${P(g[0] + nx * k, g[1] + ny * k)} ${P(a[0] - ux * k, a[1] - uy * k)} ${P(...a)}Z`,
  ].join(' ');
}

/** Rounded rectangle as one closed cubic path (clockwise from the top-left). */
function rrect(x, y, w, h, r) {
  const k = r * K;
  const R = x + w;
  const B = y + h;
  return [
    `M${f(x + r)} ${f(y)}`,
    `L${f(R - r)} ${f(y)}`,
    `C${f(R - r + k)} ${f(y)} ${f(R)} ${f(y + r - k)} ${f(R)} ${f(y + r)}`,
    `L${f(R)} ${f(B - r)}`,
    `C${f(R)} ${f(B - r + k)} ${f(R - r + k)} ${f(B)} ${f(R - r)} ${f(B)}`,
    `L${f(x + r)} ${f(B)}`,
    `C${f(x + r - k)} ${f(B)} ${f(x)} ${f(B - r + k)} ${f(x)} ${f(B - r)}`,
    `L${f(x)} ${f(y + r)}`,
    `C${f(x)} ${f(y + r - k)} ${f(x + r - k)} ${f(y)} ${f(x + r)} ${f(y)}Z`,
  ].join(' ');
}

const line = ([x1, y1], [x2, y2]) => `M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}`;

/** Move every coordinate pair of an absolute M/L/C path. */
function shift(d, dx, dy) {
  return d.replace(/([MLCZ])([^MLCZ]*)/g, (_, cmd, args) => {
    const n = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    const out = [];
    for (let i = 0; i < n.length; i += 2) out.push(`${f(n[i] + dx)} ${f(n[i + 1] + dy)}`);
    return cmd + out.join(' ');
  });
}

/** End points of a pill rect from the master files (rect + orthonormal matrix). */
function pillEnds({ width: w, height: h, transform }) {
  const [a, b, c, d, e, g] = transform.match(/-?[\d.]+/g).map(Number);
  const at = (x, y) => [a * x + c * y + e, b * x + d * y + g];
  return [at(h / 2, h / 2), at(w - h / 2, h / 2)];
}

// The symbol (X + clan figure) centred in the stage.
const MX = -838;
const MY = -256.5;
const FIG = G.figureShift + MX;
const toStage = ([x, y]) => [x + MX, y + MY];
const longEnds = pillEnds(G.xLong).map(toStage);
const shortEnds = pillEnds(G.xShort).map(toStage);
const sparkEnds = pillEnds(G.spark).map(toStage);

/**
 * Each state: inkA / inkB (stroked path + width), spark (filled path + gradient
 * from its lit end to its faded end), body (filled path), head (centre, radii,
 * rotation, ring width).
 */
export const STATES = {
  mark: {
    inkA: { d: line(...longEnds), w: G.xLong.height },
    inkB: { d: line(...shortEnds), w: G.xShort.height },
    spark: { d: pill(sparkEnds[0], sparkEnds[1], G.spark.height / 2), from: sparkEnds[1], to: sparkEnds[0] },
    body: shift(G.body, FIG, MY),
    head: { x: G.head.cx + FIG, y: G.head.cy + MY, rx: G.head.rx, ry: G.head.ry, rot: -5.8241, ring: 20 },
  },
  // Web & App: a browser window, the spark loading in the address bar, the head as the pointer.
  web: {
    inkA: { d: rrect(150, 230, 700, 540, 56), w: 36 },
    inkB: { d: line([168, 342], [832, 342]), w: 36 },
    spark: { d: pill([300, 286], [790, 286], 17), from: [790, 286], to: [300, 286] },
    body: rrect(222, 414, 420, 232, 30),
    head: { x: 644, y: 642, rx: 54, ry: 54, rot: 0, ring: 20 },
  },
  // Cybersecurity: the body becomes a shield, the head its lock, the pills shackle and keyhole.
  security: {
    inkA: { d: 'M432 470 L432 420 C432 326 568 326 568 420 L568 470', w: 36 },
    inkB: { d: line([500, 548], [500, 598]), w: 26 },
    spark: { d: pill([806, 232], [862, 172], 18), from: [862, 172], to: [806, 232] },
    body: 'M500 168 C580 222 680 246 780 252 L780 470 C780 650 660 772 500 842 C340 772 220 650 220 470 L220 252 C320 246 420 222 500 168Z',
    head: { x: 500, y: 562, rx: 96, ry: 96, rot: 0, ring: 20 },
  },
  // Mobile: the pills draw the phone and its speaker, the body is the screen, the head the home button.
  mobile: {
    inkA: { d: rrect(330, 140, 340, 720, 66), w: 34 },
    inkB: { d: line([464, 200], [536, 200]), w: 18 },
    spark: { d: pill([708, 232], [764, 172], 18), from: [764, 172], to: [708, 232] },
    body: rrect(368, 236, 264, 510, 24),
    head: { x: 500, y: 797, rx: 28, ry: 28, rot: 0, ring: 14 },
  },
  // UI/UX Design: a pen nib (body) with its breather hole (head) drawing a stroke (spark).
  design: {
    inkA: { d: line([404, 236], [596, 236]), w: 64 },
    inkB: { d: line([500, 506], [500, 700]), w: 14 },
    spark: { d: pill([180, 812], [468, 812], 16), from: [468, 812], to: [180, 812] },
    body: 'M380 300 L620 300 C620 420 598 528 500 782 C402 528 380 420 380 300Z',
    head: { x: 500, y: 440, rx: 46, ry: 46, rot: 0, ring: 16 },
  },
};

export const SERVICE_STATES = ['web', 'security', 'mobile', 'design'];

export const headTransform = (h) => `translate(${f(h.x)} ${f(h.y)}) rotate(${h.rot})`;

/**
 * The stage. Renders one state; motion code morphs the parts in place
 * (every part carries data-p). `ground` is the colour behind the stage, used
 * for the ring that separates head from body.
 */
export const Pictogram = forwardRef(function Pictogram({ state = 'web', ground = 'var(--paper-2)', className = '', title, ...rest }, ref) {
  const uid = useId().replace(/:/g, '');
  const s = STATES[state];
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };
  return (
    <svg ref={ref} viewBox="0 0 1000 1000" className={`overflow-visible ${className}`} {...a11y} {...rest}>
      <defs>
        <linearGradient
          data-p="grad"
          id={`xc-ps-${uid}`}
          gradientUnits="userSpaceOnUse"
          x1={s.spark.from[0]}
          y1={s.spark.from[1]}
          x2={s.spark.to[0]}
          y2={s.spark.to[1]}
        >
          <stop stopColor="var(--brand-cyan)" />
          <stop offset="1" stopColor="var(--brand-cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path data-p="body" d={s.body} fill="var(--brand-cyan)" />
      <path data-p="spark" d={s.spark.d} fill={`url(#xc-ps-${uid})`} />
      <g data-p="head" transform={headTransform(s.head)}>
        <ellipse data-p="head-shape" rx={s.head.rx} ry={s.head.ry} fill="var(--brand-blue)" stroke={ground} strokeWidth={s.head.ring} />
      </g>
      <path data-p="inkA" d={s.inkA.d} fill="none" stroke="var(--mark-ink)" strokeWidth={s.inkA.w} strokeLinecap="round" strokeLinejoin="round" />
      <path data-p="inkB" d={s.inkB.d} fill="none" stroke="var(--mark-ink)" strokeWidth={s.inkB.w} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});

/**
 * Add the move from one state to the next to a timeline, at `at`.
 * `svg` is a rendered <Pictogram>; `proxy` holds the head's live values.
 */
export function morphTo(tl, svg, proxy, name, at, duration = 1) {
  const s = STATES[name];
  const q = (p) => svg.querySelector(`[data-p="${p}"]`);
  const head = q('head');
  const shape = q('head-shape');
  const ease = 'xc.inOut';
  tl.to(q('inkA'), { morphSVG: s.inkA.d, attr: { 'stroke-width': s.inkA.w }, duration, ease }, at)
    .to(q('inkB'), { morphSVG: s.inkB.d, attr: { 'stroke-width': s.inkB.w }, duration, ease }, at + 0.06 * duration)
    .to(q('body'), { morphSVG: s.body, duration, ease }, at + 0.03 * duration)
    .to(q('spark'), { morphSVG: s.spark.d, duration, ease }, at + 0.1 * duration)
    .to(q('grad'), { attr: { x1: s.spark.from[0], y1: s.spark.from[1], x2: s.spark.to[0], y2: s.spark.to[1] }, duration, ease }, at + 0.1 * duration)
    .to(proxy, {
      ...s.head,
      duration,
      ease: 'back.inOut(1.3)',
      onUpdate: () => {
        head.setAttribute('transform', headTransform(proxy));
        shape.setAttribute('rx', proxy.rx);
        shape.setAttribute('ry', proxy.ry);
        shape.setAttribute('stroke-width', proxy.ring);
      },
    }, at + 0.12 * duration);
  return tl;
}
