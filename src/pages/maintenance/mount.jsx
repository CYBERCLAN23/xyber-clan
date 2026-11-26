import { createRoot, hydrateRoot } from 'react-dom/client';
import MaintenancePage from './MaintenancePage';

/** Hydrate the build-time copy when it is there, otherwise render (dev). */
export default function mountMaintenance(el) {
  if (el.querySelector('[data-mt-root]')) hydrateRoot(el, <MaintenancePage />);
  else createRoot(el).render(<MaintenancePage />);
}
