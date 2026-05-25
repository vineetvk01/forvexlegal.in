import { useEffect, useState } from 'react';

const pages = {
  home: 'Home',
  privacy: 'Privacy Policy',
  terms: 'Terms & Conditions',
};

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Trusted legal counsel for modern businesses</h1>
          <p className="lead">Commercial contracts, compliance, and corporate governance — pragmatic advice tailored to startups and enterprises.</p>
          <p>
            <a className="btn primary" href="mailto:hello@forvexlegal.com">Get a consultation</a>
            <a className="btn ghost" href="#services">Our services</a>
          </p>
        </div>
      </section>

      <section id="services" className="services container">
        <h2>Our Services</h2>
        <div className="cards">
          <article className="card">
            <h3>Commercial Contracts</h3>
            <p>Drafting and negotiating vendor, SaaS, and partnership agreements.</p>
          </article>
          <article className="card">
            <h3>Compliance & Privacy</h3>
            <p>GDPR, data processing agreements, and privacy policies.</p>
          </article>
          <article className="card">
            <h3>Corporate Advisory</h3>
            <p>Entity formation, shareholder agreements, and governance.</p>
          </article>
        </div>
      </section>

      <section id="about" className="about container">
        <h2>About Forvex Legal</h2>
        <p>We combine commercial sense with clear legal drafting to help you move faster and reduce risk.</p>
      </section>

      <section id="contact" className="contact container">
        <h2>Contact</h2>
        <p>Email us at <a href="mailto:hello@forvexlegal.com">hello@forvexlegal.com</a> or call <strong>+91 (901) 326-5820</strong>.</p>
      </section>
    </>
  );
}

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

export default function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && Object.keys(pages).includes(hash)) {
      setPage(hash);
    }
  }, []);

  useEffect(() => {
    window.location.hash = page === 'home' ? '' : page;
  }, [page]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav">
          <div className="brand">Forvex Legal</div>
          <nav>
            <button type="button" className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}>
              Home
            </button>
            <button type="button" className={page === 'privacy' ? 'active' : ''} onClick={() => setPage('privacy')}>
              Privacy Policy
            </button>
            <button type="button" className={page === 'terms' ? 'active' : ''} onClick={() => setPage('terms')}>
              Terms & Conditions
            </button>
          </nav>
        </div>
      </header>

      {page === 'home' && <HomePage />}
      {page === 'privacy' && <PrivacyPolicy />}
      {page === 'terms' && <TermsConditions />}

      <footer className="site-footer">
        <div className="container">
          <small>© {new Date().getFullYear()} Forvex Legal — All rights reserved.</small>
          <div className="foot-links">
            <button type="button" onClick={() => setPage('privacy')}>Privacy</button>
            <button type="button" onClick={() => setPage('terms')}>Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
