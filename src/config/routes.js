/**
 * Every public address of the site. Anything else is a 404.
 * Shared by the router, the entry point and the build-time maintenance shell,
 * so the three always agree on what counts as a real page.
 */
export const PUBLIC_PATHS = [
  '/',
  '/team',
  '/partners',
  '/partners/apply',
  '/journey',
  '/events',
  '/portfolio',
  '/speakers',
  '/start-project',
  '/careers/community-manager',
  '/privacy',
  '/terms',
];

/** React Router matches case-insensitively and ignores a trailing slash; so do we. */
export const normalizePath = (p) => (String(p).replace(/\/+$/, '') || '/').toLowerCase();

export const isPublicPath = (p) => PUBLIC_PATHS.includes(normalizePath(p));
