import { SplitText } from '../../components/ui/Reveal';
import { T, useT } from '../../lib/content';
import { G } from '../../brand/geometry';

/**
 * Headline whose words rise into place, for keys that may have no entry in
 * translations.js (the fallback comes from copy.js). Editable in CMS mode.
 */
export function Heading({ k, fb, as = 'h2', className = '', ...rest }) {
  const { tr, isEditing } = useT();
  if (isEditing) return <T k={k} fb={fb} as={as} className={className} {...rest} />;
  return <SplitText text={tr(k, fb)} as={as} className={className} {...rest} />;
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Paragraph with a few names set in the full ink (the first time each appears).
 * In CMS mode it is a plain editable paragraph.
 */
export function Rich({ k, fb, bold = [], className = '' }) {
  const { tr, isEditing } = useT();
  if (isEditing || !bold.length) return <T k={k} fb={fb} as="p" multiline className={className} />;
  const text = tr(k, fb);
  const used = new Set();
  const parts = text.split(new RegExp(`(${bold.map(escape).join('|')})`, 'g'));
  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (bold.includes(part) && !used.has(part)) {
          used.add(part);
          return <strong key={i} className="font-medium text-ink">{part}</strong>;
        }
        return part;
      })}
    </p>
  );
}

/** The clan figure (body + head) from the mark, for pictograms. */
export function FigureGlyph({ className = '', ring = 'currentColor', ...rest }) {
  return (
    <svg viewBox="1585 565 390 400" className={className} aria-hidden="true" {...rest}>
      <path d={G.body} fill="var(--brand-cyan)" />
      <g data-head>
        <ellipse {...G.head} fill="var(--brand-blue)" stroke={ring} strokeWidth="22" />
      </g>
    </svg>
  );
}
