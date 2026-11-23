// Helpers shared by the flow engine and the flow pages.

/** Drop a leading emoji / symbol run from a translated question ("🤔 What…" → "What…"). */
export const stripLead = (s) => String(s ?? '').replace(/^[^\p{L}\p{N}"'«(]+/u, '').trim();

/** Resolve a value that may be a node, or a function of the answers. */
export const resolve = (v, answers, ctx) => (typeof v === 'function' ? v(answers, ctx) : v);

export const isEmpty = (v) => {
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object' && 'number' in v) return !String(v.number || '').trim();
  return !String(v).trim();
};

// ── Email ──
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const validEmail = (v) => EMAIL_RE.test(String(v || '').trim());

// ── Phone: { code: '+237', number: '6 54 26 94 88' } ──
export const DEFAULT_CODE = '+237';
export const emptyPhone = () => ({ code: DEFAULT_CODE, number: '' });

/** "+237 654269488" — a number typed with its own "+code" wins over the code box. */
export function phoneString(v) {
  if (!v) return '';
  if (typeof v === 'string') return v.trim();
  const num = String(v.number || '').trim();
  if (!num) return '';
  if (num.startsWith('+') || num.startsWith('00')) return num.replace(/^00/, '+');
  const code = String(v.code || '').trim();
  return `${code ? (code.startsWith('+') ? code : `+${code}`) : ''} ${num}`.trim();
}

/** Digits only, for wa.me links ("+237 6 54…" → "2376…"). */
export const phoneDigits = (v) => phoneString(v).replace(/\D/g, '');

export function validPhone(v) {
  const full = phoneString(v);
  if (!/^\+?[\d\s().-]+$/.test(full)) return false;
  const digits = full.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

// ── Autosave (per flow) ──
const KEY = (id) => `xc-flow-${id}`;
const MAX_AGE = 1000 * 60 * 60 * 24 * 30;

export function loadSaved(id) {
  try {
    const raw = localStorage.getItem(KEY(id));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || !data.answers) return null;
    if (Date.now() - (data.ts || 0) > MAX_AGE) return null;
    return data;
  } catch {
    return null;
  }
}

export function save(id, answers, at) {
  try {
    localStorage.setItem(KEY(id), JSON.stringify({ v: 1, answers, at, ts: Date.now() }));
  } catch {
    /* storage full or blocked: the flow still works */
  }
}

export function clearSaved(id) {
  try {
    localStorage.removeItem(KEY(id));
  } catch {
    /* ignore */
  }
}

/** Letters used as option shortcuts. */
export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Open a link in a new tab (WhatsApp) or the same window (mailto). */
export function openExternal(url) {
  if (/^mailto:/.test(url)) {
    window.location.href = url;
    return;
  }
  // Not using the "noopener" feature: with it, window.open always returns null
  // and a blocked popup could not be told apart from an opened one.
  const w = window.open(url, '_blank');
  if (w) {
    try { w.opener = null; } catch { /* cross-origin */ }
  } else window.location.href = url;
}
