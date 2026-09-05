import { useMemo, useState } from 'react';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';

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
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const errors = useMemo(() => getErrors(values), [values]);
  const isValid = Object.keys(errors).length === 0;
  const isSubmitting = status === 'submitting';

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

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      setStatus('success');
      setMessage('Thank you! Your information has been received.');
      setValues({ name: '', email: '', phone: '' });
      setTouched({});
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Submission failed. Please check your details and try again.');
    }
  }

  return (
    <div className="register-page">
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

      <section className="register-form-panel" aria-labelledby="registration-title">
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
              <p className={`register-message ${status}`}>
                {status === 'success' && <FiCheckCircle aria-hidden="true" />}
                {message}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
