import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './cms.css';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CMSProvider } from './context/CMSContext';
import Snowfall from './components/Snowfall';
import XyberClanWebsite from './xybersite';
import TeamPage from './TeamPage';
import PartnersPage from './PartnersPage';
import ProjectForm from './ProjectForm';
import JourneyPage from './JourneyPage';
import EventsPage from './EventsPage';

// CMS Admin
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CMSProvider>
          <Snowfall />
          <Router>
            <Routes>
              {/* ═══ Public Routes ═══ */}
              <Route path="/" element={<XyberClanWebsite />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/journey" element={<JourneyPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/start-project" element={<ProjectForm />} />

              {/* ═══ CMS Admin Routes ═══ */}
              <Route path="/admin" element={<AdminLayout />}>
                {/* Admin login (public, no auth required) */}
                <Route path="login" element={<AdminLogin />} />
                {/* Admin pages mirror public pages with CMS enabled */}
                <Route index element={<XyberClanWebsite />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="partners" element={<PartnersPage />} />
                <Route path="journey" element={<JourneyPage />} />
                <Route path="events" element={<EventsPage />} />
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