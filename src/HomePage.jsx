import {
  FiArrowRight,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiFileText,
  FiHome,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiTarget,
  FiUserCheck,
} from 'react-icons/fi';

const CALENDLY_URL = 'https://calendly.com/cashikhargarg/30min';

const practiceAreas = [
  ['Income Tax Litigation', 'Assessments, reassessments and appeals before CIT(A), ITAT and the High Court.'],
  ['GST Litigation', 'Show cause notices, classification, ITC denial and departmental adjudication.'],
  ['PMLA', 'Attachment, adjudication and representation in money laundering proceedings.'],
  ['Economic Offences', 'Advisory and defence in offences investigated by specialised agencies.'],
  ['FEMA', 'Contraventions, compounding and enforcement proceedings under exchange control law.'],
  ['Benami Law', 'Provisional attachment, adjudication and appellate remedies.'],
  ['White Collar Crime', 'Strategy, documentation review and defence in commercial fraud matters.'],
  ['Search & Seizure', 'Handling of search operations, statements, retractions and consequential assessments.'],
  ['Customs', 'Valuation, classification, penalty and SCN proceedings.'],
  ['Regulatory Litigation', 'Proceedings before sectoral regulators and adjudicating authorities.'],
];

const strengths = [
  ['Specialist Litigation Practice', 'A focused practice built around tax, regulatory and economic offence disputes rather than general legal services.', FiHome],
  ['Strategic Legal Advice', 'Counsel that considers forum, timeline and downstream exposure before the first submission is filed.', FiCompass],
  ['High Courts & Tribunals', 'Regular representation before ITAT, appellate authorities and the Delhi High Court.', FiBriefcase],
  ['Practical Commercial Understanding', 'Advice informed by corporate finance experience, framed around business consequences.', FiTarget],
  ['Personal Attention', 'Every matter is handled directly by the founder, with no layers between client and counsel.', FiUserCheck],
  ['Research Driven Advocacy', 'Positions built on primary record, statutory construction and current jurisprudence.', FiBookOpen],
];

const matters = [
  ['Successful Income Tax Litigation', 'Additions under scrutiny assessment deleted in appeal on the strength of documentary reconciliation and settled precedent.'],
  ['GST Dispute Resolution', 'Input tax credit denial dropped at adjudication after establishing supplier compliance and receipt of goods.'],
  ['Reassessment Proceedings', 'Notices challenged on jurisdictional grounds, with proceedings closed at the threshold stage.'],
  ['PMLA Advisory', 'Advisory and representation strategy structured for a promoter group facing attachment proceedings.'],
  ['High Court Representation', 'Writ remedies pursued where statutory appellate routes were inadequate or time-barred.'],
];

