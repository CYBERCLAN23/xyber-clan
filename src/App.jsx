import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './cms.css';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CMSProvider } from './context/CMSContext';
import { SmoothScroll } from './lib/SmoothScroll';
import Snowfall from './components/Snowfall';
import Preloader from './components/site/Preloader';
import Cursor from './components/site/Cursor';
import HomePage from './pages/home/HomePage';
import { ADMIN_BASE } from './config/adminPath';
import { MAINTENANCE_MODE } from './config/maintenance';
import { PUBLIC_PATHS } from './config/routes';
import MaintenancePage from './pages/maintenance/MaintenancePage';

// Routes load on demand.
const TeamPage = lazy(() => import('./pages/team/TeamPage'));
const PartnersPage = lazy(() => import('./pages/partners/PartnersPage'));
const JourneyPage = lazy(() => import('./pages/journey/JourneyPage'));
const EventsPage = lazy(() => import('./pages/events/EventsPage'));
const PortfolioPage = lazy(() => import('./pages/portfolio/PortfolioPage'));
const SpeakersPage = lazy(() => import('./pages/speakers/SpeakersPage'));
const ProjectFlow = lazy(() => import('./pages/flows/ProjectFlow'));
const CareerFlow = lazy(() => import('./pages/flows/CareerFlow'));
const PartnershipFlow = lazy(() => import('./pages/flows/PartnershipFlow'));
const PrivacyPage = lazy(() => import('./pages/LegalPages').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/LegalPages').then((m) => ({ default: m.TermsPage })));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const LeadsInbox = lazy(() => import('./pages/admin/LeadsInbox'));

// The page component for each public address (the list itself lives in config/routes).
const PAGES = {
  '/': HomePage,
  '/team': TeamPage,
  '/partners': PartnersPage,
  '/partners/apply': PartnershipFlow,
  '/journey': JourneyPage,
  '/events': EventsPage,
  '/portfolio': PortfolioPage,
  '/speakers': SpeakersPage,
  '/start-project': ProjectFlow,
  '/careers/community-manager': CareerFlow,
  '/privacy': PrivacyPage,
  '/terms': TermsPage,
};

const PAGE_LOADER = <div className="min-h-screen bg-paper" aria-busy="true" />;

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CMSProvider>
          <Router>
            <SmoothScroll>
              {!MAINTENANCE_MODE && <Preloader />}
              <Cursor />
              <Snowfall />
              <Suspense fallback={PAGE_LOADER}>
                <Routes>
                  {/* Public pages. While MAINTENANCE_MODE is on, each real page shows the
                      maintenance page instead; any address that is not a page shows the 404. */}
                  {PUBLIC_PATHS.map((path) => {
                    const Page = PAGES[path];
                    return <Route key={path} path={path} element={MAINTENANCE_MODE ? <MaintenancePage /> : <Page />} />;
                  })}
                  <Route path="*" element={<NotFound />} />

                  {/* CMS admin (secret path) */}
                  <Route path={ADMIN_BASE} element={<AdminLayout />}>
                    <Route path="login" element={<AdminLogin />} />
                    <Route index element={<HomePage />} />
                    <Route path="team" element={<TeamPage />} />
                    <Route path="partners" element={<PartnersPage />} />
                    <Route path="journey" element={<JourneyPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="portfolio" element={<PortfolioPage />} />
                    <Route path="start-project" element={<ProjectFlow />} />
                    <Route path="leads" element={<LeadsInbox />} />
                  </Route>
                </Routes>
              </Suspense>
            </SmoothScroll>
          </Router>
        </CMSProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
