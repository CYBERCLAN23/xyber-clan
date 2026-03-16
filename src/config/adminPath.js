/**
 * Admin Path Configuration — Security Through Obscurity + Firebase Auth
 *
 * The admin panel is hidden behind a secret hash URL.
 * Only people who know this URL can even SEE the login page.
 * Combined with Firebase Authentication, this creates a 2-layer defense:
 *   Layer 1: Secret URL (attacker can't find the login page)
 *   Layer 2: Firebase Auth (even if found, credentials are required)
 *
 * ⚠️  To change the secret path, update ADMIN_HASH below and redeploy.
 */

const ADMIN_HASH = '0dc5491709272c786c8364ab135188c1';

export const ADMIN_BASE = `/xypanel-${ADMIN_HASH}`;

/** Build a full admin sub-path, e.g. adminPath('login') → /xypanel-0dc…/login */
export const adminPath = (sub = '') => sub ? `${ADMIN_BASE}/${sub}` : ADMIN_BASE;

/** All CMS page routes — used by the toolbar page switcher */
export const ADMIN_PAGES = [
  { path: ADMIN_BASE,                     label: 'Home' },
  { path: `${ADMIN_BASE}/team`,           label: 'Team' },
  { path: `${ADMIN_BASE}/partners`,       label: 'Partners' },
  { path: `${ADMIN_BASE}/journey`,        label: 'Journey' },
  { path: `${ADMIN_BASE}/events`,         label: 'Events' },
  { path: `${ADMIN_BASE}/start-project`,  label: 'Start Project' },
];

export default ADMIN_BASE;
