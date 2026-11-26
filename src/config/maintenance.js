/**
 * Maintenance mode.
 *
 * While on, every public URL shows the maintenance page (Moshi at work).
 * The secret CMS admin path keeps working so the team can still edit content.
 *
 * Turn it off by setting VITE_MAINTENANCE=off in the build environment
 * (Vercel → Settings → Environment Variables) and redeploying, or by
 * flipping the default below.
 */
const flag = String(import.meta.env.VITE_MAINTENANCE ?? 'on').toLowerCase();

export const MAINTENANCE_MODE = !['off', 'false', '0', 'no'].includes(flag);

export default MAINTENANCE_MODE;
