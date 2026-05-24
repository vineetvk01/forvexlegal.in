export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav">
          <div className="brand">Forvex Legal</div>
          <nav>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact" className="cta">Contact</a>
          </nav>
        </div>
      </header>

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

      <footer className="site-footer">
        <div className="container">
          <small>© {new Date().getFullYear()} Forvex Legal — All rights reserved.</small>
          <div className="foot-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
