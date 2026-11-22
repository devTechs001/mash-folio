import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMail, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated, configured, sessionHours } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const from = location.state?.from?.pathname ?? '/admin';

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (submitError) {
      setError(submitError.message || 'Could not sign you in.');
      setBusy(false);
    }
  };

  return (
    <div className="adm-auth">
      <div className="adm-auth-glow" aria-hidden="true" />

      <main className="adm-auth-card">
        <Link to="/" className="adm-auth-back">
          <FiArrowLeft aria-hidden="true" />
          Back to portfolio
        </Link>

        <div className="adm-auth-brand">
          <span className="adm-brand-mark" aria-hidden="true">
            M
          </span>
          <div>
            <p>
              mash<span className="adm-brand-dot">.</span>folio
            </p>
            <span>Owner access</span>
          </div>
        </div>

        <h1>
          Welcome back<span className="adm-auth-accent">.</span>
        </h1>
        <p className="adm-auth-sub">
          Sign in to edit the profile, projects and every front page of this portfolio.
        </p>

        {!configured && (
          <div className="adm-alert adm-alert-warn" role="alert">
            <FiShield aria-hidden="true" />
            <div>
              <strong>Admin is not configured yet.</strong>
              <ol>
                <li>
                  Copy <code>.env.example</code> to <code>.env.local</code>.
                </li>
                <li>
                  Generate a hash: <code>npm run auth:hash &quot;your-password&quot;</code>.
                </li>
                <li>
                  Set <code>VITE_ADMIN_EMAIL</code> and <code>VITE_ADMIN_PASSWORD_HASH</code>, then
                  restart the dev server (or add them in Render).
                </li>
              </ol>
            </div>
          </div>
        )}

        <form className="adm-auth-form" onSubmit={handleSubmit} noValidate>
          <label className="adm-field" htmlFor="admin-email">
            <span className="adm-label">Email</span>
            <span className="adm-input-wrap">
              <FiMail aria-hidden="true" />
              <input
                id="admin-email"
                name="email"
                type="email"
                className="adm-input"
                autoComplete="username"
                placeholder="owner@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </span>
          </label>

          <label className="adm-field" htmlFor="admin-password">
            <span className="adm-label">Password</span>
            <span className="adm-input-wrap">
              <FiLock aria-hidden="true" />
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="adm-input"
                autoComplete="current-password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="adm-pw-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
              </button>
            </span>
          </label>

          <div className="adm-auth-row">
            <label className="adm-check">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Keep me signed in on this device</span>
            </label>
            <span className="adm-hint">{sessionHours}h session</span>
          </div>

          {error && (
            <p className="adm-alert adm-alert-error" role="alert">
              <FiAlertCircle aria-hidden="true" />
              {error}
            </p>
          )}

          <button type="submit" className="adm-btn adm-btn-primary adm-btn-block" disabled={busy}>
            {busy ? 'Checking credentials…' : 'Enter dashboard'}
          </button>
        </form>

        <p className="adm-auth-note">
          <FiShield aria-hidden="true" />
          Credentials live in environment variables — only a SHA-256 hash is bundled. For
          production-grade enforcement, pair this with a server or edge function.
        </p>
      </main>
    </div>
  );
}
