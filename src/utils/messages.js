/**
 * Tiny localStorage-backed inbox so the contact form and the dashboard are
 * actually connected. Swap these helpers for your API calls when you add a
 * backend (see README → Admin).
 */
const STORAGE_KEY = 'mash-folio-messages-v1';

export const MESSAGES_EVENT = 'mash-folio:messages';

function readAll() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeAll(list) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    /* storage can be blocked — the dashboard will simply show nothing */
  }

  window.dispatchEvent(new CustomEvent(MESSAGES_EVENT));
}

export function getMessages() {
  return readAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function addMessage({ name, email, subject, message }) {
  const entry = {
    id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: String(name ?? '').trim(),
    email: String(email ?? '').trim(),
    subject: String(subject ?? '').trim() || 'New enquiry',
    message: String(message ?? '').trim(),
    createdAt: Date.now(),
    read: false,
  };

  writeAll([entry, ...readAll()]);
  return entry;
}

export function setMessageRead(id, read = true) {
  writeAll(readAll().map((item) => (item.id === id ? { ...item, read } : item)));
}

export function deleteMessage(id) {
  writeAll(readAll().filter((item) => item.id !== id));
}

export function clearMessages() {
  writeAll([]);
}
