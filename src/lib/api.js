const BASE = String(import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, code = undefined } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request(pathname, { method = 'GET', body, signal } = {}) {
  let response;

  try {
    response = await fetch(`${BASE}${pathname}`, {
      method,
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Cannot reach the API. Is the Node server running?', {
      status: 0,
      code: 'network_error',
    });
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.error || `Request failed (${response.status}).`, {
      status: response.status,
      code: data?.code,
    });
  }

  return data;
}

export const api = {
  me: () => request('/api/auth/me'),
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  getContent: () => request('/api/content'),
  saveContent: (content) => request('/api/content', { method: 'PUT', body: { content } }),

  getMessages: () => request('/api/messages'),
  sendMessage: (message) => request('/api/messages', { method: 'POST', body: message }),
  setMessageRead: (id, read) =>
    request(`/api/messages/${encodeURIComponent(id)}`, { method: 'PATCH', body: { read } }),
  deleteMessage: (id) =>
    request(`/api/messages/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  clearMessages: () => request('/api/messages', { method: 'DELETE' }),
};
