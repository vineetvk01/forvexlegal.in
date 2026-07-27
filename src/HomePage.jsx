import { useState } from 'react';

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  if (submitted) {
    return <div className="card">Thanks — we'll email you when access opens.</div>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      <input
        aria-label="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid rgba(15,23,42,0.08)', width: '320px', maxWidth: '100%' }}
      />
      <button className="btn cta" style={{ marginLeft: 8 }}>
        Notify me
      </button>
    </form>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Trusted legal counsel for modern businesses</h1>
          <p className="lead">Commercial contracts, compliance, and corporate governance — pragmatic advice tailored to startups and enterprises.</p>
          <p>
            <a className="btn primary" href="mailto:hello@forvexlegal.com">Get a consultation</a>
            <a className="btn ghost" href="#services">Our services</a>
            <a className="btn ghost" href="/cases">View cases</a>
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
        <WaitlistForm />
      </section>
    </>
  );
}
