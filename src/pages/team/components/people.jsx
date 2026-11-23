import { T, Img, useT } from '../../../lib/content';
import { useCMS } from '../../../context/CMSContext';
import { SplitText } from '../../../components/ui/Reveal';
import { G } from '../../../brand/geometry';
import { NOT_A_PORTRAIT } from '../data';

/** "AKANA SIGNING JOSIAS AARON" -> "Akana Signing Josias Aaron" (display only; stored text is untouched). */
export function nameCase(s) {
  const v = String(s ?? '');
  if (!/[A-Z]/.test(v) || v !== v.toUpperCase()) return v;
  return v.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
}

/**
 * CMS text bound to a complete key, with an optional display format.
 * In edit mode it is the editable field itself.
 */
export function Field({ ck, fb, as: Tag = 'span', className, format, multiline, ...rest }) {
  const { isEditing, getContent } = useCMS();
  if (isEditing) return <T ck={ck} fb={fb} as={Tag} className={className} multiline={multiline} {...rest} />;
  const v = getContent(ck, fb);
  const s = v === '' || v == null ? fb : v;
  return <Tag className={className} {...rest}>{format ? format(s) : s}</Tag>;
}

/** Section heading on a new key: rises word by word, editable in CMS mode. */
export function Heading({ k, fb, as = 'h2', className = '', ...rest }) {
  const { tr, isEditing } = useT();
  if (isEditing) return <T k={k} fb={fb} as={as} className={className} {...rest} />;
  return <SplitText text={tr(k, fb)} as={as} className={className} {...rest} />;
}

/** Plain value of a CMS key (override, else fallback). */
export function useValue() {
  const { getContent } = useCMS();
  return (key, fb) => {
    const v = getContent(key, fb);
    return v === '' || v == null ? fb : v;
  };
}

const isRetired = (src) => !src || NOT_A_PORTRAIT.includes(String(src).split('?')[0]);

/** Crop that puts the focus point where we want it and zooms around it. */
export function framingStyle(focus = [0.5, 0.5], zoom = 1, center = false) {
  const [fx, fy] = focus;
  const pos = `${fx * 100}% ${fy * 100}%`;
  return {
    objectPosition: pos,
    transformOrigin: pos,
    transform: center ? `translate(${(0.5 - fx) * 100}%, ${(0.5 - fy) * 100}%) scale(${zoom})` : `scale(${zoom})`,
  };
}

/** The clan figure of the mark (cyan body, blue head) as a stand-in when no portrait exists yet. */
export function FigureMark({ label, className = '' }) {
  return (
    <span className={`absolute inset-0 grid place-items-center bg-paper-2 ${className}`}>
      <svg viewBox="1586 572 423 358" className="w-[58%]" aria-hidden="true">
        <path d={G.body} fill="var(--brand-cyan)" />
        <ellipse {...G.head} rx={G.head.rx + 12} ry={G.head.ry + 12} fill="var(--paper-2)" />
        <ellipse {...G.head} fill="var(--brand-blue)" />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

/**
 * A person's photo, CMS-replaceable. When the stored file is the retired logo
 * (two members have no portrait yet), the clan figure stands in.
 */
export function Portrait({ ck, src, alt, focus, zoom = 1, center = false, soon, className = '', ...rest }) {
  const { getContent, isEditing } = useCMS();
  const resolved = getContent(ck, src);
  const frame = framingStyle(focus, zoom, center);
  return (
    <div className={`relative overflow-hidden bg-paper-2 ${className}`} {...rest}>
      {isRetired(resolved) && !isEditing ? (
        <FigureMark label={soon} />
      ) : (
        <Img ck={ck} src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" style={frame} objectPosition={frame.objectPosition} />
      )}
    </div>
  );
}

// Figure geometry in its own box (viewBox 1586 572 423 358).
const BOX = { x: 1586, y: 572, w: 423, h: 358 };
const HEAD = {
  left: `${((G.head.cx - G.head.rx - BOX.x) / BOX.w) * 100}%`,
  top: `${((G.head.cy - G.head.ry - BOX.y) / BOX.h) * 100}%`,
  width: `${((G.head.rx * 2) / BOX.w) * 100}%`,
  height: `${((G.head.ry * 2) / BOX.h) * 100}%`,
};

/**
 * One member drawn as the clan figure: the cyan body of the mark with their
 * face in the head. With no portrait the head stays brand blue.
 */
export function ClanFigure({ src, focus, zoom = 3, className = '' }) {
  const photo = !isRetired(src);
  return (
    <span className={`relative block aspect-[423/358] w-full ${className}`}>
      <svg viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <path data-body d={G.body} fill="var(--brand-cyan)" className="origin-bottom transition-transform duration-500 ease-[var(--ease-spring)] [transform-box:fill-box] group-hover:scale-x-[1.05] group-hover:scale-y-[0.94]" />
      </svg>
      <span data-head className="absolute block" style={HEAD}>
        <span className="block h-full w-full transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-[14%] group-focus-visible:-translate-y-[14%]">
          <span
            className="block h-full w-full overflow-hidden rounded-[50%] bg-blue"
            style={{ transform: 'rotate(-5.8deg)', boxShadow: '0 0 0 clamp(3px, 0.45vw, 6px) var(--paper)' }}
          >
            {photo && (
              <img src={src} alt="" loading="lazy" decoding="async" draggable="false" className="h-full w-full object-cover" style={framingStyle(focus, zoom, true)} />
            )}
          </span>
        </span>
      </span>
    </span>
  );
}

/* Drawn icons, one stroke family. */
export function SocialIcon({ name, className = 'h-4 w-4' }) {
  const n = String(name).toLowerCase();
  if (n.includes('linkedin')) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    );
  }
  if (n.includes('github')) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
        <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.58v-2.04c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}

/** Pill link to an outside profile. */
export function ProfileLink({ href, name, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-paper-2 pl-4 pr-5 text-[0.95rem] transition-colors duration-300 hover:bg-ink hover:text-paper active:scale-[0.98]"
    >
      <SocialIcon name={name} />
      <span>{children ?? name}</span>
    </a>
  );
}

/** Small round control used in the drawer header and on cards. */
export function RoundIcon({ d, className = '' }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-4 w-4 ${className}`} aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const ICON = {
  plus: 'M8 3v10M3 8h10',
  close: 'M4 4l8 8M12 4l-8 8',
  prev: 'M10 3.5 5.5 8l4.5 4.5',
  next: 'M6 3.5 10.5 8 6 12.5',
};
