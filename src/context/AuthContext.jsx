import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SESSION_KEY = 'mash-folio-admin-session';

const ADMIN_EMAIL = String(import.meta.env.VITE_ADMIN_EMAIL ?? '').trim().toLowerCase();
const ADMIN_HASH = String(import.meta.env.VITE_ADMIN_PASSWORD_HASH ?? '').trim().toLowerCase();
const SESSION_HOURS = Number(import.meta.env.VITE_ADMIN_SESSION_HOURS) || 8;

/** Admin is usable only when both env values look sane. */
const CONFIGURED = Boolean(ADMIN_EMAIL) && /^[a-f0-9]{64}$/.test(ADMIN_HASH);

const AuthContext = createContext(null);

async function sha256Hex(value) {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error(
      'Secure hashing is unavailable in this context. Open the site over HTTPS or localhost.'
    );
  }

  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function clearStoredSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    /* ignore */
  }

  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    /* ignore */
  }
}

function readStoredSession() {
  if (typeof window === 'undefined') return null;

  const sources = [
    { store: window.localStorage, remember: true },
    { store: window.sessionStorage, remember: false },
  ];

  for (const { store, remember } of sources) {
    try {
      const raw = store.getItem(SESSION_KEY);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      const valid =
        parsed &&
        typeof parsed.expiresAt === 'number' &&
        parsed.expiresAt > Date.now() &&
        typeof parsed.email === 'string';

      if (!valid) {
        store.removeItem(SESSION_KEY);
        continue;
      }

      return { email: parsed.email, expiresAt: parsed.expiresAt, remember };
    } catch (error) {
      /* ignore malformed sessions */
    }
  }

  return null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const isAuthenticated = Boolean(session && session.expiresAt > Date.now());

  // Auto sign-out when the session expires.
  useEffect(() => {
    if (!session) return undefined;

    const remaining = session.expiresAt - Date.now();

    if (remaining <= 0) {
      clearStoredSession();
      setSession(null);
      return undefined;
    }

    const timer = setTimeout(() => {
      clearStoredSession();
      setSession(null);
    }, Math.min(remaining, 2_147_483_647));

    return () => clearTimeout(timer);
  }, [session]);

  // Keep tabs in sync when signing in/out elsewhere.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === SESSION_KEY) setSession(readStoredSession());
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(() => {
    const login = async ({ email, password, remember = false }) => {
      if (!CONFIGURED) {
        throw new Error(
          'Admin access is not configured yet. Add VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD_HASH.'
        );
      }

      if (!email?.trim() || !password) {
        throw new Error('Enter your email and password to continue.');
      }

      if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
        throw new Error('Those credentials do not match.');
      }

      const hash = await sha256Hex(password);

      if (hash !== ADMIN_HASH) {
        throw new Error('Those credentials do not match.');
      }

      const next = {
        email: ADMIN_EMAIL,
        expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
        remember: Boolean(remember),
      };

      try {
        clearStoredSession();
        const store = remember ? window.localStorage : window.sessionStorage;
        store.setItem(SESSION_KEY, JSON.stringify(next));
      } catch (error) {
        /* session still works for this tab */
      }

      setSession(next);
      return next;
    };

    const logout = () => {
      clearStoredSession();
      setSession(null);
    };

    return {
      configured: CONFIGURED,
      email: CONFIGURED ? ADMIN_EMAIL : '',
      sessionHours: SESSION_HOURS,
      session,
      isAuthenticated,
      login,
      logout,
    };
  }, [session, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
}
