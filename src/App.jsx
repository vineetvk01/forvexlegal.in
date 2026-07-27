import { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import CasesPage from './CasesPage';

function PrivacyPolicy() {
  return (
    <section className="page-section container">
      <h2>Privacy Policy</h2>
      <p>At Forvex Legal, your privacy is a priority. We only collect the data necessary to respond to inquiries and provide our services.</p>
      <h3>Information we collect</h3>
      <ul>
        <li>Contact details submitted through our inquiry form or email.</li>
        <li>Cookies used to maintain basic session and site functionality.</li>
      </ul>
      <h3>How we use information</h3>
      <p>We use your information to communicate with you, deliver requested legal resources, and improve the website experience.</p>
      <h3>Data security</h3>
      <p>We take reasonable measures to protect your personal data and restrict access to authorized personnel only.</p>
      <h3>Third parties</h3>
      <p>We do not sell personal data. We may share information with trusted service providers only when required for site operation or customer communications.</p>
    </section>
  );
}

function TermsConditions() {
  return (
    <section className="page-section container">
      <h2>Terms & Conditions</h2>
      <p>These terms govern your access to the Forvex Legal website and the use of any content, materials, and services provided here.</p>
      <h3>Use of site</h3>
      <p>You may use this site for informational purposes only. Nothing on this website constitutes legal advice.</p>
      <h3>Intellectual property</h3>
      <p>All content on this site is the property of Forvex Legal and may not be copied or distributed without permission.</p>
      <h3>Disclaimer</h3>
      <p>We provide no guarantees regarding the accuracy, completeness, or applicability of information on this site. Consult qualified counsel before relying on any content here.</p>
      <h3>Limitation of liability</h3>
      <p>Forvex Legal is not liable for any damages arising from the use of the website or reliance on its content.</p>
    </section>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav">
          <div className="brand">Forvex Legal</div>
          <div className="nav-controls">
            <button
              className="menu-toggle"
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
            <nav className={`nav-links ${mobileOpen ? 'open' : ''}`}>
              <button type="button" className={location.pathname === '/' ? 'active' : ''} onClick={() => { navigate('/'); setMobileOpen(false); }}>
                Home
              </button>
              <button type="button" className={location.pathname === '/privacy' ? 'active' : ''} onClick={() => { navigate('/privacy'); setMobileOpen(false); }}>
                Privacy Policy
              </button>
              <button type="button" className={location.pathname === '/terms' ? 'active' : ''} onClick={() => { navigate('/terms'); setMobileOpen(false); }}>
                Terms & Conditions
              </button>
            </nav>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
      </Routes>

      <footer className="site-footer">
        <div className="container">
          <small>© {new Date().getFullYear()} Forvex Legal — All rights reserved.</small>
          <div className="foot-links">
            <button type="button" onClick={() => navigate('/privacy')}>
              Privacy
            </button>
            <button type="button" onClick={() => navigate('/terms')}>
              Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
