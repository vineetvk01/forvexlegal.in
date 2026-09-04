import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import HomePage from './HomePage';
import CasesPage from './CasesPage';
import RegisterSessionsPage from './RegisterSessionsPage';

const CALENDLY_URL = 'https://calendly.com/cashikhargarg/30min';

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
  const isRegisterSessionsRoute = location.pathname.startsWith('/register-sessions');

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  function navigateHome(sectionId) {
    const scrollToTarget = () => {
      const target = sectionId ? document.getElementById(sectionId) : null;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(scrollToTarget, 80);
    } else {
      scrollToTarget();
    }

    setMobileOpen(false);
  }

  return (
    <div className={`app-shell ${isRegisterSessionsRoute ? 'register-shell' : ''}`}>
      {!isRegisterSessionsRoute && <header className={`site-header ${mobileOpen ? 'menu-open' : ''}`}>
        <div className="container nav">
          <button type="button" className="brand" onClick={() => navigateHome()}>
            <span>Forvex</span> <strong>Legal</strong>
          </button>
          <div className="nav-controls">
            <button
              className="menu-toggle"
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
            </button>
            <nav className={`nav-links ${mobileOpen ? 'open' : ''}`} aria-label="Primary navigation">
              <button type="button" className={location.pathname === '/' ? 'active' : ''} onClick={() => navigateHome()}>
                Home
              </button>
              <button type="button" onClick={() => navigateHome('about')}>
                About
              </button>
              <button type="button" onClick={() => navigateHome('practice')}>
                Practice Areas
              </button>
              <button type="button" onClick={() => navigateHome('founder')}>
                Founder
              </button>
              <button type="button" onClick={() => navigateHome('contact')}>
                Contact
              </button>
              <a className="nav-cta" href={CALENDLY_URL} target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)}>
                Book a Consultation
                <FiArrowRight aria-hidden="true" />
              </a>
            </nav>
          </div>
        </div>
      </header>}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/register-sessions" element={<RegisterSessionsPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
        </Routes>
      </main>

      {!isRegisterSessionsRoute && <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              Forvex <span>Legal</span>
            </div>
            <p>Boutique litigation and advisory practice in tax, regulatory and economic offence matters.</p>
          </div>
          <div>
            <h3>Navigate</h3>
            <button type="button" onClick={() => navigateHome()}>Home</button>
            <button type="button" onClick={() => navigateHome('about')}>About</button>
            <button type="button" onClick={() => navigateHome('practice')}>Practice Areas</button>
            <button type="button" onClick={() => navigateHome('founder')}>Founder</button>
            <button type="button" onClick={() => navigate('/cases')}>Cases</button>
            <button type="button" onClick={() => navigateHome('contact')}>Contact</button>
          </div>
          <div>
            <h3>Disclaimer</h3>
            <p>In compliance with the Bar Council of India Rules, this website is for general understanding only and does not constitute legal advice.</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <small>Copyright © Forvex Legal</small>
          <div className="foot-links">
            <button type="button" onClick={() => navigate('/privacy')}>Privacy Policy</button>
            <button type="button" onClick={() => navigate('/terms')}>Disclaimer</button>
          </div>
        </div>
      </footer>}
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
