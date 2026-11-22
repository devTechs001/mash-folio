import { useState } from 'react';
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMapPin,
  FiSend,
} from 'react-icons/fi';
import SocialLinks, { getSocialIcon } from '../components/SocialLinks';
import { useContent } from '../context/ContentContext';
import { useScrollReveal } from '../utils/useScrollReveal';
import { addMessage } from '../utils/messages';
import '../styles/Contact.css';

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Please tell me your name.';
  else if (values.name.trim().length < 2) errors.name = 'That name looks a little short.';

  if (!values.email.trim()) errors.email = 'An email address is required.';
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = 'That email address doesn’t look right.';

  if (!values.message.trim()) errors.message = 'Don’t forget the message.';
  else if (values.message.trim().length < 20)
    errors.message = 'A little more detail helps — 20 characters at least.';

  return errors;
}

function Field({ name, label, error, hint, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && (
        <span className="field-error" id={`${name}-error`}>
          <FiAlertCircle aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  );
}

export default function Contact() {
  const { profile } = useContent();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const revealRef = useScrollReveal();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      document.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }

    setStatus('sending');

    // ── Integration point ────────────────────────────────────────────────
    // This is a front-end demo: nothing is sent anywhere. Replace the timeout
    // below with a real request, e.g.
    //   await fetch('https://formspree.io/f/your-id', { method: 'POST', body: ... })
    // or EmailJS / your own API endpoint.
    await new Promise((resolve) => {
      setTimeout(resolve, 1200);
    });

    // Store locally so the owner can read it in /admin/messages.
    addMessage(form);

    setStatus('sent');
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setStatus('idle');
  };

  const inputProps = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange: handleChange,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <div className="page contact-page" ref={revealRef}>
      <div className="container">
        <header className="page-head">
          <span className="eyebrow reveal">Contact</span>
          <h1 className="title reveal">
            Let&apos;s build <span className="accent">something</span>
          </h1>
          <p className="reveal">
            Have a project, a question, or just a good idea? Tell me the rough shape of it and
            I&apos;ll come back with honest thoughts — and a plan if it&apos;s a fit.
          </p>
        </header>

        <div className="contact-grid">
          <aside className="contact-aside reveal">
            <h2>Tell me what you&apos;re working on.</h2>
            <p>
              I take on a handful of projects at a time so each one gets real attention. Share
              a little context and I&apos;ll reply within one business day.
            </p>

            <ul className="contact-cards">
              <li className="contact-card">
                <span className="contact-card-icon">
                  <FiMail aria-hidden="true" />
                </span>
                <div>
                  <span className="contact-card-label">Email</span>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </div>
              </li>

              <li className="contact-card">
                <span className="contact-card-icon">
                  <FiMapPin aria-hidden="true" />
                </span>
                <div>
                  <span className="contact-card-label">Location</span>
                  <span>{profile.location} · UTC+3</span>
                </div>
              </li>

              <li className="contact-card">
                <span className="contact-card-icon">
                  <FiClock aria-hidden="true" />
                </span>
                <div>
                  <span className="contact-card-label">Availability</span>
                  <span>{profile.availability}</span>
                </div>
              </li>
            </ul>

            <div className="contact-socials">
              <span>Or find me on</span>
              <SocialLinks links={profile.socials} />
            </div>
          </aside>

          <div className="contact-form-wrap reveal">
            {status === 'sent' ? (
              <div className="form-success" role="status">
                <span className="success-icon">
                  <FiCheckCircle aria-hidden="true" />
                </span>
                <h3>Message sent — thank you!</h3>
                <p>
                  I&apos;ll get back to you within one business day. If it&apos;s urgent, email me
                  directly at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                </p>
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <h2 className="form-title">Send a message</h2>

                <div className="form-row">
                  <Field name="name" label="Your name" error={errors.name}>
                    <input
                      type="text"
                      placeholder="Ada Lovelace"
                      autoComplete="name"
                      {...inputProps('name')}
                    />
                  </Field>

                  <Field name="email" label="Email address" error={errors.email}>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      {...inputProps('email')}
                    />
                  </Field>
                </div>

                <Field name="subject" label="Subject" hint="Optional — e.g. “New dashboard build”">
                  <input
                    type="text"
                    placeholder="What’s this about?"
                    {...inputProps('subject')}
                  />
                </Field>

                <Field
                  name="message"
                  label="Message"
                  error={errors.message}
                  hint="A few sentences about goals, timeline and budget is perfect."
                >
                  <textarea
                    rows="6"
                    placeholder="Hi Mash, I’m building…"
                    {...inputProps('message')}
                  />
                </Field>

                <button type="submit" className="btn btn-lg submit-btn" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <FiSend aria-hidden="true" />
                    </>
                  )}
                </button>

                <p className="form-note">
                  Prefer email? Write to{' '}
                  <a href={`mailto:${profile.email}`}>{profile.email}</a> — {profile.responseTime}.
                </p>
              </form>
            )}
          </div>
        </div>

        <section className="contact-socials-section">
          <div className="section-head">
            <span className="eyebrow reveal">Elsewhere</span>
            <h2 className="title reveal">
              Find me <span className="accent">online</span>
            </h2>
            <p className="section-sub reveal">
              I share work in progress, experiments and the occasional strong opinion about
              interfaces.
            </p>
          </div>

          <div className="social-cards">
            {profile.socials.map((social) => {
              const Icon = getSocialIcon(social.icon);
              const isExternal = social.href.startsWith('http');

              return (
                <a
                  className="social-card reveal"
                  key={social.label}
                  href={social.href}
                  {...(isExternal
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                >
                  <span className="social-card-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="social-card-text">
                    <strong>{social.label}</strong>
                    <span>{social.handle}</span>
                  </span>
                  <FiArrowUpRight className="social-card-arrow" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
