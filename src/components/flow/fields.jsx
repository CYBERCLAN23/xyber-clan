import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { LETTERS } from './utils';

/* ── Small glyphs (decorative) ─────────────────────────────── */
export const CheckGlyph = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path d="M4.5 10.5 8.2 14l7.3-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ArrowGlyph = ({ className = '', dir = 'right' }) => (
  <svg viewBox="0 0 16 16" className={`${className} ${dir === 'left' ? 'rotate-180' : dir === 'up' ? '-rotate-90' : dir === 'down' ? 'rotate-90' : ''}`} aria-hidden="true">
    <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ReturnGlyph = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path d="M13 3v4.5a2 2 0 0 1-2 2H3.5M6.5 6.5 3.5 9.5l3 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const WhatsAppGlyph = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2c0 1.2.9 2.3 1 2.5.1.1 1.7 2.6 4.1 3.7 1.5.6 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z"
    />
  </svg>
);
export const MailGlyph = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <rect x="3" y="5.5" width="18" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="m4 7.5 8 5.5 8-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

/* ── Pill button (the X strokes); full width on phones when asked ── */
const PILL = {
  primary: 'bg-ink text-paper [--fill:var(--brand-cyan)] hover:text-on-cyan',
  secondary: 'bg-paper-2 text-ink [--fill:var(--paper-3)]',
  quiet: 'bg-transparent text-ink-2 hover:text-ink [--fill:var(--paper-2)]',
};
export const Pill = forwardRef(function Pill({ variant = 'primary', size = 'md', className = '', children, type = 'button', ...rest }, ref) {
  const sz = size === 'lg' ? 'h-14 px-7 text-[1.05rem] gap-3' : size === 'sm' ? 'h-10 px-4 text-[0.92rem] gap-2' : 'h-12 px-6 text-[1rem] gap-2.5';
  return (
    <button
      ref={ref}
      type={type}
      className={`group relative isolate inline-flex select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-[color,transform] duration-500 ease-[var(--ease-out)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${PILL[variant]} ${sz} ${className}`}
      {...rest}
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 rounded-full bg-[var(--fill)] transition-transform duration-[650ms] ease-[var(--ease-out)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      {children}
    </button>
  );
});

/* ── Inline error, announced ───────────────────────────────── */
export function FieldError({ id, message }) {
  return (
    <p id={id} role="alert" className={`flex min-h-[1.5rem] items-start gap-2 pt-2 text-[0.95rem] font-medium leading-snug text-[#b42318] dark:text-[#ff9b8f] ${message ? '' : 'sr-only'}`}>
      {message && (
        <>
          <svg viewBox="0 0 20 20" className="mt-[3px] h-4 w-4 shrink-0" aria-hidden="true">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M10 5.8v5M10 13.6v.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>{message}</span>
        </>
      )}
    </p>
  );
}

/* ── Choice list: radios / checkboxes as large rows with letter keys ── */
export function ChoiceList({ name, options, value, multi = false, onPick, labelledBy, describedBy, invalid, columns }) {
  const selected = multi ? (Array.isArray(value) ? value : []) : value;
  const isOn = (v) => (multi ? selected.includes(v) : selected === v);
  const cols = columns ?? (options.length > 4 ? 2 : 1);
  return (
    <div
      role={multi ? 'group' : 'radiogroup'}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={`grid gap-2.5 ${cols === 2 ? 'sm:grid-cols-2' : ''} ${cols === 1 ? 'max-w-[40rem]' : ''}`}
    >
      {options.map((opt, i) => {
        const on = isOn(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            role={multi ? 'checkbox' : 'radio'}
            aria-checked={on}
            data-opt={i}
            data-flow-name={name}
            onClick={() => onPick(opt.value)}
            className={`group flex min-h-[3.75rem] w-full items-center gap-4 rounded-[18px] px-4 py-3 text-left transition-[background-color,color,transform] duration-300 ease-[var(--ease-out)] active:scale-[0.985] md:min-h-[4.25rem] md:px-5 ${
              on ? 'bg-cyan text-on-cyan' : 'bg-paper-2 text-ink hover:bg-paper-3'
            }`}
          >
            {i < LETTERS.length && (
              <span
                aria-hidden="true"
                className={`grid h-8 min-w-8 shrink-0 place-items-center rounded-[10px] px-1.5 text-[0.82rem] font-semibold tabular transition-colors duration-300 ${
                  on ? 'bg-[#0d1a1c] text-white' : 'bg-paper text-ink-2 group-hover:text-ink'
                }`}
              >
                {LETTERS[i]}
              </span>
            )}
            <span className="flex-1 text-[1.0625rem] font-medium leading-snug tracking-[-0.01em] md:text-[1.15rem]">
              {opt.label}
              {opt.sub && <span className={`mt-0.5 block text-[0.9rem] font-normal ${on ? 'text-on-cyan/80' : 'text-ink-3'}`}>{opt.sub}</span>}
            </span>
            <span
              aria-hidden="true"
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-[opacity,transform] duration-300 ease-[var(--ease-spring)] ${on ? 'scale-100 bg-[#0d1a1c] text-white opacity-100' : 'scale-50 opacity-0'}`}
            >
              <CheckGlyph className="h-4 w-4" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Chips (small inline single choice, e.g. preferred channel) ── */
export function Chips({ options, value, onPick, labelledBy }) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onPick(opt.value)}
            className={`inline-flex h-12 items-center gap-2 rounded-full px-5 text-[1rem] font-medium transition-colors duration-300 ${on ? 'bg-ink text-paper' : 'bg-paper-2 text-ink hover:bg-paper-3'}`}
          >
            {on && <CheckGlyph className="h-4 w-4" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const INPUT =
  'block w-full rounded-[18px] bg-paper-2 px-5 py-4 text-[1.2rem] leading-snug tracking-[-0.01em] text-ink outline-none transition-colors duration-300 placeholder:text-ink-3 hover:bg-paper-3 focus:bg-paper-3 md:text-[1.5rem] aria-[invalid=true]:outline aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-offset-2 aria-[invalid=true]:outline-[#b42318] dark:aria-[invalid=true]:outline-[#ff9b8f]';
const INPUT_SM =
  'block w-full rounded-[16px] bg-paper-2 px-4 py-3.5 text-[1.0625rem] leading-snug text-ink outline-none transition-colors duration-300 placeholder:text-ink-3 hover:bg-paper-3 focus:bg-paper-3 md:text-[1.15rem] aria-[invalid=true]:outline aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-offset-2 aria-[invalid=true]:outline-[#b42318] dark:aria-[invalid=true]:outline-[#ff9b8f]';

export const TextInput = forwardRef(function TextInput({ compact, className = '', ...rest }, ref) {
  return <input ref={ref} className={`${compact ? INPUT_SM : INPUT} ${className}`} {...rest} />;
});

/** Textarea that grows with its content. */
export const TextArea = forwardRef(function TextArea({ value, compact, className = '', ...rest }, ref) {
  const own = useRef(null);
  const set = (el) => {
    own.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };
  useLayoutEffect(() => {
    const el = own.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight + 2, 460)}px`;
  }, [value]);
  return <textarea ref={set} value={value} rows={4} className={`${compact ? INPUT_SM : INPUT} min-h-[9rem] resize-none ${className}`} data-lenis-prevent {...rest} />;
});

/** Phone: an editable country code (defaults to +237) and the number. */
export const PhoneInput = forwardRef(function PhoneInput({ value, onChange, id, codeLabel, describedBy, invalid, compact, placeholder, required, ...rest }, ref) {
  const v = value && typeof value === 'object' ? value : { code: '+237', number: typeof value === 'string' ? value : '' };
  const ownCode = !String(v.number || '').trim().match(/^(\+|00)/);
  return (
    <div className="flex gap-2">
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-country-code"
        aria-label={codeLabel}
        value={v.code}
        onChange={(e) => onChange({ ...v, code: e.target.value.replace(/[^\d+]/g, '').slice(0, 5) })}
        className={`${(compact ? INPUT_SM : INPUT).replace('w-full', '')} w-[5.5rem] shrink-0 !px-2 text-center tabular md:w-[7rem] ${ownCode ? '' : 'text-ink-3'}`}
      />
      <input
        {...rest}
        ref={ref}
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={v.number}
        placeholder={placeholder}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        onChange={(e) => onChange({ ...v, number: e.target.value.slice(0, 24) })}
        className={`${compact ? INPUT_SM : INPUT} min-w-0 flex-1 tabular`}
      />
    </div>
  );
});

/** Keep a bar above the on-screen keyboard (phones). */
export function useKeyboardInset(ref) {
  useEffect(() => {
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (!vv) return undefined;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      el.style.transform = inset > 80 ? `translate3d(0, ${-inset}px, 0)` : '';
    };
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    update();
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, [ref]);
}
