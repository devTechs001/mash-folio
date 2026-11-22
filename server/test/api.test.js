import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { createApp } from '../app.js';
import { sha256 } from '../lib/auth.js';
import { loadConfig } from '../lib/config.js';

const EMAIL = 'owner@test.dev';
const PASSWORD = 'correct horse battery staple';

let server;
let base;
let dataDir;
let cookie = '';

async function call(pathname, { method = 'GET', body, useCookie = true } = {}) {
  const headers = {};

  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (useCookie && cookie) headers.Cookie = cookie;

  const response = await fetch(`${base}${pathname}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const setCookies = response.headers.getSetCookie?.() ?? [];
  const sessionCookie = setCookies.find((value) => value.startsWith('folio_sid='));

  if (sessionCookie) {
    const pair = sessionCookie.split(';')[0];
    cookie = pair === 'folio_sid=' ? '' : pair;
  }

  const text = await response.text();
  return { status: response.status, data: text ? JSON.parse(text) : null, headers: response.headers };
}

before(async () => {
  dataDir = await mkdtemp(path.join(tmpdir(), 'mash-folio-api-'));
  const config = loadConfig({
    ADMIN_EMAIL: EMAIL,
    ADMIN_PASSWORD_HASH: sha256(PASSWORD),
    ADMIN_SESSION_HOURS: '1',
  });
  config.dataDir = dataDir;

  const app = createApp({ config, dataDir, logger: { error() {} } });
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  server.closeAllConnections?.();
  await new Promise((resolve) => server.close(resolve));
  await rm(dataDir, { recursive: true, force: true });
});

const sampleContent = {
  profile: { name: 'API Tester', firstName: 'Api', roles: ['Tester'], socials: [] },
  projects: [],
  stats: [],
};

test('health reports the API and admin configuration', async () => {
  const { status, data } = await call('/api/health');
  assert.equal(status, 200);
  assert.equal(data.ok, true);
  assert.equal(data.service, 'mash-folio-api');
  assert.equal(data.configured, true);
});

test('guest cannot read messages or write content', async () => {
  const me = await call('/api/auth/me');
  assert.equal(me.status, 200);
  assert.equal(me.data.authenticated, false);
  assert.equal(me.data.email, null);

  const readMessages = await call('/api/messages');
  assert.equal(readMessages.status, 401);

  const writeContent = await call('/api/content', { method: 'PUT', body: { content: sampleContent } });
  assert.equal(writeContent.status, 401);
});

test('wrong credentials are rejected', async () => {
  const wrongPassword = await call('/api/auth/login', {
    method: 'POST',
    body: { email: EMAIL, password: 'nope' },
  });
  assert.equal(wrongPassword.status, 401);

  const wrongEmail = await call('/api/auth/login', {
    method: 'POST',
    body: { email: 'someone@else.dev', password: PASSWORD },
  });
  assert.equal(wrongEmail.status, 401);
  assert.equal(cookie, '');
});

test('login creates a session cookie and /me identifies the owner', async () => {
  const login = await call('/api/auth/login', {
    method: 'POST',
    body: { email: EMAIL.toUpperCase(), password: PASSWORD },
  });
  assert.equal(login.status, 200);
  assert.equal(login.data.authenticated, true);
  assert.equal(login.data.email, EMAIL);
  assert.match(cookie, /^folio_sid=[a-f0-9]{64}$/);

  const me = await call('/api/auth/me');
  assert.equal(me.data.authenticated, true);
  assert.equal(me.data.email, EMAIL);
});

test('content starts empty, validates, saves and is public to read', async () => {
  const empty = await call('/api/content');
  assert.equal(empty.status, 200);
  assert.equal(empty.data.content, null);
  assert.equal(empty.data.updatedAt, null);

  const invalid = await call('/api/content', {
    method: 'PUT',
    body: { content: { projects: 'not-an-array' } },
  });
  assert.equal(invalid.status, 400);
  assert.equal(invalid.data.code, 'invalid_content');

  const unsafe = await call('/api/content', {
    method: 'PUT',
    body: { content: { profile: { socials: [{ href: 'javascript:alert(1)' }] }, projects: [] } },
  });
  assert.equal(unsafe.status, 400);
  assert.equal(unsafe.data.code, 'invalid_content');

  const saved = await call('/api/content', { method: 'PUT', body: { content: sampleContent } });
  assert.equal(saved.status, 200);
  assert.equal(saved.data.content.profile.name, 'API Tester');
  assert.match(saved.data.updatedAt, /^\d{4}-\d{2}-\d{2}T/);

  const publicRead = await call('/api/content', { useCookie: false });
  assert.equal(publicRead.data.content.profile.firstName, 'Api');
});

test('messages accept validated submissions and support the full owner workflow', async () => {
  const tooShort = await call('/api/messages', {
    method: 'POST',
    body: { name: 'A', email: 'not-an-email', message: 'short' },
  });
  assert.equal(tooShort.status, 400);
  assert.equal(tooShort.data.code, 'invalid_message');

  const created = await call('/api/messages', {
    method: 'POST',
    body: {
      name: 'Grace Wanjiru',
      email: 'grace@example.com',
      subject: 'New website',
      message: 'Could we build a portfolio like this for my studio next month?',
    },
  });
  assert.equal(created.status, 201);
  assert.equal(created.data.message.read, false);
  assert.ok(created.data.message.id);

  const inbox = await call('/api/messages');
  assert.equal(inbox.status, 200);
  assert.equal(inbox.data.messages.length, 1);
  assert.equal(inbox.data.unread, 1);

  const id = inbox.data.messages[0].id;
  const marked = await call(`/api/messages/${id}`, { method: 'PATCH', body: { read: true } });
  assert.equal(marked.status, 200);
  assert.equal(marked.data.message.read, true);

  const afterRead = await call('/api/messages');
  assert.equal(afterRead.data.unread, 0);

  const removed = await call(`/api/messages/${id}`, { method: 'DELETE' });
  assert.equal(removed.status, 204);

  const cleared = await call('/api/messages', { method: 'DELETE' });
  assert.equal(cleared.status, 204);

  const finalInbox = await call('/api/messages');
  assert.equal(finalInbox.data.messages.length, 0);
});

test('logout destroys the session', async () => {
  const logout = await call('/api/auth/logout', { method: 'POST' });
  assert.equal(logout.status, 200);
  assert.equal(cookie, '');

  const me = await call('/api/auth/me');
  assert.equal(me.data.authenticated, false);
});

test('unconfigured servers refuse login with a helpful error', async () => {
  const config = loadConfig({});
  const app = createApp({
    config,
    dataDir: path.join(dataDir, 'unconfigured'),
    logger: { error() {} },
  });
  const other = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => other.once('listening', resolve));
  const port = other.address().port;

  const response = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'owner@test.dev', password: 'anything' }),
  });

  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.code, 'not_configured');

  other.closeAllConnections?.();
  await new Promise((resolve) => other.close(resolve));
});
