import { useMemo, useState } from 'react';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import { FaWhatsappSquare } from "react-icons/fa";

const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSexYF_CHDABS3Df0pTpL_vBF7CupIrE4jbT-LOw0h4EGrzBHQ/formResponse';
const GOOGLE_FORM_ENTRY_IDS = {
  name: 'entry.1073527440',
  email: 'entry.570671403',
  phone: 'entry.1725915021',
};

function getErrors(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (name.length < 2) {
    errors.name = 'Enter your full name.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!/^[6-9]\d{9}$/.test(values.phone)) {
    errors.phone = 'Enter a valid 10 digit Indian mobile number.';
  }

  return errors;
}

export default function RegisterSessionsPage() {
  const [values, setValues] = useState({ name: '', email: '', phone: '' });
  const [submittedValues, setSubmittedValues] = useState({ name: '', email: '', phone: '' });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [redirectSeconds, setRedirectSeconds] = useState(-1);
  const errors = useMemo(() => getErrors(values), [values]);
  const isValid = Object.keys(errors).length === 0;
  const isSubmitting = status === 'submitting';
  const successTimeLabel = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const whatsappUrl = 'https://chat.whatsapp.com/BFB4i4KvhqD2SqKRvZxgfF?mode=gi_t';

  function updateValue(field, value) {
    setStatus('idle');
    setMessage('');
    setValues((current) => ({
      ...current,
      [field]: field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value,
    }));
  }

  function markTouched(field) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setTouched({ name: true, email: true, phone: true });

    if (!isValid) {
      return;
    }

    const formData = new FormData();
    formData.append(GOOGLE_FORM_ENTRY_IDS.name, values.name.trim());
    formData.append(GOOGLE_FORM_ENTRY_IDS.email, values.email.trim());
    formData.append(GOOGLE_FORM_ENTRY_IDS.phone, `+91${values.phone}`);

    setStatus('submitting');
    setMessage('');
    setRedirectSeconds(0);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      setStatus('success');
      setMessage('Thank you! We will send you the webinar link 2 hours before the scheduled time.');
      setSubmittedValues({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone,
      });
      setValues({ name: '', email: '', phone: '' });
      setTouched({});

      let remaining = 5;
      setRedirectSeconds(remaining);
      const timer = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(timer);
          setRedirectSeconds(0);
          window.location.href = whatsappUrl;
          return;
        }
        setRedirectSeconds(remaining);
      }, 1000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Submission failed. Please check your details and try again.');
    }
  }

  return (
    <div className="register-page">
      {status !== 'success' && (
        <section className="register-content-panel" aria-labelledby="session-title">
          <div className="register-content">
            <h1 id="session-title">30 Minutes Covering 30 Days - IT, GST & Litigations</h1>
            <p className="register-author">By Adv. (CA) Shikhar Garg</p>
            <img className="register-session-image" src="/assets/session-discussion-banner.png" alt="Monthly discussion session for practising CAs" />
            <div className="register-description">
              <p>A Strict 30 Mins Session - First Thursday of every month at 6 PM.</p>
              <p>A session where the</p>
              <p>a) New case laws,</p>
              <p>b) amendments and</p>
              <p>c) new Guidelines</p>
              <p>in the Income Tax Act, GST and Litigations are discussed.</p>
              <p>Along with some Bonus Tips useful in practical life.</p>
            </div>
          </div>
          <footer className="register-footer">
            <span>Adv. (CA) Shikhar Garg</span>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </footer>
        </section>
      )}

      <section className="register-form-panel" aria-labelledby="registration-title">
        {status === 'success' ? (
          <div className="register-success-wrap">
            <div className="register-success-top">
              <div className="success-check-ring" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" aria-label="Success">
                  <path d="M9.55 15.15 6.4 12l-1.4 1.4 4.55 4.55 9.6-9.6-1.4-1.4z" fill="currentColor" />
                </svg>
              </div>
              <h2 style={{ fontSize: "24px" }}>Registration Successful</h2>
              <div className="success-amount">
                <span>₹</span> 0
              </div>
            </div>

            <div className="register-success-receipt">
              <div className="receipt-row">
                <span>Email ID for Registration</span>
                <div className="transaction-box">
                  <span>{submittedValues.email}</span>
                  <button type="button" aria-label="Copy transaction ID">⧉</button>
                </div>
              </div>

              <div className="receipt-row service-row">
                <span>Service</span>
                <strong>30 Minutes Covering 30 Days - IT, GST & Litigations</strong>
              </div>

              <div className="receipt-grid">
                <div>
                  <span>Registration Method</span>
                  <strong>Free Registration</strong>
                </div>
                <div>
                  <span>Registration Time</span>
                  <strong>{successTimeLabel}</strong>
                </div>
              </div>
            </div>

            <div className="billing-card">
              <h3>Billing Details</h3>
              <div className="billing-details">
                <strong>{submittedValues.name || 'Your Name'}</strong>
                <span>{submittedValues.email || 'your@email.com'}</span>
                <span>{submittedValues.phone ? `+91 ${submittedValues.phone}` : '+91 9876543210'}</span>
              </div>
            </div>

            <div className="join-card">
              <h3>Click Below to join</h3>
              <a className="join-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Join WhatsApp group">
                <span className="whatsapp-icon" aria-hidden="true">
                  <FaWhatsappSquare />
                </span>
              </a>
              <a className="join-button" href={whatsappUrl} target="_blank" rel="noreferrer">
                <span aria-hidden="true">◫</span> Join Here
              </a>
            </div>

            <p className="register-message success">
              <FiCheckCircle aria-hidden="true" />
              {message}
            </p>
            {redirectSeconds >= 0 && (
              <div className="register-redirect-message">
                Redirecting to WhatsApp Group in {redirectSeconds}s...
              </div>
            )}
          </div>
        ) : (
          <div className="register-form-wrap">
            <h2 id="registration-title">Registration details</h2>
            <p>Complete your registration by providing these details.</p>

            <form className="register-form" onSubmit={handleSubmit} noValidate>
              <fieldset className="register-fieldset">
                <legend>Registration information</legend>
                <div className={`register-input-wrap ${touched.name && errors.name ? 'has-error' : ''}`}>
                  <label htmlFor="session-name">Name</label>
                  <input
                    id="session-name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onBlur={() => markTouched('name')}
                    onChange={(event) => updateValue('name', event.target.value)}
                    placeholder="Name"
                  />
                </div>
                {touched.name && errors.name && <span className="register-error">{errors.name}</span>}

                <div className={`register-input-wrap ${touched.email && errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="session-email">Email</label>
                  <input
                    id="session-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onBlur={() => markTouched('email')}
                    onChange={(event) => updateValue('email', event.target.value)}
                    placeholder="Email"
                  />
                </div>
                {touched.email && errors.email && <span className="register-error">{errors.email}</span>}

                <div className={`register-input-wrap phone-wrap ${touched.phone && errors.phone ? 'has-error' : ''}`}>
                  <label htmlFor="session-phone">Phone</label>
                  <div className="register-phone-code" aria-hidden="true">
                    <span className="india-flag" />
                    <span>+91</span>
                    <span className="code-caret" />
                  </div>
                  <input
                    id="session-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={values.phone}
                    onBlur={() => markTouched('phone')}
                    onChange={(event) => updateValue('phone', event.target.value)}
                    placeholder="Phone"
                  />
                </div>
                {touched.phone && errors.phone && <span className="register-error">{errors.phone}</span>}
              </fieldset>

              <button className="register-submit" type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <FiLoader aria-hidden="true" />
                    Registering...
                  </>
                ) : (
                  'Register Now'
                )}
              </button>
              {message && (
                <>
                  <p className={`register-message ${status}`}>
                    {status === 'success' && <FiCheckCircle aria-hidden="true" />}
                    {message}
                  </p>
                  {status === 'success' && redirectSeconds >= 0 && (
                    <span className={`register-message ${status}`} style={{ display: 'block', marginTop: '0.5rem', fontWeight: 600 }}>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Click to join our whatsapp group for discussion and updates</a>
                      <br />
                      Redirecting to WhatsApp Group in {redirectSeconds}s...
                    </span>
                  )}
                </>
              )}
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
