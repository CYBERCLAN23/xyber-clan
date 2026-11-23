import { useId, useRef, useState } from 'react';
import { Reveal, SplitText } from '../../components/ui/Reveal';
import { T, useT } from '../../lib/content';
import { gsap, useGSAP, reducedMotion } from '../../lib/motion';

const newsletterCopy = {
  en: { label: 'Email address', submit: 'Subscribe', sending: 'Subscribing…', done: 'Thank you, you are on the list.' },
  fr: { label: 'Adresse e-mail', submit: 'S’abonner', sending: 'Inscription…', done: 'Merci, vous êtes inscrit.' },
};

/** Newsletter: one field, one pill. */
export default function Newsletter() {
  const { lang, isEditing } = useT();
  const copy = newsletterCopy[lang] || newsletterCopy.en;
  const inputId = useId();
  const root = useRef(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  // Same behaviour as before: a short wait, a success state, then back to idle.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    }, 1500);
  };

  // Success: the check draws itself.
  useGSAP(() => {
    if (status !== 'success' || reducedMotion()) return;
    gsap.fromTo(root.current.querySelector('[data-check]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, ease: 'power2.out' });
  }, { scope: root, dependencies: [status] });

  const busy = status !== 'idle';

  return (
    <section ref={root} aria-labelledby="newsletter-title" className="shell pb-[var(--section)]">
      <div className="grid gap-y-10 rounded-media bg-paper-2 px-[clamp(20px,4vw,72px)] py-[clamp(40px,6vw,96px)] lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <div className="flex flex-col gap-5 lg:col-span-6">
          <T k="newsletter.badge" as="p" className="t-small text-ink-3" />
          <SplitText id="newsletter-title" k="newsletter.title" as="h2" className="t-headline" />
          <T k="newsletter.subtitle" as="p" className="t-lead max-w-[36ch] text-ink-2" />
        </div>

        <Reveal className="flex flex-col justify-end gap-4 lg:col-span-5 lg:col-start-8">
          <form onSubmit={handleSubmit} className="relative w-full">
            <label htmlFor={inputId} className="sr-only">{copy.label}</label>
            <input
              id={inputId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              autoComplete="email"
              required
              disabled={busy}
              className="h-16 w-full rounded-full bg-paper pl-7 pr-20 text-[1.05rem] text-ink outline-none transition-shadow duration-300 placeholder:text-ink-3 focus-visible:shadow-[0_0_0_2px_var(--focus)] disabled:opacity-70 md:h-[72px]"
            />
            <button
              type="submit"
              disabled={busy || isEditing}
              aria-label={status === 'loading' ? copy.sending : copy.submit}
              className={`group absolute right-2 top-2 bottom-2 grid aspect-square place-items-center overflow-hidden rounded-full transition-colors duration-500 ease-[var(--ease-out)] ${status === 'success' ? 'bg-cyan text-on-cyan' : 'bg-ink text-paper hover:bg-cyan hover:text-on-cyan'}`}
            >
              {status === 'idle' && (
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-5 w-5 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0.5">
                  <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {status === 'loading' && (
                <span aria-hidden="true" className="relative block h-2 w-8 overflow-hidden rounded-full bg-paper/25">
                  <span className="absolute inset-y-0 left-0 w-1/2 animate-[xc-nl-run_0.9s_var(--ease-in-out)_infinite] rounded-full bg-cyan" />
                  <style>{'@keyframes xc-nl-run{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}'}</style>
                </span>
              )}
              {status === 'success' && (
                <svg viewBox="0 0 16 16" aria-hidden="true" className="h-5 w-5">
                  <path data-check d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </form>
          <p role="status" className="sr-only">{status === 'success' ? copy.done : ''}</p>
          <p className="t-small flex items-center gap-2.5 text-ink-2">
            <span aria-hidden="true" className="h-2 w-5 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-cyan))' }} />
            {status === 'success' ? <span aria-hidden="true">{copy.done}</span> : <T k="newsletter.note" />}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
