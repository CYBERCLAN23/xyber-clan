import { useId } from 'react';
import { G } from '../../brand/geometry';

// The order a project actually follows. Labels come from get_started.labels.*;
// the one-line descriptions are new copy (CMS key processSteps.<id>).
export const STEP_IDS = ['contact', 'design', 'code', 'comm', 'deploy', 'support'];

export const processCopy = {
  en: {
    contact: 'Tell us about your project through the form or on WhatsApp. We listen first.',
    design: 'We shape the flow and every screen with you before a line of code is written.',
    code: 'Our engineers build it, with security part of every step, not added at the end.',
    comm: 'You follow progress in one shared channel, with regular check-ins and demos.',
    deploy: 'We launch on fast, secured hosting and check that everything works for real users.',
    support: 'After launch we stay close: fixes, updates, backups and maintenance.',
    step: 'Step',
  },
  fr: {
    contact: 'Parlez-nous de votre projet via le formulaire ou sur WhatsApp. Nous écoutons d’abord.',
    design: 'Nous dessinons le parcours et chaque écran avec vous, avant la moindre ligne de code.',
    code: 'Nos ingénieurs le construisent, la sécurité intégrée à chaque étape, pas ajoutée à la fin.',
    comm: 'Vous suivez l’avancement dans un canal partagé, avec des points réguliers et des démos.',
    deploy: 'Nous mettons en ligne sur un hébergement rapide et sécurisé, et vérifions que tout fonctionne.',
    support: 'Après le lancement, nous restons proches : corrections, mises à jour, sauvegardes et maintenance.',
    step: 'Étape',
  },
};

/* ── Pictograms: built only from the mark's pieces (pill strokes, spark, body, head). ── */

function Pill({ cx, cy, w, h, r = 0, fill = 'var(--mark-ink)' }) {
  return (
    <g data-pic>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2} fill={fill} transform={`rotate(${r} ${cx} ${cy})`} />
    </g>
  );
}

/** The clan figure (cyan body + blue head) at position x,y and scale s. */
function Figure({ x, y, s }) {
  return (
    <g data-pic>
      <g transform={`translate(${x} ${y}) scale(${s}) translate(-1580 -582)`}>
        <path d={G.body} fill="var(--brand-cyan)" />
        <ellipse data-head {...G.head} fill="var(--brand-blue)" stroke="var(--paper)" strokeWidth="26" />
      </g>
    </g>
  );
}

function Head({ cx, cy, r, fill = 'var(--brand-blue)' }) {
  return (
    <g data-pic>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
    </g>
  );
}

function Frame({ children, label }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 240 180" aria-hidden="true" focusable="false" data-label={label} className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id={`sp-${id}`} x1="1" y1="0" x2="0" y2="0">
          <stop stopColor="var(--brand-cyan)" />
          <stop offset="1" stopColor="var(--brand-cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {children(`url(#sp-${id})`)}
    </svg>
  );
}

export const PICTOGRAMS = {
  // A person, and the spark of a message leaving them.
  contact: () => (
    <Frame label="contact">
      {(spark) => (
        <>
          <Figure x={34} y={46} s={0.3} />
          <Pill cx={176} cy={58} w={74} h={30} r={-38} fill={spark} />
          <Pill cx={206} cy={104} w={30} h={14} r={-38} fill="var(--brand-cyan)" />
        </>
      )}
    </Frame>
  ),
  // The X itself: the two strokes of the mark, and its spark.
  design: () => (
    <Frame label="design">
      {(spark) => (
        <>
          <Pill cx={112} cy={92} w={168} h={24} r={50} />
          <Pill cx={104} cy={106} w={96} h={36} r={-42} />
          <Pill cx={178} cy={46} w={64} h={30} r={-50} fill={spark} />
        </>
      )}
    </Frame>
  ),
  // < / > drawn with pill strokes.
  code: () => (
    <Frame label="code">
      {() => (
        <>
          <Pill cx={62} cy={72} w={74} h={22} r={-36} />
          <Pill cx={62} cy={108} w={74} h={22} r={36} />
          <Pill cx={120} cy={90} w={110} h={22} r={-66} fill="var(--brand-cyan)" />
          <Pill cx={178} cy={72} w={74} h={22} r={36} />
          <Pill cx={178} cy={108} w={74} h={22} r={-36} />
        </>
      )}
    </Frame>
  ),
  // Two heads in conversation, the typing pills between them.
  comm: () => (
    <Frame label="comm">
      {(spark) => (
        <>
          <Head cx={52} cy={96} r={34} />
          <Head cx={188} cy={84} r={34} fill="var(--brand-cyan)" />
          <Pill cx={104} cy={66} w={26} h={16} />
          <Pill cx={136} cy={66} w={26} h={16} />
          <Pill cx={120} cy={122} w={62} h={22} fill={spark} />
        </>
      )}
    </Frame>
  ),
  // Strokes climbing like steps; the head rides to the top.
  deploy: () => (
    <Frame label="deploy">
      {(spark) => (
        <>
          <Pill cx={58} cy={144} w={78} h={22} />
          <Pill cx={112} cy={108} w={78} h={22} />
          <Pill cx={166} cy={72} w={78} h={22} />
          <Head cx={200} cy={34} r={20} />
          <Pill cx={70} cy={86} w={70} h={26} r={-36} fill={spark} />
        </>
      )}
    </Frame>
  ),
  // The figure and its small companion: someone stays by your side.
  support: () => (
    <Frame label="support">
      {(spark) => (
        <>
          <Figure x={18} y={34} s={0.32} />
          <Figure x={150} y={96} s={0.17} />
          <Pill cx={170} cy={52} w={52} h={22} r={-30} fill={spark} />
        </>
      )}
    </Frame>
  ),
};
