// Values the old Events page hardcoded, plus the date facts needed to split
// upcoming from past. The articles themselves stay in translations.js
// (eventsPage.articles) in the same order, because their CMS keys are index based:
// `${lang}.eventsPage.article${idx}.*`.

/** Old hero background (a conference audience); now the picture beside the call to speak or partner. */
export const HERO_BG = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop';

/** Crop used when an article has no objectPosition (old card default). */
export const DEFAULT_OBJECT_POSITION = 'center 20%';

/** Where the calls to take part lead. */
export const PARTNER_ROUTE = '/partners/apply';
export const SPEAKERS_ROUTE = '/speakers';

/**
 * Machine-readable dates by article id, so the page can tell upcoming from past
 * and sort the archive newest first. Taken from each article's own date, or from
 * the matching Journey milestone where the article only says "Recent"/"Previous"
 * (GDG DevFest Nov 2024, GBV hackathon Dec 2024, Paul Arsène and ICT4D Jan 2025).
 * Articles with no known date (ids 1, 2, 4, 6) count as past and sort last.
 * A new event: add its article to translations.js and its ISO date here
 * ("YYYY-MM-DD", or "YYYY-MM" when only the month is known).
 */
export const EVENT_DATES = {
  12: '2026-07-10',
  11: '2026-06',
  9: '2026-02',
  8: '2026-02-25',
  7: '2024-12',
  5: '2024-11',
  10: '2025-01',
  3: '2025-01',
};

/**
 * Picture replacements by language and article id. The English PawaPay article
 * used an unrelated stock photo while the French one had the real photo of the
 * event; both now show the real one.
 */
export const IMAGE_FIX = {
  en: { 11: '/images/events/pawapay.jpg' },
  fr: {},
};

/** Old remote pictures kept as in translations.js (for reference when replacing them):
 *  EN PawaPay stock https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop
 */

/** Start of the event's day (or month) as a Date, or null when unknown. */
export function eventStart(id) {
  const iso = EVENT_DATES[id];
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** End of the event's day (or month): an event is past once this moment has gone. */
export function eventEnd(id) {
  const iso = EVENT_DATES[id];
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return d ? new Date(y, m - 1, d, 23, 59, 59) : new Date(y, m, 0, 23, 59, 59);
}

export const isUpcoming = (id, now = new Date()) => {
  const end = eventEnd(id);
  return Boolean(end && end >= now);
};

/** Google Calendar "add event" link for a dated event (all-day). */
export function calendarLink(id, title, details) {
  const iso = EVENT_DATES[id];
  if (!iso || iso.length < 10) return null;
  const start = iso.replace(/-/g, '');
  const next = eventStart(id);
  next.setDate(next.getDate() + 1);
  const end = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, '0')}${String(next.getDate()).padStart(2, '0')}`;
  const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${start}/${end}`, details: details || '' });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}
