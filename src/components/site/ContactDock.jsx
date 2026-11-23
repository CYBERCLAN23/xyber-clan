import { useEffect, useRef, useState } from 'react';
import { T, useT } from '../../lib/content';
import Link from '../ui/Link';
import { gsap, EASE, reducedMotion } from '../../lib/motion';
import { isHolidaySeason } from '../../utils/festive';

const NUMBERS = ['237654269488', '237696814391'];

function WhatsAppGlyph({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.08.8.82-3-.2-.31a8.22 8.22 0 1 1 6.94 3.84Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.28.19-.53.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.17 3.69c1.56.67 2.17.73 2.95.61.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

/** Always-there contact: WhatsApp lines, email, and the project brief. */
export default function ContactDock() {
  const { t, tr, lang } = useT();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const sheet = useRef(null);
  const btn = useRef(null);
  const message = lang === 'fr' ? 'Bonjour XyberClan, je suis intéressé(e) par vos services !' : "Hi XyberClan, I'm interested in your services!";

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    if (!reducedMotion() && sheet.current) {
      gsap.fromTo(sheet.current, { y: 16, autoAlpha: 0, scale: 0.96, transformOrigin: '100% 100%' }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, ease: EASE.out });
    }
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    const onClick = (e) => { if (!e.target.closest('[data-contact-dock]')) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onClick);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onClick); };
  }, [open]);

  const contacts = t.whatsapp?.contacts || [];
  const festiveTip = lang === 'fr' ? 'Joyeux Noël ! Écrivez-nous' : 'Merry Christmas! Chat with us';

  return (
    <div
      data-contact-dock
      className={`fixed bottom-5 right-5 z-[800] flex flex-col items-end gap-3 transition-all duration-700 ease-[var(--ease-out)] md:bottom-7 md:right-7 ${visible || open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
    >
      {open && (
        <div ref={sheet} id="contact-sheet" role="dialog" aria-label={t.nav.contact} className="w-[min(320px,calc(100vw-40px))] rounded-[24px] bg-ink p-2 text-paper shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]">
          <ul className="flex flex-col">
            {contacts.map((c, i) => (
              <li key={i}>
                <a
                  href={`https://wa.me/${NUMBERS[i] || String(c.number).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-[18px] px-4 py-3 transition-colors hover:bg-white/10"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#25D366] text-white"><WhatsAppGlyph className="h-5 w-5" /></span>
                  <span className="flex flex-col leading-tight">
                    <T k={`whatsapp.contacts.${i}.label`} className="text-[0.82rem] text-white/60" />
                    <T k={`whatsapp.contacts.${i}.number`} className="tabular text-[1rem] font-medium" />
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${tr('footer.cta.email') || 'xyberclandev@gmail.com'}`} className="flex items-center gap-3 rounded-[18px] px-4 py-3 transition-colors hover:bg-white/10">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10" aria-hidden="true">
                  <svg viewBox="0 0 20 20" className="h-4.5 w-4.5"><path d="M3 5.5h14v9H3zM3.5 6l6.5 5 6.5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                </span>
                <span className="flex flex-col leading-tight">
                  <T k="footer.cta.emailLabel" className="text-[0.82rem] text-white/60" />
                  <T k="footer.cta.email" className="text-[0.98rem] font-medium" />
                </span>
              </a>
            </li>
            <li className="p-1.5 pt-2">
              <Link to="/start-project" onClick={() => setOpen(false)} className="flex h-12 items-center justify-center rounded-full bg-cyan font-medium text-on-cyan transition-transform duration-300 hover:scale-[1.02]">
                {t.cta.primaryButton}
              </Link>
            </li>
          </ul>
        </div>
      )}

      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="contact-sheet"
        className="group flex h-14 items-center gap-2.5 rounded-full bg-ink pl-2 pr-5 text-paper shadow-[0_18px_40px_-14px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-[1.04]"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-[-12deg]">
          <WhatsAppGlyph className="h-5 w-5" />
        </span>
        <T k="whatsapp.tooltip" fb={isHolidaySeason() ? festiveTip : undefined} className="text-[0.95rem] font-medium" />
      </button>
    </div>
  );
}
