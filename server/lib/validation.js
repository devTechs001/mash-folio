import { HttpError } from './errors.js';

/** Shape guard for the content document the dashboard saves. */
const CONTENT_SHAPES = {
  profile: 'object',
  about: 'object',
  stats: 'array',
  services: 'array',
  skills: 'object',
  techStack: 'array',
  experience: 'array',
  projects: 'array',
  projectFilters: 'array',
  processSteps: 'array',
  testimonials: 'array',
  articles: 'array',
  heroCode: 'object',
};

export const CONTENT_KEYS = Object.keys(CONTENT_SHAPES);

const LINK_KEYS = new Set(['href', 'url', 'source', 'live']);
const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/i;

function guardLinks(value) {
  if (Array.isArray(value)) return value.map(guardLinks);

  if (value && typeof value === 'object') {
    const out = {};

    for (const [key, entry] of Object.entries(value)) {
      if (LINK_KEYS.has(key) && typeof entry === 'string' && entry.trim() !== '') {
        const link = entry.trim();
        if (!SAFE_URL.test(link)) {
          throw new HttpError(
            400,
            `Unsafe link "${link}". Use http(s), mailto, tel or a relative path.`,
            'invalid_content'
          );
        }
        out[key] = link;
      } else {
        out[key] = guardLinks(entry);
      }
    }

    return out;
  }

  return value;
}

export function sanitizeContent(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new HttpError(400, 'Content must be a JSON object.', 'invalid_content');
  }

  const content = {};

  for (const [key, type] of Object.entries(CONTENT_SHAPES)) {
    if (!(key in input)) continue;
    const value = input[key];
    const valid =
      type === 'array'
        ? Array.isArray(value)
        : Boolean(value) && typeof value === 'object' && !Array.isArray(value);

    if (!valid) {
      throw new HttpError(400, `"${key}" must be an ${type}.`, 'invalid_content');
    }

    content[key] = guardLinks(value);
  }

  if (Object.keys(content).length === 0) {
    throw new HttpError(400, 'No known content sections were provided.', 'invalid_content');
  }

  return content;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value, { label, min = 0, max }) {
  const clean = String(value ?? '').trim();

  if (clean.length < min) {
    throw new HttpError(400, `${label} is too short.`, 'invalid_message');
  }

  if (clean.length > max) {
    throw new HttpError(400, `${label} must be ${max} characters or fewer.`, 'invalid_message');
  }

  return clean;
}

export function sanitizeMessage(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new HttpError(400, 'Message must be a JSON object.', 'invalid_message');
  }

  const name = text(input.name, { label: 'Name', min: 2, max: 80 });
  const email = text(input.email, { label: 'Email', min: 5, max: 160 });

  if (!EMAIL_PATTERN.test(email)) {
    throw new HttpError(400, 'That email address does not look right.', 'invalid_message');
  }

  const subject = text(input.subject, { label: 'Subject', max: 120 }) || 'New enquiry';
  const message = text(input.message, { label: 'Message', min: 20, max: 5000 });

  return { name, email, subject, message };
}
