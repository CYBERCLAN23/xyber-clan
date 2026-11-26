import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/** The full site (router, CMS, every page). */
export default function mountApp(el) {
  createRoot(el).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
