import { forwardRef, useId } from 'react';
import { G, VIEWBOX } from './geometry';

/**
 * The XyberClan mark, drawn from the master vectors.
 *
 * variant:
 *   "lockup"   – XClan (X, C, l, clan figure, n)
 *   "symbol"   – the X and the clan figure only
 *   "wordmark" – lowercase "xyberclan" lettering
 *
 * Every piece carries data-part so motion code can animate it on its own:
 *   x-long, x-short, spark, letters, body, head, hat
 *
 * Colours come from CSS custom properties so the mark follows the theme:
 *   --mark-ink (X + letters), --brand-cyan (body), --brand-blue (head),
 *   --mark-ring (outline that separates head from body; matches the ground).
 */
const Logo = forwardRef(function Logo(
  { variant = 'symbol', festive = false, title = 'XyberClan', className = '', style, decorative = false, ...rest },
  ref,
) {
  const uid = useId().replace(/:/g, '');
  const gradId = `xc-spark-${uid}`;
  const maskId = `xc-ring-${uid}`;
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': title };

  if (variant === 'wordmark') {
    return (
      <svg ref={ref} viewBox={VIEWBOX.wordmark} className={className} style={style} {...a11y} {...rest}>
        <path data-part="letters" d={G.wordmark.d} fill="var(--mark-ink, currentColor)" />
      </svg>
    );
  }

  const isLockup = variant === 'lockup';
  const figureShift = isLockup ? 0 : G.figureShift;
  let viewBox = isLockup ? VIEWBOX.lockup : VIEWBOX.symbol;
  if (festive) viewBox = isLockup ? '950 440 1215 535' : VIEWBOX.symbolHat;

  return (
    <svg ref={ref} viewBox={viewBox} className={className} style={style} {...a11y} {...rest}>
      <defs>
        <linearGradient id={gradId} x1={G.spark.width} y1={G.spark.height / 2} x2="0" y2={G.spark.height / 2} gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-cyan, #22C4D2)" />
          <stop offset="1" stopColor="var(--brand-cyan, #22C4D2)" stopOpacity="0" />
        </linearGradient>
        <mask id={maskId} fill="white">
          <path d={G.ring} />
        </mask>
      </defs>

      <g data-part="x" fill="var(--mark-ink, #1E1E1E)">
        <rect data-part="x-long" {...G.xLong} />
        <rect data-part="x-short" {...G.xShort} />
      </g>
      <rect data-part="spark" {...G.spark} fill={`url(#${gradId})`} />

      {isLockup && <path data-part="letters" d={G.letters} fill="var(--mark-ink, #1E1E1E)" />}

      <g data-part="figure" transform={figureShift ? `translate(${figureShift} 0)` : undefined}>
        <path data-part="body" d={G.body} fill="var(--brand-cyan, #22C4D2)" />
        <g data-part="head-group">
          <ellipse data-part="head" {...G.head} fill="var(--brand-blue, #2785B7)" />
          <path d={G.ring} stroke="var(--mark-ring, #fff)" strokeWidth="20" fill="none" mask={`url(#${maskId})`} />
          {festive && (
            <image
              data-part="hat"
              href="/brand/santa-hat.webp"
              x={G.hat.x}
              y={G.hat.y}
              width={G.hat.width}
              height={G.hat.height}
              preserveAspectRatio="xMidYMid meet"
            />
          )}
        </g>
      </g>
    </svg>
  );
});

export default Logo;
