import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from '../../brand/Logo';
import Link from '../ui/Link';
import Button from '../ui/Button';
import { T, useT } from '../../lib/content';
import { useTheme } from '../../context/ThemeContext';
import { useLenis } from '../../lib/SmoothScroll';
import { gsap, useGSAP, ScrollTrigger, EASE, reducedMotion } from '../../lib/motion';
import { isHolidaySeason } from '../../utils/festive';

export const NAV_ITEMS = [
  { id: 'about', to: '/#about' },
  { id: 'portfolio', to: '/portfolio' },
  { id: 'team', to: '/team' },
  { id: 'journey', to: '/journey' },
  { id: 'events', to: '/events' },
  { id: 'partners', to: '/partners' },
];
const MENU_ITEMS = [{ id: 'home', to: '/' }, ...NAV_ITEMS, { id: 'contact', to: '/#contact' }];

/** Language switch: EN / FR. */
export function LangSwitch({ className = '' }) {
  const { lang, setLanguage } = useT();
  return (
    <div role="group" aria-label="Language" className={`inline-flex h-9 items-center rounded-full bg-paper-2 p-1 text-[0.8rem] font-medium ${className}`}>
      {['en', 'fr'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLanguage(l)}
          aria-pressed={lang === l}
          className={`h-7 rounded-full px-3 uppercase tracking-[0.02em] transition-colors duration-300 ${lang === l ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/** Theme switch: the clan figure's head, half lit. */
export function ThemeSwitch({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={(e) => {
        document.documentElement.dataset.vt = 'theme';
        toggleTheme(e);
      }}
      aria-label={t.nav.toggleTheme}
      aria-pressed={isDark}
      className={`grid h-9 w-9 place-items-center rounded-full bg-paper-2 text-ink transition-colors hover:bg-paper-3 ${className}`}
    >
      <svg viewBox="0 0 20 20" className="h-[18px] w-[18px] transition-transform duration-700 ease-[var(--ease-out)]" style={{ transform: isDark ? 'rotate(180deg)' : 'none' }} aria-hidden="true">
        <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5z" fill="currentColor" />
      </svg>
    </button>
  );
}

/** Two pills that cross into the X of the logo when the menu opens. */
function MenuIcon({ open }) {
  const base = 'absolute left-1/2 top-1/2 rounded-full bg-current transition-all duration-500 ease-[var(--ease-out)]';
  return (
    <span className="relative block h-6 w-6" aria-hidden="true">
      <span className={base} style={{ width: 22, height: 2.5, transform: open ? 'translate(-50%,-50%) rotate(48deg)' : 'translate(-50%, -5px)' }} />
      <span className={base} style={{ width: open ? 14 : 22, height: open ? 4 : 2.5, transform: open ? 'translate(-75%,0%) rotate(-42deg)' : 'translate(-50%, 3px)' }} />
    </span>
  );
}

export default function SiteNav({ overHero = false }) {
  const bar = useRef(null);
  const menu = useRef(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(!overHero);
  const { pathname } = useLocation();
  const lenis = useLenis();
  const festive = isHolidaySeason();

  // Hide on scroll down, show on scroll up; turn solid after leaving the top.
  useGSAP(() => {
    const el = bar.current;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        setSolid(!overHero || y > 40);
        if (reducedMotion()) return;
        const hide = self.direction === 1 && y > 320;
        gsap.to(el, { yPercent: hide ? -110 : 0, duration: 0.6, ease: EASE.out, overwrite: 'auto' });
      },
    });
    return () => st.kill();
  }, { dependencies: [overHero] });

  useEffect(() => setOpen(false), [pathname]);

  // Menu open: lock scroll, animate items, Esc to close.
  useEffect(() => {
    if (!open) return undefined;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    if (!reducedMotion() && menu.current) {
      gsap.fromTo(menu.current, { clipPath: 'inset(0% 0% 100% 0% round 0px 0px 48px 48px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', duration: 0.9, ease: EASE.inOut });
      gsap.from(menu.current.querySelectorAll('[data-menu-item]'), { yPercent: 110, duration: 1, ease: EASE.out, stagger: 0.05, delay: 0.25 });
    }
    menu.current?.querySelector('a, button')?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis]);

  const isActive = (to) => (to.startsWith('/#') ? false : pathname === to);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-[900] transition-[background-color] duration-500 ease-[var(--ease-out)] ${solid && !open ? 'bg-[color-mix(in_oklab,var(--paper)_86%,transparent)] [backdrop-filter:blur(14px)_saturate(1.5)]' : 'bg-transparent'}`}
      >
        <nav aria-label="Main" className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          <Link to="/" aria-label="XyberClan home" className="relative z-[2] flex items-center gap-3">
            <Logo variant="symbol" festive={festive} decorative className="h-8 w-auto md:h-9" />
            <Logo variant="wordmark" decorative className="hidden h-[15px] w-auto sm:block" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.to}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                  className="group relative inline-flex h-10 items-center rounded-full px-3.5 text-[0.95rem] text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink"
                >
                  <T k={`nav.${item.id}`} />
                  <span aria-hidden="true" className="absolute bottom-1.5 left-1/2 h-[5px] w-[5px] -translate-x-1/2 scale-0 rounded-full bg-blue transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-100 group-aria-[current=page]:scale-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="relative z-[2] flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <LangSwitch />
              <ThemeSwitch />
            </div>
            <div className="hidden sm:block">
              <Button to="/start-project" size="sm">
                <T k="nav.getStarted" />
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-11 w-11 place-items-center rounded-full bg-paper-2 text-ink lg:hidden"
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div ref={menu} id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[850] flex flex-col bg-paper-2 pt-[calc(var(--nav-h)+24px)]" data-lenis-prevent>
          <ul className="shell flex flex-1 flex-col justify-center gap-1">
            {MENU_ITEMS.map((item) => (
              <li key={item.id} className="overflow-hidden">
                <Link to={item.to} onClick={() => setOpen(false)} data-menu-item className="block py-1 text-[clamp(2.4rem,10vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink transition-colors hover:text-accent">
                  <T k={`nav.${item.id}`} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="shell flex flex-wrap items-center justify-between gap-4 pb-8 pt-6">
            <div className="flex items-center gap-2">
              <LangSwitch />
              <ThemeSwitch />
            </div>
            <Button to="/start-project" onClick={() => setOpen(false)}>
              <T k="nav.getStarted" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
