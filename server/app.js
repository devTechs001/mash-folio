import { existsSync } from 'node:fs';
import path from 'node:path';
import compression from 'compression';
import express from 'express';
import {
  SESSION_COOKIE,
  SessionStore,
  readSession,
  serializeCookie,
  verifyPassword,
} from './lib/auth.js';
import { HttpError } from './lib/errors.js';
import { ContentStore, MessageStore } from './lib/store.js';
import { sanitizeContent, sanitizeMessage } from './lib/validation.js';

const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createRateLimiter({ windowMs, max, message, code }) {
  const hits = new Map();

  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;

    if (entry.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return next(new HttpError(429, message, code));
    }

    return next();
  };
}

export function createApp({
  config,
  dataDir = config.dataDir,
  sessions = new SessionStore(config.sessionTtlMs),
  logger = console,
} = {}) {
  const app = express();
  const contentStore = new ContentStore(path.join(dataDir, 'content.json'));
  const messageStore = new MessageStore(path.join(dataDir, 'messages.json'));

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));

  const requireJson = (req, res, next) => {
    if (!req.is('application/json')) {
      return next(new HttpError(415, 'Send a JSON body.', 'unsupported_media_type'));
    }
    return next();
  };

  const requireAuth = (req, res, next) => {
    const { session } = readSession(req, sessions);
    if (!session) {
      return next(new HttpError(401, 'Please sign in to continue.', 'unauthorized'));
    }
    req.session = session;
    return next();
  };

  const loginLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: 'Too many sign-in attempts. Try again in a few minutes.',
    code: 'rate_limited',
  });

  const messageLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 6,
    message: 'Too many messages from this address. Try again later.',
    code: 'rate_limited',
  });

  /* ------------------------------ health ------------------------------- */

  app.get('/api/health', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ok: true,
      service: 'mash-folio-api',
      configured: config.configured,
      time: new Date().toISOString(),
    });
  });

  /* ------------------------------- auth -------------------------------- */

  app.get('/api/auth/me', (req, res) => {
    const { session } = readSession(req, sessions);
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      authenticated: Boolean(session),
      configured: config.configured,
      email: session?.email ?? null,
      expiresAt: session?.expiresAt ?? null,
      sessionHours: config.sessionHours,
    });
  });

  app.post(
    '/api/auth/login',
    requireJson,
    loginLimiter,
    asyncRoute(async (req, res) => {
      if (!config.configured) {
        throw new HttpError(
          503,
          'Admin access is not configured on the server. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH.',
          'not_configured'
        );
      }

      const email = String(req.body?.email ?? '').trim().toLowerCase();
      const password = String(req.body?.password ?? '');

      if (!email || !password) {
        throw new HttpError(400, 'Enter your email and password.', 'invalid_credentials');
      }

      const valid = email === config.adminEmail && verifyPassword(password, config.adminPasswordHash);

      if (!valid) {
        await delay(180);
        throw new HttpError(401, 'Those credentials do not match.', 'invalid_credentials');
      }

      const { token, expiresAt } = sessions.create(config.adminEmail);

      res.setHeader(
        'Set-Cookie',
        serializeCookie(SESSION_COOKIE, token, {
          maxAge: config.sessionTtlMs / 1000,
          secure: config.secureCookies,
        })
      );
      res.setHeader('Cache-Control', 'no-store');
      res.json({ authenticated: true, configured: true, email: config.adminEmail, expiresAt });
    })
  );

  app.post('/api/auth/logout', (req, res) => {
    const { token } = readSession(req, sessions);
    sessions.destroy(token);
    res.setHeader(
      'Set-Cookie',
      serializeCookie(SESSION_COOKIE, '', { maxAge: 0, secure: config.secureCookies })
    );
    res.setHeader('Cache-Control', 'no-store');
    res.json({ authenticated: false });
  });

  /* ------------------------------ content ------------------------------ */

  app.get(
    '/api/content',
    asyncRoute(async (req, res) => {
      const record = await contentStore.read();
      res.setHeader('Cache-Control', 'no-store');
      res.json(record);
    })
  );

  app.put(
    '/api/content',
    requireAuth,
    requireJson,
    asyncRoute(async (req, res) => {
      const content = sanitizeContent(req.body?.content);
      const record = await contentStore.save(content);
      res.json(record);
    })
  );

  /* ------------------------------ messages ----------------------------- */

  app.post(
    '/api/messages',
    requireJson,
    messageLimiter,
    asyncRoute(async (req, res) => {
      const clean = sanitizeMessage(req.body);
      const message = await messageStore.add(clean);
      res.status(201).json({ message });
    })
  );

  app.get(
    '/api/messages',
    requireAuth,
    asyncRoute(async (req, res) => {
      const messages = await messageStore.list();
      res.setHeader('Cache-Control', 'no-store');
      res.json({
        messages,
        unread: messages.filter((message) => !message.read).length,
      });
    })
  );

  app.patch(
    '/api/messages/:id',
    requireAuth,
    requireJson,
    asyncRoute(async (req, res) => {
      if (typeof req.body?.read !== 'boolean') {
        throw new HttpError(400, '"read" must be true or false.', 'invalid_message');
      }
      const message = await messageStore.setRead(req.params.id, req.body.read);
      res.json({ message });
    })
  );

  app.delete(
    '/api/messages/:id',
    requireAuth,
    asyncRoute(async (req, res) => {
      await messageStore.remove(req.params.id);
      res.status(204).end();
    })
  );

  app.delete(
    '/api/messages',
    requireAuth,
    asyncRoute(async (req, res) => {
      await messageStore.clear();
      res.status(204).end();
    })
  );

  app.use('/api', (req, res, next) => {
    next(new HttpError(404, 'Unknown API endpoint.', 'not_found'));
  });

  /* ------------------------- static SPA (prod) ------------------------- */

  const indexFile = path.join(config.distDir, 'index.html');

  if (existsSync(indexFile)) {
    app.use(
      express.static(config.distDir, {
        index: false,
        setHeaders(res, filePath) {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
      })
    );

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.setHeader('Cache-Control', 'no-cache');
      return res.sendFile(indexFile);
    });
  }

  app.use((req, res, next) => {
    next(new HttpError(404, 'Not found.', 'not_found'));
  });

  /* --------------------------- error handler --------------------------- */

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    let status = 500;
    let message = 'Something went wrong on the server.';
    let code = 'server_error';

    if (error instanceof HttpError) {
      status = error.status;
      message = error.message;
      code = error.code;
    }

    if (error.type === 'entity.parse.failed' || error instanceof SyntaxError) {
      status = 400;
      message = 'The request body is not valid JSON.';
      code = 'invalid_json';
    } else if (error.type === 'entity.too.large') {
      status = 413;
      message = 'The request body is too large.';
      code = 'payload_too_large';
    }

    if (status >= 500 && !(error instanceof HttpError)) {
      logger.error('[api]', error);
    }

    res.status(status).json({ error: message, code });
  });

  return app;
}
