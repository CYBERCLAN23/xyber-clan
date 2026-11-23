import { useRef } from 'react';
import Logo from '../../brand/Logo';
import Link from '../ui/Link';
import Button from '../ui/Button';
import { T, useT } from '../../lib/content';
import { gsap, useGSAP, EASE, reducedMotion } from '../../lib/motion';
import { useCMS } from '../../context/CMSContext';

export const SOCIALS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/xyberclan/' },
  { label: 'GitHub', url: 'https://github.com/CYBERCLAN237' },
  { label: 'X', url: 'https://x.com/XyberC60820' },
  { label: 'Facebook', url: 'https://web.facebook.com/profile.php?id=61581514840888' },
  { label: 'YouTube', url: 'https://www.youtube.com/@xyberclan' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@xyberclan?_r=1&_t=ZM-92Y1vL3Qv7Y' },
  { label: 'WhatsApp', url: 'https://whatsapp.com/channel/0029VbBLsii2P59lAGA3wO1O' },
];

export default function SiteFooter() {
  const { t, tr } = useT();
  const { isEditing } = useCMS();
  const root = useRef(null);
  const f = t.footer;
  const email = tr('footer.cta.email') || 'xyberclandev@gmail.com';
  const phones = String(tr('footer.cta.phone') || '').split('/').map((p) => p.trim()).filter(Boolean);

  useGSAP(() => {
    if (isEditing || reducedMotion()) return;
    const mark = root.current.querySelector('[data-footer-mark]');
    gsap.from(mark, {
      yPercent: 60,
      duration: 1.4,
      ease: EASE.out,
      scrollTrigger: { trigger: mark, start: 'top 98%', end: 'bottom bottom', scrub: 1 },
    });
    gsap.from(root.current.querySelector('[data-footer-mascot]'), {
      yPercent: 100,
      rotate: -8,
      ease: 'none',
      scrollTrigger: { trigger: mark, start: 'top 95%', end: 'bottom bottom', scrub: 1 },
    });
  }, { scope: root, dependencies: [isEditing] });

  return (
    <footer ref={root} className="relative overflow-hidden bg-paper-2 pt-[clamp(80px,10vw,160px)]">
      <div className="shell">
        {/* The close: one big invitation, the ways to reach us beside it. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-[var(--gap)]">
          <div className="lg:col-span-7">
            <T k="footer.cta.title" as="h2" className="t-display max-w-[11ch]" />
            <T k="footer.cta.subtitle" as="p" className="t-lead mt-6 max-w-[34ch] text-ink-2" />
            <div className="mt-10">
              <Button to="/start-project" size="lg">{t.cta.primaryButton}</Button>
            </div>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5 lg:pt-4">
            <div>
              <T k="footer.cta.emailLabel" as="p" className="t-small text-ink-3" />
              <a href={`mailto:${email}`} className="t-title mt-2 inline-block break-all underline decoration-[1.5px] decoration-transparent underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-current">
                <T k="footer.cta.email" />
              </a>
            </div>
            <div>
              <T k="footer.cta.phoneLabel" as="p" className="t-small text-ink-3" />
              <div className="mt-2 flex flex-col gap-1">
                {(isEditing ? [null] : phones).map((p, i) =>
                  p === null ? (
                    <T key="edit" k="footer.cta.phone" as="span" className="t-title" />
                  ) : (
                    <a key={i} href={`tel:${p.replace(/[^+\d]/g, '')}`} className="t-title tabular hover:text-accent">{p}</a>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Index */}
        <div className="mt-[clamp(80px,9vw,140px)] grid grid-cols-2 gap-x-[var(--gap)] gap-y-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <T k="footer.tagline" as="p" className="t-title max-w-[16ch]" />
          </div>
          {Object.entries(f.columns).map(([key, col]) => (
            <nav key={key} aria-label={col.title}>
              <T k={`footer.columns.${key}.title`} as="p" className="t-small text-ink-3 normal-case first-letter:uppercase" />
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.items.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.url} className="t-body text-ink transition-colors hover:text-accent">
                      <T k={`footer.columns.${key}.items.${idx}.label`} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <ul className="mt-14 flex flex-wrap gap-x-6 gap-y-3" aria-label="Social">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="t-small inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink">
                {s.label}
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* The name returns, full width, with the mascot leaning on it. */}
      <div className="shell relative mt-[clamp(56px,7vw,110px)]">
        <img
          data-footer-mascot
          src="/brand/mascot.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute bottom-[42%] right-[calc(var(--margin)+2%)] z-[1] w-[clamp(72px,11vw,190px)]"
        />
        <div data-footer-mark className="relative">
          <Logo variant="wordmark" title="xyberclan" className="w-full h-auto" />
        </div>
      </div>

      <div className="shell flex flex-col gap-3 py-8 t-small text-ink-3 md:flex-row md:items-center md:justify-between">
        <T k="footer.copyright" as="p" className="normal-case" />
        <div className="flex items-center gap-5">
          <Link to="/privacy" className="hover:text-ink"><T k="footer.bottomLinks.privacy" /></Link>
          <Link to="/terms" className="hover:text-ink"><T k="footer.bottomLinks.terms" /></Link>
          <span>
            <T k="footer.madeWith" /> ♥ <T k="footer.madeBy" />
          </span>
        </div>
      </div>
    </footer>
  );
}
