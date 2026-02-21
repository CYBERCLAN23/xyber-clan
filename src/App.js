import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Snowfall from './components/Snowfall';
import XyberClanWebsite from './xybersite';
import TeamPage from './TeamPage';
import PartnersPage from './PartnersPage';
import ProjectForm from './ProjectForm';
import JourneyPage from './JourneyPage';

function App() {
  return (
    <ThemeProvider>
      <Snowfall />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<XyberClanWebsite />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/start-project" element={<ProjectForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;