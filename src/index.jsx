import './index.css';
import { MAINTENANCE_MODE } from './config/maintenance';
import { isPublicPath } from './config/routes';

// During maintenance, real pages load only the small maintenance bundle (and
// hydrate the copy pre-rendered into index.html). Everything else, including
// unknown addresses (404) and the CMS admin, loads the full site.
const el = document.getElementById('root');

if (MAINTENANCE_MODE && isPublicPath(window.location.pathname)) {
  import('./pages/maintenance/mount').then((m) => m.default(el));
} else {
  import('./AppRoot').then((m) => m.default(el));
}
