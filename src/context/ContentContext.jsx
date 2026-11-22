import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as seed from '../utils/data';

const STORAGE_KEY = 'mash-folio-content-v1';

/**
 * Everything the public site renders lives here. The admin dashboard edits this
 * object and persists it to localStorage, so changes show up on the front pages
 * immediately (and across tabs via the storage event).
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Merge a candidate object with the defaults and guard against malformed data,
 * so a bad import can never blank out the site.
 */
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

  return next;
}

function loadContent() {
  if (typeof window === 'undefined') return clone(defaultContent);

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(defaultContent);
    return normalizeContent(JSON.parse(raw));
  } catch (error) {
    return clone(defaultContent);
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadContent);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setLastSavedAt(Date.now());
    } catch (error) {
      /* storage may be full or blocked — edits still work for this session */
    }
  }, [content]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      try {
        if (!event.newValue) {
          setContent(clone(defaultContent));
          return;
        }
        setContent(normalizeContent(JSON.parse(event.newValue)));
      } catch (error) {
        /* ignore malformed cross-tab data */
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(
    () => ({
      ...content,
      content,
      lastSavedAt,
      storageKey: STORAGE_KEY,

      setSection: (key, nextValue) => {
        setContent((current) => ({ ...current, [key]: nextValue }));
      },

      updateMany: (partial) => {
        setContent((current) => ({ ...current, ...partial }));
      },

      updateProfile: (patch) => {
        setContent((current) => ({ ...current, profile: { ...current.profile, ...patch } }));
      },

      updateAbout: (patch) => {
        setContent((current) => ({ ...current, about: { ...current.about, ...patch } }));
      },

      reset: () => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          /* ignore */
        }
        setContent(clone(defaultContent));
      },

      exportJSON: () => JSON.stringify(content, null, 2),

      importJSON: (text) => {
        let parsed;

        try {
          parsed = JSON.parse(text);
        } catch (error) {
          throw new Error('That file is not valid JSON.');
        }

        const next = normalizeContent(parsed);
        setContent(next);
        return next;
      },
    }),
    [content, lastSavedAt]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used inside a ContentProvider');
  return context;
}
