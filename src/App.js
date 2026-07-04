import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './cms.css';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CMSProvider } from './context/CMSContext';
import Snowfall from './components/Snowfall';
import FloatingSideController from './components/FloatingSideController';
import XyberClanWebsite from './xybersite';
import PageTransition from './components/PageTransition';
import { ADMIN_BASE } from './config/adminPath';

// Lazy-loaded routes — only loaded when navigated to (splits bundle into smaller chunks)
const TeamPage = lazy(() => import('./TeamPage'));
const PartnersPage = lazy(() => import('./PartnersPage'));
const ProjectForm = lazy(() => import('./ProjectForm'));
const CareerForm = lazy(() => import('./CareerForm'));
const JourneyPage = lazy(() => import('./JourneyPage'));
const EventsPage = lazy(() => import('./EventsPage'));
const PortfolioPage = lazy(() => import('./PortfolioPage'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

const PAGE_LOADER = (
  <div className="fixed inset-0 flex items-center justify-center bg-black z-[99999]">
    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CMSProvider>
          <Snowfall />
          <FloatingSideController />
          <Router>
            <Suspense fallback={PAGE_LOADER}>
              <Routes>
                {/* ═══ Public Routes ═══ */}
                <Route path="/" element={<PageTransition><XyberClanWebsite /></PageTransition>} />
                <Route path="/team" element={<PageTransition><TeamPage /></PageTransition>} />
                <Route path="/partners" element={<PageTransition><PartnersPage /></PageTransition>} />
                <Route path="/journey" element={<PageTransition><JourneyPage /></PageTransition>} />
                <Route path="/events" element={<PageTransition><EventsPage /></PageTransition>} />
                <Route path="/portfolio" element={<PageTransition><PortfolioPage /></PageTransition>} />
                <Route path="/start-project" element={<PageTransition><ProjectForm /></PageTransition>} />
                <Route path="/careers/community-manager" element={<PageTransition><CareerForm /></PageTransition>} />

                {/* ═══ CMS Admin Routes (secret hash URL) ═══ */}
                <Route path={ADMIN_BASE} element={<AdminLayout />}>
                  <Route path="login" element={<AdminLogin />} />
                  <Route index element={<XyberClanWebsite />} />
                  <Route path="team" element={<TeamPage />} />
                  <Route path="partners" element={<PartnersPage />} />
                  <Route path="journey" element={<JourneyPage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="portfolio" element={<PortfolioPage />} />
                  <Route path="start-project" element={<ProjectForm />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </CMSProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;