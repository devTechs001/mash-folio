import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'folio_sid';

export function sha256(value) {
  return createHash('sha256').update(String(value), 'utf8').digest('hex');
}

/** Compare the SHA-256 of the submitted password with the configured digest. */
export function verifyPassword(password, expectedHash) {
  if (typeof password !== 'string' || !/^[a-f0-9]{64}$/i.test(String(expectedHash ?? ''))) {
    return false;
  }

  const actual = Buffer.from(sha256(password), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export class SessionStore {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.sessions = new Map();
    this.timer = setInterval(() => this.prune(), 10 * 60 * 1000);
    this.timer.unref?.();
  }

  create(email) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = Date.now() + this.ttlMs;
    this.sessions.set(token, { email, expiresAt, createdAt: Date.now() });
    return { token, expiresAt };
  }

  get(token) {
    if (!token) return null;
    const session = this.sessions.get(token);
    if (!session) return null;

    if (session.expiresAt <= Date.now()) {
      this.sessions.delete(token);
      return null;
    }

    return session;
  }

  destroy(token) {
    if (token) this.sessions.delete(token);
  }

  prune() {
    const now = Date.now();
    for (const [token, session] of this.sessions) {
      if (session.expiresAt <= now) this.sessions.delete(token);
    }
  }
}

export function parseCookies(header = '') {
  const jar = {};

  for (const part of String(header).split(';')) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    const name = part.slice(0, index).trim();
    if (!name) continue;
    try {
      jar[name] = decodeURIComponent(part.slice(index + 1).trim());
    } catch (error) {
      jar[name] = part.slice(index + 1).trim();
    }
  }

  return jar;
}

export function serializeCookie(name, value, { maxAge, secure = false, path = '/' } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, 'HttpOnly', 'SameSite=Lax'];

  if (typeof maxAge === 'number') parts.push(`Max-Age=${Math.max(0, Math.floor(maxAge))}`);
  if (secure) parts.push('Secure');

  return parts.join('; ');
}

export function readSession(req, sessions) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  return { token, session: sessions.get(token) };
}
