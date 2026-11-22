import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as seed from '../utils/data';
import { api } from '../lib/api';

const STORAGE_KEY = 'mash-folio-content-v1';

/**
 * The default document is also the shape the API validates. Public pages read
 * the server copy; the dashboard writes it back through the Express API.
 */
const defaultContent = {
  profile: seed.profile,
  about: seed.about,
  stats: seed.stats,
  services: seed.services,
  skills: seed.skills,
  techStack: seed.techStack,
  experience: seed.experience,
  projects: seed.projects,
  projectFilters: seed.projectFilters,
  processSteps: seed.processSteps,
  testimonials: seed.testimonials,
  articles: seed.articles,
  heroCode: seed.heroCode,
};

const ContentContext = createContext(null);

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
          throw new Error(`Unsafe link "${link}". Use http(s), mailto, tel or a relative path.`);
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeContent(candidate) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    throw new Error('Content must be a JSON object.');
  }

  const next = clone(defaultContent);

  for (const key of Object.keys(defaultContent)) {
    if (!(key in candidate)) continue;
    const value = candidate[key];

    if (Array.isArray(defaultContent[key])) {
      if (!Array.isArray(value)) throw new Error(`"${key}" must be an array.`);
      next[key] = value;
    } else if (typeof defaultContent[key] === 'object') {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`"${key}" must be an object.`);
      }
      next[key] = { ...defaultContent[key], ...value };
    }
  }

  const arrayOr = (value, fallback) => (Array.isArray(value) ? value : fallback);

  next.profile.roles = arrayOr(next.profile.roles, defaultContent.profile.roles);
  next.profile.socials = arrayOr(next.profile.socials, defaultContent.profile.socials);
  next.about.paragraphs = arrayOr(next.about.paragraphs, defaultContent.about.paragraphs);
  next.about.points = arrayOr(next.about.points, defaultContent.about.points);
  next.skills.frontend = arrayOr(next.skills.frontend, defaultContent.skills.frontend);
  next.skills.backend = arrayOr(next.skills.backend, defaultContent.skills.backend);
  next.heroCode = {
    ...defaultContent.heroCode,
    lines: arrayOr(next.heroCode.lines, defaultContent.heroCode.lines),
  };

  return guardLinks(next);
}

function readCache() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeContent(JSON.parse(raw)) : null;
  } catch (error) {
    return null;
  }
}

function writeCache(content) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch (error) {
    /* cache is best-effort */
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => readCache() ?? clone(defaultContent));
  const [status, setStatus] = useState('loading'); // loading | ready | offline
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error | locked
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const latest = useRef(content);
  const timer = useRef(null);

  useEffect(() => {
    let cancelled = false;

    api
      .getContent()
      .then((data) => {
        if (cancelled) return;

        if (data?.content) {
          const next = normalizeContent(data.content);
          latest.current = next;
          setContent(next);
          writeCache(next);
        }

        setLastSavedAt(data?.updatedAt ? Date.parse(data.updatedAt) : null);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('offline');
      });

    return () => {
      cancelled = true;
      clearTimeout(timer.current);
    };
  }, []);

  const persist = useCallback((next) => {
    writeCache(next);
    setSaveState('saving');
    clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      try {
        const data = await api.saveContent(next);
        setSaveState('saved');
        setLastSavedAt(data?.updatedAt ? Date.parse(data.updatedAt) : Date.now());
      } catch (error) {
        setSaveState(error.status === 401 ? 'locked' : 'error');
      }
    }, 500);
  }, []);

  const commit = useCallback(
    (mutator) => {
      const candidate = typeof mutator === 'function' ? mutator(latest.current) : mutator;
      const next = normalizeContent(candidate);

      latest.current = next;
      setContent(next);
      persist(next);
      return next;
    },
    [persist]
  );

  const value = useMemo(
    () => ({
      ...content,
      content,
      status,
      saveState,
      lastSavedAt,
      storageKey: STORAGE_KEY,

      setSection: (key, nextValue) => commit((current) => ({ ...current, [key]: nextValue })),

      updateMany: (partial) => commit((current) => ({ ...current, ...partial })),

      updateProfile: (patch) =>
        commit((current) => ({ ...current, profile: { ...current.profile, ...patch } })),

      updateAbout: (patch) =>
        commit((current) => ({ ...current, about: { ...current.about, ...patch } })),

      reset: () => commit(() => clone(defaultContent)),

      exportJSON: () => JSON.stringify(content, null, 2),

      importJSON: (text) => {
        let parsed;

        try {
          parsed = JSON.parse(text);
        } catch (error) {
          throw new Error('That file is not valid JSON.');
        }

        const normalized = normalizeContent(parsed);
        commit(() => normalized);
        return normalized;
      },
    }),
    [content, status, saveState, lastSavedAt, commit]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used inside a ContentProvider');
  return context;
}
