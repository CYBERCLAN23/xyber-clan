import { useEffect, useRef, useState } from 'react';
import { PLATES } from './data';

const TONES = {
  paper: 'bg-paper-2 text-ink',
  ink: 'bg-ink text-paper',
  blue: 'bg-blue-deep text-white',
  cyan: 'bg-cyan text-on-cyan',
};

/**
 * A project's picture on its plate. Screenshots fill the plate; logos sit on a
 * field of colour. A missing picture leaves a title card of the project's name.
 * The [data-zoom] layer is the one scroll and pointer motion move.
 */
export default function ProjectMedia({ project, size = 'card', eager = false, className = '' }) {
  const plate = PLATES[project.id] || { tone: 'paper', fit: 'cover' };
  const [state, setState] = useState('loading');
  const img = useRef(null);
  // A picture already in the cache may finish before the handlers run.
  useEffect(() => {
    const el = img.current;
    if (el?.complete) setState(el.naturalWidth > 0 ? 'ok' : 'error');
  }, []);
  const failed = state === 'error';
  const contain = plate.fit === 'contain' && !failed;
  const TYPE = {
    card: 'text-[clamp(2rem,9cqw,7rem)]',
    dialog: 'text-[clamp(2rem,9cqw,5.5rem)]',
    thumb: 'text-[1.05rem] tracking-[-0.03em]',
  };

  return (
    <div className={`@container relative h-full w-full overflow-hidden ${TONES[plate.tone]} ${className}`}>
      {/* Title card: always underneath; covered once a full-bleed picture loads. */}
      {!contain && (
        <div className={`absolute inset-0 flex flex-col justify-end ${size === 'thumb' ? 'p-3' : 'p-[clamp(20px,3vw,48px)]'}`} aria-hidden={!failed}>
          <span className={`${TYPE[size] || TYPE.card} font-semibold leading-[0.9] tracking-[-0.05em]`}>
            {project.logoText}
          </span>
        </div>
      )}
      <div data-zoom className="absolute inset-0 will-change-transform">
        {!failed && (
          <img
            ref={img}
            data-pic
            src={project.image}
            alt={project.client}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setState('ok')}
            onError={() => setState('error')}
            className={`absolute transition-opacity duration-700 ease-[var(--ease-out)] ${state === 'ok' ? 'opacity-100' : 'opacity-0'} ${
              contain
                ? 'left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 object-contain'
                : 'inset-0 h-full w-full object-cover object-left-top'
            }`}
          />
        )}
      </div>
    </div>
  );
}
