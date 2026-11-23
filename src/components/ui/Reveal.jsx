import { useRef } from 'react';
import { gsap, useGSAP, reducedMotion, EASE } from '../../lib/motion';
import { useCMS } from '../../context/CMSContext';
import { useT, T } from '../../lib/content';

/**
 * Staggered entrance for a group: each direct child (or each `selector` match)
 * rises and fades in once as the group enters the viewport.
 * Content is visible by default; only script hides it, and only just before it animates.
 */
export function Reveal({ as: Tag = 'div', children, selector, y = 28, stagger = 0.08, delay = 0, start = 'top 86%', className, ...rest }) {
  const ref = useRef(null);
  const { isEditing } = useCMS();
  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const items = selector ? ref.current.querySelectorAll(selector) : ref.current.children;
    if (!items.length) return;
    gsap.from(items, {
      y,
      autoAlpha: 0,
      duration: 1.05,
      ease: EASE.out,
      stagger,
      delay,
      scrollTrigger: { trigger: ref.current, start, once: true },
    });
  }, { scope: ref, dependencies: [isEditing] });
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}

/** Wrap each word of a string in a mask so lines can rise into place. */
export function Words({ text, wordClass = '' }) {
  const parts = String(text ?? '').split(/(\s+)/);
  return parts.map((p, i) =>
    /^\s+$/.test(p) || p === '' ? (
      p
    ) : (
      <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-top">
        <span className={`xc-word inline-block will-change-transform ${wordClass}`}>{p}</span>
      </span>
    ),
  );
}

/**
 * Headline whose words rise out of masks. Bound to a CMS key: in edit mode it
 * renders plain editable text instead.
 *   <SplitText k="whoWeAre.title1" as="h2" className="t-display" />
 *   <SplitText text="Already a string" />
 */
export function SplitText({ k, text, as: Tag = 'h2', className = '', delay = 0, stagger = 0.06, start = 'top 85%', immediate = false, children, ...rest }) {
  const ref = useRef(null);
  const { isEditing } = useCMS();
  const { tr, lang } = useT();
  const value = text ?? (k ? tr(k) : '');

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const words = ref.current.querySelectorAll('.xc-word');
    if (!words.length) return;
    gsap.from(words, {
      yPercent: 115,
      rotate: 4,
      duration: 1.15,
      ease: EASE.out,
      stagger,
      delay,
      scrollTrigger: immediate ? undefined : { trigger: ref.current, start, once: true },
    });
  }, { scope: ref, dependencies: [isEditing, lang, value] });

  if (isEditing && k) {
    return <T k={k} as={Tag} className={className} {...rest} />;
  }
  return (
    <Tag ref={ref} className={className} {...rest}>
      <Words text={value} />
      {children}
    </Tag>
  );
}
