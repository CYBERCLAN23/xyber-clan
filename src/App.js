import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './cms.css';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CMSProvider } from './context/CMSContext';
import Snowfall from './components/Snowfall';
import FloatingSideController from './components/FloatingSideController';
import XyberClanWebsite from './xybersite';
import TeamPage from './TeamPage';
import PartnersPage from './PartnersPage';
import ProjectForm from './ProjectForm';
import CareerForm from './CareerForm';
import JourneyPage from './JourneyPage';
import EventsPage from './EventsPage';
import PortfolioPage from './PortfolioPage';
import PageTransition from './components/PageTransition';

// CMS Admin
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import { ADMIN_BASE } from './config/adminPath';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CMSProvider>
          <Snowfall />
          <FloatingSideController />
          <Router>
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
          </Router>
        </CMSProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;