function CalendlyScheduler() {
  return (
    <div className="calendly-panel">
      <iframe
        title="Schedule a consultation with Forvex Legal"
        src={`${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=c8a865`}
        loading="lazy"
      />
      <p>
        Having trouble loading the scheduler?{' '}
        <a href={CALENDLY_URL} target="_blank" rel="noreferrer">Open Calendly</a>
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="landing-page">
      <section className="legal-hero" id="home">
        <div className="container hero-inner">
          <p className="eyebrow">Boutique Litigation & Advisory - Delhi</p>
          <h1>
            Strategic Litigation.
            <span>Practical Solutions.</span>
          </h1>
          <p className="hero-copy">
            A boutique litigation practice representing clients in complex tax, regulatory and economic offence matters before Tribunals, High Courts and other adjudicating authorities.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href={CALENDLY_URL} target="_blank" rel="noreferrer">
              Book a Consultation
              <FiArrowRight aria-hidden="true" />
            </a>
            <a className="btn secondary" href="/register-sessions">
              Register Session
            </a>
            <a className="btn secondary" href="#practice">View Practice Areas</a>
          </div>
          <div className="hero-metrics" aria-label="Practice highlights">
            <div>
              <strong>ITAT</strong>
              <span>Tribunal practice</span>
            </div>
            <div>
              <strong>Delhi HC</strong>
              <span>Writ representation</span>
            </div>
            <div>
              <strong>CA + CPA</strong>
              <span>Financial fluency</span>
            </div>
            <div>
              <strong>ICAI</strong>
              <span>Regular speaker</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section split-section" id="about">
        <div className="container two-column">
          <div>
            <p className="eyebrow">About The Firm</p>
            <h2>Counsel for professionals advising on high-stakes matters.</h2>
          </div>
          <div className="section-copy">
            <p>Forvex Legal is a founder-led litigation and advisory practice built for chartered accountants, company secretaries, tax professionals, CFOs, promoters, family offices and businesses navigating adversarial proceedings.</p>
            <p>Our work sits at the intersection of tax, financial regulation and economic offence law, where an accurate reading of the record matters as much as the legal argument.</p>
            <p>We work alongside your existing advisors rather than displacing them, contributing litigation strategy, drafting and representation where the matter demands it.</p>
          </div>
        </div>
      </section>

      <section className="section muted-section" id="practice">
        <div className="container">
          <p className="eyebrow">Practice Areas</p>
          <h2>Where we appear</h2>
          <p className="section-intro">Focused domains of adversarial practice, from departmental adjudication to appellate and writ proceedings.</p>
          <div className="practice-grid">
            {practiceAreas.map(([title, description], index) => (
              <article className="practice-card" key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
            <div className="practice-card empty" aria-hidden="true" />
            <div className="practice-card empty" aria-hidden="true" />
          </div>
          <p className="expansion-note">Expanding into Civil, Commercial and Criminal Litigation.</p>
        </div>
      </section>

      <section className="section engagement-section">
        <div className="container">
          <p className="eyebrow">Why Forvex Legal</p>
          <h2>A boutique standard of engagement</h2>
          <div className="engagement-grid">
            {strengths.map(([title, description, Icon]) => (
              <article className="engagement-card" key={title}>
                <span className="icon-box"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="founder-section" id="founder">
        <div className="container founder-layout">
          <div className="founder-frame">
            <img src="/assets/founder-image.png" alt="Advocate Shikhar Garg" />
          </div>
          <div className="founder-copy">
            <p className="eyebrow">Meet The Founder</p>
            <h2>Adv. (CA) Shikhar Garg</h2>
            <div className="credential-row">
              <span>Advocate</span>
              <span>Chartered Accountant</span>
              <span>US CPA</span>
              <span>LL.B.</span>
            </div>
            <p>Shikhar Garg is a Chartered Accountant and Advocate, additionally qualified as a US CPA and holding an LL.B. He founded Forvex Legal to bring an accountant's command of the financial record together with litigation strategy before tax, regulatory and economic offence forums.</p>
            <p>He began his career in corporate finance at Bharat Petroleum Corporation Limited, where he worked on statutory compliance, audit and financial reporting for a large public sector enterprise.</p>
            <p>In practice, he has advised and appeared in matters involving assessments, reassessments, search-related proceedings and appeals, with appearances before the Income Tax Appellate Tribunal and the Delhi High Court.</p>
          </div>
        </div>
      </section>

      <section className="section matters-section">
        <div className="container">
          <p className="eyebrow">Case Highlights</p>
          <h2>Representative matters</h2>
          <p className="section-intro">Illustrative engagements, described without client identification.</p>
          <div className="matter-timeline">
            {matters.map(([title, description], index) => (
              <article className="matter-item" key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section consultation-section" id="consultation">
        <div className="container consultation-layout">
          <div>
            <p className="eyebrow">Book A Consultation</p>
            <h2>Discuss your matter in confidence</h2>
            <p className="section-intro">Choose an available 30-minute slot on Calendly for a focused first discussion. Keep the proceeding forum, notice date and urgent statutory timelines ready for the call.</p>
            <ul className="consultation-points">
              <li><FiFileText aria-hidden="true" />Notice and order review</li>
              <li><FiShield aria-hidden="true" />Forum and remedy assessment</li>
              <li><FiCheckCircle aria-hidden="true" />Direct Calendly scheduling</li>
            </ul>
          </div>
          <CalendlyScheduler />
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container contact-layout">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Forvex Legal</h2>
            <ul className="contact-list">
              <li>
                <FiMapPin aria-hidden="true" />
                <span><strong>Office</strong>D-108, Vivek Vihar<br />Delhi - 110095</span>
              </li>
              <li>
                <FiPhone aria-hidden="true" />
                <span><strong>Phone</strong><a href="tel:+919013265820">+91 9013265820</a></span>
              </li>
              <li>
                <FiMail aria-hidden="true" />
                <span><strong>Email</strong><a href="mailto:contact@forvexlegal.in">contact@forvexlegal.in</a></span>
              </li>
              <li>
                <FiClock aria-hidden="true" />
                <span><strong>Office Hours</strong>Monday - Saturday: 10:00 AM - 7:00 PM<br />Sunday - By prior appointment</span>
              </li>
            </ul>
          </div>
          <a className="map-preview" href="https://www.google.com/maps/search/?api=1&query=D-108%2C%20Vivek%20Vihar%2C%20Delhi%20110095" target="_blank" rel="noreferrer">
            <img src="/assets/map-preview.jpg" alt="Map showing Vivek Vihar, Delhi" />
          </a>
        </div>
      </section>
    </div>
  );
}
