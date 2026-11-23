import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Leads: every request sent from a flow is also stored in Firestore (`leads`),
 * so nothing is lost if WhatsApp or the mail app never opens.
 * Fields and limits mirror the `leads` rule in firestore.rules.
 */
export const LEAD_FLOWS = ['project', 'career', 'partnership'];
export const LEAD_STATUSES = ['new', 'contacted', 'won', 'lost'];

const LIMITS = {
  type: 40,
  name: 120,
  email: 160,
  phone: 40,
  company: 160,
  channel: 20,
  title: 200,
  services: 300,
  budget: 80,
  timeline: 80,
  details: 12000,
  lang: 5,
  page: 300,
};

const clip = (v, n) => String(v ?? '').trim().slice(0, n);

/**
 * saveLead('project', { name, email, phone, company, channel, title, services, budget, timeline, type,
 *                       details: [[label, value], …] })
 * Never throws. Resolves to { ok: true, id } or { ok: false, error }.
 */
export async function saveLead(flow, answers = {}) {
  try {
    if (!LEAD_FLOWS.includes(flow)) return { ok: false, error: 'unknown-flow' };
    const doc = { flow, status: 'new', createdAt: serverTimestamp() };

    Object.keys(LIMITS).forEach((key) => {
      if (key === 'details' || key === 'lang' || key === 'page') return;
      const value = clip(answers[key], LIMITS[key]);
      if (value) doc[key] = value;
    });

    // Every answer as [label, value] pairs, kept as one JSON string so the rules can cap its size.
    let pairs = Array.isArray(answers.details) ? answers.details : [];
    pairs = pairs
      .filter((p) => Array.isArray(p) && p.length >= 2)
      .slice(0, 60)
      .map(([label, value]) => [clip(label, 200), clip(value, 3000)]);
    let details = JSON.stringify(pairs);
    while (details.length > LIMITS.details && pairs.length) {
      pairs = pairs.slice(0, -1);
      details = JSON.stringify(pairs);
    }
    doc.details = details;

    let lang = 'en';
    let page = '';
    try {
      lang = clip(localStorage.getItem('xyber_lang') || document.documentElement.lang || 'en', LIMITS.lang);
    } catch {
      /* storage blocked */
    }
    try {
      page = clip(window.location.href, LIMITS.page);
    } catch {
      /* no window */
    }
    doc.lang = lang || 'en';
    doc.page = page;

    const write = addDoc(collection(db, 'leads'), doc).then((ref) => ({ ok: true, id: ref.id }));
    const timeout = new Promise((resolve) => setTimeout(() => resolve({ ok: false, error: 'timeout' }), 10000));
    return await Promise.race([write, timeout]).catch((error) => ({ ok: false, error: error?.code || String(error) }));
  } catch (error) {
    return { ok: false, error: error?.code || String(error) };
  }
}

/** Parse the stored `details` string back into [label, value] pairs. */
export function leadDetails(lead) {
  try {
    const parsed = JSON.parse(lead?.details || '[]');
    return Array.isArray(parsed) ? parsed.filter((p) => Array.isArray(p)) : [];
  } catch {
    return [];
  }
}
